// Business logic for customer records captured from website forms.
import {randomUUID} from "node:crypto";
import {readJson, writeJson} from "../store/jsonStore.js";
import {CUSTOMERS_FILE} from "../config/paths.js";

async function readAll() {
    const data = await readJson(CUSTOMERS_FILE, {customers: []});
    return Array.isArray(data.customers) ? data.customers : [];
}

async function writeAll(customers) {
    await writeJson(CUSTOMERS_FILE, {customers});
}

export async function listCustomers() {
    const customers = await readAll();
    return [...customers].sort((a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? ""));
}

export async function createCustomer(input) {
    const customers = await readAll();
    const customer = {
        id: randomUUID(),
        name: input.name,
        email: input.email,
        phone: input.phone ?? "",
        country: input.country ?? "",
        company: input.company ?? "",
        service: input.service ?? "",
        message: input.message ?? "",
        source: input.source ?? "website",
        createdAt: new Date().toISOString(),
    };
    customers.push(customer);
    await writeAll(customers);
    return customer;
}
