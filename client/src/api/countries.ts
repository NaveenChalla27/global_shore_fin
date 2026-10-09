import type { Country } from "../data/countries";

/**
 * Base URL for the content API (edge-service).
 * Set `VITE_API_BASE_URL=https://api.example.com/api` in `.env.production`,
 * or `http://localhost:4000/api` in `.env.local` for development.
 */
const API_BASE: string = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? "/api";

export type CountriesResponse = {countries: Country[]};

async function tryFetchJson(url: string, signal?: AbortSignal): Promise<unknown> {
    const res = await fetch(url, {
        signal,
        cache: "no-store",
        headers: {Accept: "application/json"},
    });
    if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
    return res.json();
}

async function errorDetail(res: Response, fallback: string): Promise<string> {
    try {
        const err = (await res.json()) as {error?: string};
        return err.error || fallback;
    } catch {
        return fallback;
    }
}

async function postJson<T>(url: string, body: unknown, signal?: AbortSignal, credentials?: RequestCredentials): Promise<T> {
    const res = await fetch(url, {
        method: "POST",
        signal,
        credentials,
        headers: {"Content-Type": "application/json", Accept: "application/json"},
        body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(await errorDetail(res, `HTTP ${res.status}`));
    return (await res.json()) as T;
}

export async function fetchCountries(signal?: AbortSignal): Promise<Country[]> {
    const data = await tryFetchJson(`${API_BASE}/countries`, signal);
    const list = Array.isArray(data) ? data : (data as CountriesResponse).countries;
    return Array.isArray(list) ? (list as Country[]) : [];
}

export type Contacts = {
    phone?: string;
    phoneHref?: string;
    email?: string;
    emailHref?: string;
    hours?: string;
    whatsapp?: string;
    address?: string;
    socials?: {linkedin?: string; twitter?: string; instagram?: string};
};

export async function fetchContacts(signal?: AbortSignal, countryCode?: string): Promise<Contacts> {
    const url = countryCode
        ? `${API_BASE}/countries/${countryCode}/contacts`
        : `${API_BASE}/contacts`;
    const data = await tryFetchJson(url, signal);
    return data as Contacts;
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
};

export type Booking = BookingInput & {id: string; createdAt: string};

export type BookingsResponse = {bookings: Booking[]};

export async function loginAdmin(username: string, password: string, signal?: AbortSignal): Promise<void> {
    try {
        await postJson(`${API_BASE}/auth/login`, {username, password}, signal, "include");
    } catch (err) {
        const msg = (err as Error).message;
        throw new Error(msg.startsWith("HTTP ") ? "Invalid credentials" : msg);
    }
}

export async function checkAuth(signal?: AbortSignal): Promise<boolean> {
    try {
        const res = await fetch(`${API_BASE}/auth/me`, {signal, credentials: "include", headers: {Accept: "application/json"}});
        return res.ok;
    } catch {
        return false;
    }
}

export async function logoutAdmin(signal?: AbortSignal): Promise<void> {
    await fetch(`${API_BASE}/auth/logout`, {method: "POST", signal, credentials: "include"});
}

export async function fetchBookings(signal?: AbortSignal): Promise<Booking[]> {
    const res = await fetch(`${API_BASE}/bookings`, {signal, credentials: "include", headers: {Accept: "application/json"}});
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = (await res.json()) as BookingsResponse | Booking[];
    const list = Array.isArray(data) ? data : (data as BookingsResponse).bookings;
    return Array.isArray(list) ? (list as Booking[]) : [];
}

export const createBooking = (input: BookingInput, signal?: AbortSignal) =>
    postJson<Booking>(`${API_BASE}/bookings`, input, signal);

export async function fetchPosts(signal?: AbortSignal, countryCode?: string): Promise<Post[]> {
    const url = countryCode
        ? `${API_BASE}/countries/${countryCode}/posts`
        : `${API_BASE}/posts`;
    const data = await tryFetchJson(url, signal);
    const list = Array.isArray(data) ? data : (data as PostsResponse).posts;
    return Array.isArray(list) ? (list as Post[]) : [];
}

export type Testimonial = {
    id: string;
    text: string;
    name: string;
    meta: string;
    initials: string;
    rating: number;
    country?: string;
    publishedAt?: string;
};

export async function fetchTestimonials(signal?: AbortSignal, countryCode?: string): Promise<Testimonial[]> {
    const url = countryCode
        ? `${API_BASE}/countries/${countryCode}/testimonials`
        : `${API_BASE}/testimonials`;
    try {
        const data = await tryFetchJson(url, signal);
        const list = (data as {testimonials: Testimonial[]}).testimonials;
        return Array.isArray(list) ? list : [];
    } catch (err) {
        if ((err as Error).name === "AbortError") throw err;
        console.warn("[api] fetchTestimonials failed:", err);
        return [];
    }
}

export type ReviewInput = {
    name: string;
    text: string;
    rating: number;
    title?: string;
    service?: string;
    country?: string;
};

export type Review = ReviewInput & {id: string; status: string; createdAt: string};

export async function fetchReviews(signal?: AbortSignal, countryCode?: string): Promise<Review[]> {
    const url = countryCode ? `${API_BASE}/countries/${countryCode}/reviews` : `${API_BASE}/reviews`;
    try {
        const data = await tryFetchJson(url, signal);
        const list = (data as {reviews: Review[]}).reviews;
        return Array.isArray(list) ? list : [];
    } catch (err) {
        if ((err as Error).name === "AbortError") throw err;
        console.warn("[api] fetchReviews failed:", err);
        return [];
    }
}

export function createReview(input: ReviewInput, signal?: AbortSignal): Promise<Review> {
    const url = input.country ? `${API_BASE}/countries/${input.country}/reviews` : `${API_BASE}/reviews`;
    return postJson<Review>(url, input, signal);
}

export type Faq = {q: string; a: string};

export type ServiceDetail = {
    slug: string;
    name: string;
    category: string;
    categorySlug: string;
    benefit: string;
    description: string;
    whoFor: string[];
    includes: string[];
    whyChoose: string[];
    faqs: Faq[];
};

export type ServiceCategory = {
    slug: string;
    name: string;
    blurb?: string;
    services: ServiceDetail[];
};

export type ServiceCategoriesResponse = {categories: ServiceCategory[]};

export async function fetchServiceCategories(signal?: AbortSignal): Promise<ServiceCategory[]> {
    const data = await tryFetchJson(`${API_BASE}/service-categories`, signal);
    const list = (data as ServiceCategoriesResponse).categories;
    return Array.isArray(list) ? list : [];
}
