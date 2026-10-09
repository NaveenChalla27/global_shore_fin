// Generic helper for "wrapper-key" JSON collections, e.g. {"bookings": [...]}.
import {randomUUID} from "node:crypto";
import {readJson, writeJson} from "./jsonStore.js";

export function createCollection(file, key) {
    async function readAll() {
        const data = await readJson(file, {[key]: []});
        return Array.isArray(data[key]) ? data[key] : [];
    }

    return {
        // Newest first.
        async list() {
            const items = await readAll();
            return [...items].sort((a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? ""));
        },
        async add(fields) {
            const items = await readAll();
            const item = {id: randomUUID(), ...fields, createdAt: new Date().toISOString()};
            items.push(item);
            await writeJson(file, {[key]: items});
            return item;
        },
    };
}
