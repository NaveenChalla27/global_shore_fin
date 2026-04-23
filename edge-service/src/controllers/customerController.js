// HTTP layer for /api/customers.
import * as svc from "../services/customerService.js";
import {asyncHandler} from "../utils/asyncHandler.js";

export const list = asyncHandler(async (_req, res) => {
    res.json({customers: await svc.listCustomers()});
});

export const create = asyncHandler(async (req, res) => {
    res.status(201).json(await svc.createCustomer(req.body));
});
