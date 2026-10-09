// Business logic for customer reviews submitted from the website.
import {createCollection} from "../store/collection.js";
import {REVIEWS_FILE} from "../config/paths.js";

const reviews = createCollection(REVIEWS_FILE, "reviews");

export const listReviews = () => reviews.list();

export const createReview = (input) =>
    reviews.add({
        name: input.name,
        rating: input.rating,
        comment: input.comment,
        title: input.title ?? "",
        country: input.country ?? "",
        service: input.service ?? "",
    });
