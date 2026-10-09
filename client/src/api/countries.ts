import { COUNTRIES, type Country } from "../data/countries";

/**
 * Base URL for the content API (edge-service).
 * Set `VITE_API_BASE_URL=https://api.example.com/api` in `.env.production`,
 * or `http://localhost:4000/api` in `.env.local` for development.
 */
const API_BASE: string = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? "/api";

export type CountriesResponse = {countries: Country[]};

async function tryFetchJson(url: string, signal?: AbortSignal): Promise<unknown> {
    const res = await fetch(url, {signal, headers: {Accept: "application/json"}});
    if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
    return res.json();
}

export async function fetchCountries(signal?: AbortSignal): Promise<Country[]> {
    try {
        const data = await tryFetchJson(`${API_BASE}/countries`, signal);
        const list = Array.isArray(data) ? data : (data as CountriesResponse).countries;
        if (!Array.isArray(list) || list.length === 0) throw new Error("Empty country list");
        return list as Country[];
    } catch (err) {
        if ((err as Error).name === "AbortError") throw err;
        console.warn("[api] fetchCountries failed, using bundled fallback:", err);
        return COUNTRIES;
    }
}

export type Contacts = {
    phone?: string;
    phoneHref?: string;
    email?: string;
    emailHref?: string;
    hours?: string;
    whatsapp?: string;
    address?: string;
    socials?: {linkedin?: string; twitter?: string; youtube?: string};
};

export async function fetchContacts(signal?: AbortSignal): Promise<Contacts> {
    return (await tryFetchJson(`${API_BASE}/contacts`, signal)) as Contacts;
}

export type Post = {
    slug: string;
    title: string;
    tag: string;
    excerpt?: string;
    image?: string;
    thumb?: string;
    publishedAt?: string;
    body?: string;
};

export type PostsResponse = {posts: Post[]};

export type BookingInput = {
    name: string;
    email: string;
    phone?: string;
    country?: string;
    service?: string;
    preferredAt?: string;
    message?: string;
    source?: string;
};

export type Booking = BookingInput & {id: string; createdAt: string};

async function postJson<T>(path: string, body: unknown, signal?: AbortSignal): Promise<T> {
    const res = await fetch(`${API_BASE}${path}`, {
        method: "POST",
        signal,
        headers: {"Content-Type": "application/json", Accept: "application/json"},
        body: JSON.stringify(body),
    });
    if (!res.ok) {
        let detail = `HTTP ${res.status}`;
        try {
            const err = (await res.json()) as {error?: string};
            if (err.error) detail = err.error;
        } catch {
            /* ignore */
        }
        throw new Error(detail);
    }
    return (await res.json()) as T;
}

export const createBooking = (input: BookingInput, signal?: AbortSignal) =>
    postJson<Booking>("/bookings", input, signal);

export type ReviewInput = {
    name: string;
    rating: number;
    comment: string;
    title?: string;
    country?: string;
    service?: string;
};

export type Review = ReviewInput & {id: string; createdAt: string};

export async function fetchReviews(signal?: AbortSignal): Promise<Review[]> {
    const data = await tryFetchJson(`${API_BASE}/reviews`, signal);
    const list = Array.isArray(data) ? data : (data as {reviews: Review[]}).reviews;
    return Array.isArray(list) ? list : [];
}

export const createReview = (input: ReviewInput, signal?: AbortSignal) =>
    postJson<Review>("/reviews", input, signal);

export async function fetchPosts(signal?: AbortSignal): Promise<Post[]> {
    const data = await tryFetchJson(`${API_BASE}/posts`, signal);
    const list = Array.isArray(data) ? data : (data as PostsResponse).posts;
    return Array.isArray(list) ? (list as Post[]) : [];
}

