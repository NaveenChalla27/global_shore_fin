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

const FALLBACK_CONTACTS: Contacts = {
    phone: "+91 1000000000",
    phoneHref: "tel:+911000000000",
    email: "support@globalshore.com",
    emailHref: "mailto:support@globalshore.com",
    hours: "Mon\u2013Fri  9am \u2013 6pm ET",
    whatsapp: "10000000000",
    address: "Hyderabad, India",
    socials: {linkedin: "#", twitter: "#", youtube: "#"},
};

export async function fetchContacts(signal?: AbortSignal): Promise<Contacts> {
    try {
        const data = await tryFetchJson(`${API_BASE}/contacts`, signal);
        return data as Contacts;
    } catch (err) {
        if ((err as Error).name === "AbortError") throw err;
        console.warn("[api] fetchContacts failed, using fallback:", err);
        return FALLBACK_CONTACTS;
    }
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

export async function createBooking(input: BookingInput, signal?: AbortSignal): Promise<Booking> {
    const res = await fetch(`${API_BASE}/bookings`, {
        method: "POST",
        signal,
        headers: {"Content-Type": "application/json", Accept: "application/json"},
        body: JSON.stringify(input),
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
    return (await res.json()) as Booking;
}

export async function fetchPosts(signal?: AbortSignal): Promise<Post[]> {
    const data = await tryFetchJson(`${API_BASE}/posts`, signal);
    const list = Array.isArray(data) ? data : (data as PostsResponse).posts;
    return Array.isArray(list) ? (list as Post[]) : [];
}

