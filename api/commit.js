// /api/commit.js  (Vercel Serverless Function - Node.js runtime, CommonJS)

/**
 * Espera un POST con JSON:
 * {
 *   "message": "Update perfumes.json desde Admin",
 *   "json": [ { nombre, precio, descripcion, imagen }, ... ]
 * }
 *
 * Variables de entorno en Vercel:
 *  - GITHUB_TOKEN
 *  - GITHUB_OWNER
 *  - GITHUB_REPO
 *  - GITHUB_BRANCH         (ej: "main")
 *  - GITHUB_FILE_PATH      (ej: "public/perfumes.json")
 */

module.exports = async(req, res) => {
    try {
        if (req.method !== "POST") {
            res.setHeader("Allow", "POST");
            return res.status(405).json({ error: "Method not allowed" });
        }

        // Parsear body con fallback
        var body = req.body;
        if (typeof body === "string") {
            try { body = JSON.parse(body); } catch (e) { body = {}; }
        }
        if (!body) body = {};

        var message = (body && body.message) ? String(body.message) : "Update perfumes.json";
        var items = (body && Array.isArray(body.json)) ? body.json : null;

        if (!items) {
            return res.status(400).json({ error: "Body.json debe ser un array" });
        }

        // ENV
        var owner = process.env.GITHUB_OWNER;
        var repo = process.env.GITHUB_REPO;
        var branch = process.env.GITHUB_BRANCH || "main";
        var path = process.env.GITHUB_FILE_PATH || "public/perfumes.json";
        var token = process.env.GITHUB_TOKEN;

        if (!owner || !repo || !token) {
            return res.status(500).json({ error: "Faltan variables de entorno (OWNER/REPO/TOKEN)" });
        }

        // 1) Obtener SHA actual (si existe)
        var getUrl = "https://api.github.com/repos/" + owner + "/" + repo + "/contents/" +
            encodeURIComponent(path) + "?ref=" + encodeURIComponent(branch);

        var getResp = await fetch(getUrl, {
            headers: {
                Authorization: "Bearer " + token,
                "User-Agent": "vercel-commit"
            }
        });

        var sha = undefined;
        if (getResp.ok) {
            var current = await getResp.json();
            sha = current && current.sha ? current.sha : undefined;
        } else if (getResp.status !== 404) {
            var detail = await getResp.text();
            return res.status(getResp.status).json({ error: "GET file error", detail: detail });
        }

        // 2) Preparar contenido base64
        var contentStr = JSON.stringify(items, null, 2);
        var contentB64 = Buffer.from(contentStr, "utf-8").toString("base64");

        // 3) PUT create/update
        var putUrl = "https://api.github.com/repos/" + owner + "/" + repo + "/contents/" + encodeURIComponent(path);
        var putBody = {
            message: message,
            content: contentB64,
            branch: branch
        };
        if (sha) {
            putBody.sha = sha; // incluir sha si ya existía el archivo
        }

        var putResp = await fetch(putUrl, {
            method: "PUT",
            headers: {
                Authorization: "Bearer " + token,
                "User-Agent": "vercel-commit",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(putBody)
        });

        var result = await putResp.json();
        if (!putResp.ok) {
            return res.status(putResp.status).json({ error: "PUT file error", detail: result });
        }

        // OK
        return res.status(200).json({
            ok: true,
            commit: result && result.commit && result.commit.sha ? result.commit.sha : null,
            path: path
        });
    } catch (err) {
        console.error("commit.js error:", err);
        return res.status(500).json({ error: "Unhandled error", detail: String(err && err.message ? err.message : err) });
    }
};