// Business logic for customer records captured from website forms.
import {createCollection} from "../store/collection.js";
import {CUSTOMERS_FILE} from "../config/paths.js";

const customers = createCollection(CUSTOMERS_FILE, "customers");

export const listCustomers = () => customers.list();

export const createCustomer = (input) =>
    customers.add({
        name: input.name,
        email: input.email,
        phone: input.phone ?? "",
        country: input.country ?? "",
        company: input.company ?? "",
        service: input.service ?? "",
        message: input.message ?? "",
        source: input.source ?? "website",
    });
