// /api/perfumes.js  (Vercel Serverless Function - CommonJS)
"use strict";

module.exports = async function(req, res) {
    // CORS básico
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") return res.status(204).end();
    if (req.method !== "GET") {
        res.setHeader("Allow", "GET, OPTIONS");
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const owner = process.env.GITHUB_OWNER;
        const repo = process.env.GITHUB_REPO;
        const branch = process.env.GITHUB_BRANCH || "main";
        const path = process.env.GITHUB_FILE_PATH || "perfumes.json";
        const token = process.env.GITHUB_TOKEN;

        if (!owner || !repo || !token) {
            return res.status(500).json({ error: "Faltan variables de entorno" });
        }

        // Construcción de URL sin template strings para evitar el warning del TS server
        const url =
            "https://api.github.com/repos/" +
            owner + "/" + repo +
            "/contents/" + encodeURIComponent(path) +
            "?ref=" + encodeURIComponent(branch);

        const gh = await fetch(url, {
            headers: {
                Authorization: "Bearer " + token,
                "User-Agent": "vercel-perfumes-reader"
            }
        });

        if (!gh.ok) {
            const detail = await gh.text();
            return res.status(gh.status).json({ error: "GitHub GET error", detail });
        }

        const file = await gh.json();
        const b64 = (file && file.content) ? file.content : "";
        const content = Buffer.from(b64, "base64").toString("utf-8");

        res.setHeader("Cache-Control", "no-store");
        res.setHeader("Content-Type", "application/json; charset=utf-8");
        return res.status(200).end(content);
    } catch (err) {
        console.error("perfumes.js error:", err);
        return res.status(500).json({ error: "Unhandled error", detail: String(err && err.message ? err.message : err) });
    }
};