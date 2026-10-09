import {HttpError} from "../utils/HttpError.js";

const DEFAULT_USERNAME = "admin";
const DEFAULT_PASSWORD = "admin123";

function safeEqual(a, b) {
    if (a.length !== b.length) return false;
    let diff = 0;
    for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
    return diff === 0;
}

export function requireAdmin(req, _res, next) {
    const expectedUser = process.env.ADMIN_USERNAME || DEFAULT_USERNAME;
    const expectedPass = process.env.ADMIN_PASSWORD || DEFAULT_PASSWORD;

    const header = req.get("authorization") ?? "";
    const match = /^Basic\s+(.+)$/i.exec(header.trim());
    if (!match) return next(new HttpError(401, "Unauthorized"));

    let decoded;
    try {
        decoded = Buffer.from(match[1], "base64").toString("utf8");
    } catch {
        return next(new HttpError(401, "Unauthorized"));
    }
    const idx = decoded.indexOf(":");
    if (idx < 0) return next(new HttpError(401, "Unauthorized"));
    const user = decoded.slice(0, idx);
    const pass = decoded.slice(idx + 1);

    if (!safeEqual(user, expectedUser) || !safeEqual(pass, expectedPass)) {
        return next(new HttpError(401, "Unauthorized"));
    }
    return next();
}
