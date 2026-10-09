// HTTP layer for /api/reviews.
import * as svc from "../services/reviewService.js";
import {asyncHandler} from "../utils/asyncHandler.js";

export const list = asyncHandler(async (_req, res) => {
    res.json({reviews: await svc.listReviews()});
});

export const create = asyncHandler(async (req, res) => {
    res.status(201).json(await svc.createReview(req.body));
});
