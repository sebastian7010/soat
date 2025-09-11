// /api/commit.js  (Vercel Serverless Function - CommonJS + Debug Logs)

/**
 * POST body esperado:
 * {
 *   "message": "Update perfumes.json",
 *   "json": [ { nombre, precio, descripcion, imagen }, ... ],
 *   "debug": true   // opcional: para incluir logs en la respuesta
 * }
 *
 * Variables de entorno (Vercel → Settings → Environment Variables):
 *  - GITHUB_TOKEN     (fine-grained token con Repository contents: Read & Write)
 *  - GITHUB_OWNER     (ej: "sebastian7010")
 *  - GITHUB_REPO      (ej: "SOAT") // GitHub no es sensible a mayúsculas en el nombre del repo
 *  - GITHUB_BRANCH    (ej: "main")
 *  - GITHUB_FILE_PATH (ej: "perfumes.json" → en la RAÍZ si así está tu archivo)
 */

function parseURL(req) {
    try {
        // req.url es relativo → necesitamos un base
        return new URL(req.url, "https://dummy.local");
    } catch (_) {
        return null;
    }
}

module.exports = async(req, res) => {
    const logs = [];
    const url = parseURL(req);
    const isDebug = (url && url.searchParams.get("debug") === "1");

    function log(...args) {
        const msg = args.map(a => (typeof a === "string" ? a : JSON.stringify(a))).join(" ");
        logs.push(msg);
        console.log("[commit.js]", msg);
    }

    // CORS básico
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
        return res.status(204).end();
    }

    // Health check útil con GET
    if (req.method === "GET") {
        const owner = process.env.GITHUB_OWNER || "";
        const repo = process.env.GITHUB_REPO || "";
        const branch = process.env.GITHUB_BRANCH || "main";
        const path = process.env.GITHUB_FILE_PATH || "perfumes.json";
        const varsOK = !!(process.env.GITHUB_TOKEN && owner && repo);

        return res.status(200).json({
            ok: true,
            note: "Use POST para guardar. GET solo es health-check.",
            env: { owner, repo, branch, path, varsOK }
        });
    }

    if (req.method !== "POST") {
        res.setHeader("Allow", "POST, GET, OPTIONS");
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        // --------- BODY ---------
        let body = req.body;
        if (typeof body === "string") {
            try { body = JSON.parse(body); } catch (_e) { body = {}; }
        }
        if (!body) body = {};

        const message = body.message ? String(body.message) : "Update perfumes.json";
        const items = Array.isArray(body.json) ? body.json : null;
        const wantDebug = !!body.debug || isDebug;

        log("Incoming POST. debug:", String(wantDebug));
        if (!items) {
            log("ERROR: body.json no es un array");
            return res.status(400).json({ error: "Body.json debe ser un array", logs: wantDebug ? logs : undefined });
        }
        log("Items recibidos:", String(items.length));

        // --------- ENV ---------
        const owner = process.env.GITHUB_OWNER;
        const repo = process.env.GITHUB_REPO;
        const branch = process.env.GITHUB_BRANCH || "main";
        const path = process.env.GITHUB_FILE_PATH || "perfumes.json"; // <-- por defecto raíz
        const token = process.env.GITHUB_TOKEN;

        log("ENV ->", JSON.stringify({ owner, repo, branch, path, hasToken: !!token }));

        if (!owner || !repo || !token) {
            log("ERROR: faltan variables de entorno");
            return res.status(500).json({
                error: "Faltan variables de entorno (OWNER/REPO/TOKEN)",
                env: { owner, repo, branch, path, hasToken: !!token },
                logs: wantDebug ? logs : undefined
            });
        }

        // --------- GET FILE (para obtener SHA si existe) ---------
        const getUrl =
            "https://api.github.com/repos/" +
            owner + "/" + repo +
            "/contents/" + encodeURIComponent(path) +
            "?ref=" + encodeURIComponent(branch);

        log("GET URL:", getUrl);
        const getResp = await fetch(getUrl, {
            headers: {
                Authorization: "Bearer " + token,
                "User-Agent": "vercel-commit"
            }
        });
        log("GET status:", String(getResp.status));

        let sha;
        if (getResp.ok) {
            const current = await getResp.json();
            sha = current && current.sha ? current.sha : undefined;
            log("GET ok. sha actual:", String(sha));
        } else if (getResp.status !== 404) {
            const detail = await getResp.text();
            log("GET error body:", detail);
            return res.status(getResp.status).json({ error: "GET file error", detail, logs: wantDebug ? logs : undefined });
        } else {
            log("Archivo no existe aún (404). Se creará.");
        }

        // --------- PREPARAR CONTENIDO ---------
        const contentStr = JSON.stringify(items, null, 2);
        const contentB64 = Buffer.from(contentStr, "utf-8").toString("base64");
        log("Content bytes:", String(Buffer.byteLength(contentStr, "utf-8")));

        // --------- PUT create/update ---------
        const putUrl = "https://api.github.com/repos/" + owner + "/" + repo + "/contents/" + encodeURIComponent(path);
        const putBody = { message, content: contentB64, branch };
        if (sha) putBody.sha = sha;

        log("PUT URL:", putUrl);
        log("PUT body keys:", Object.keys(putBody).join(","));

        const putResp = await fetch(putUrl, {
            method: "PUT",
            headers: {
                Authorization: "Bearer " + token,
                "User-Agent": "vercel-commit",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(putBody)
        });

        const resultText = await putResp.text();
        let resultJSON = null;
        try { resultJSON = JSON.parse(resultText); } catch (_) {}
        log("PUT status:", String(putResp.status));
        log("PUT resp (first 500 chars):", resultText.slice(0, 500));

        if (!putResp.ok) {
            return res.status(putResp.status).json({
                error: "PUT file error",
                detail: resultJSON || resultText,
                logs: wantDebug ? logs : undefined
            });
        }

        const commitSha = resultJSON && resultJSON.commit && resultJSON.commit.sha ? resultJSON.commit.sha : null;

        // --------- OK ---------
        return res.status(200).json({
            ok: true,
            commit: commitSha,
            path,
            branch,
            owner,
            repo,
            logs: wantDebug ? logs : undefined
        });

    } catch (err) {
        console.error("commit.js error:", err);
        logs.push("CATCH error: " + String(err && err.message ? err.message : err));
        return res.status(500).json({
            error: "Unhandled error",
            detail: String(err && err.message ? err.message : err),
            logs
        });
    }
};