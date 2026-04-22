// Low-level JSON file store. The only module that touches the filesystem.
import {readFile, writeFile, mkdir} from "node:fs/promises";
import {existsSync} from "node:fs";
import {dirname} from "node:path";

export async function readJson(file, fallback) {
    try {
        return JSON.parse(await readFile(file, "utf8"));
    } catch {
        return fallback;
    }
}

export async function writeJson(file, value) {
    const dir = dirname(file);
    if (!existsSync(dir)) await mkdir(dir, {recursive: true});
    await writeFile(file, JSON.stringify(value, null, 2) + "\n", "utf8");
}
