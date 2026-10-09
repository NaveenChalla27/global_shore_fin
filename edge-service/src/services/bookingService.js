// Business logic for consultation booking requests.
import {createCollection} from "../store/collection.js";
import {BOOKINGS_FILE} from "../config/paths.js";

const bookings = createCollection(BOOKINGS_FILE, "bookings");

export const listBookings = () => bookings.list();

export const createBooking = (input) =>
    bookings.add({
        name: input.name,
        email: input.email,
        phone: input.phone ?? "",
        country: input.country ?? "",
        service: input.service ?? "",
        preferredAt: input.preferredAt ?? "",
        message: input.message ?? "",
        source: input.source ?? "website",
    });
