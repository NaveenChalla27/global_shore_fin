import {useEffect, useMemo, useState} from "react";
import shared from "../styles/shared.module.css";
import styles from "./AdminPage.module.css";
import {fetchBookings, loginAdmin, logoutAdmin, checkAuth, type Booking} from "../api/countries";

type Tab = "bookings" | "customers";

type Customer = {
    name: string;
    email: string;
    phone: string;
    country: string;
    bookingsCount: number;
    lastBookingAt: string;
};

function aggregateCustomers(bookings: Booking[]): Customer[] {
    const map = new Map<string, Customer>();
    for (const b of bookings) {
        const key = (b.email || b.phone || b.name || b.id).toLowerCase();
        const existing = map.get(key);
        if (existing) {
            existing.bookingsCount += 1;
            if ((b.createdAt ?? "") > existing.lastBookingAt) {
                existing.lastBookingAt = b.createdAt ?? existing.lastBookingAt;
                existing.name = b.name || existing.name;
                existing.phone = b.phone || existing.phone;
                existing.country = b.country || existing.country;
            }
        } else {
            map.set(key, {
                name: b.name ?? "",
                email: b.email ?? "",
                phone: b.phone ?? "",
                country: b.country ?? "",
                bookingsCount: 1,
                lastBookingAt: b.createdAt ?? "",
            });
        }
    }
    return [...map.values()].sort((a, b) => b.lastBookingAt.localeCompare(a.lastBookingAt));
}

function formatDate(iso?: string) {
    if (!iso) return "—";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleString();
}

export default function AdminPage() {
    // null = still checking cookie; true/false = known
    const [authed, setAuthed] = useState<boolean | null>(null);

    useEffect(() => {
        const ctrl = new AbortController();
        checkAuth(ctrl.signal).then(setAuthed);
        return () => ctrl.abort();
    }, []);

    if (authed === null) {
        return (
            <section className={shared.section}>
                <div className={shared.container}>
                    <div className={styles.loading}>Checking session…</div>
                </div>
            </section>
        );
    }

    if (!authed) {
        return <AdminLogin onSuccess={() => setAuthed(true)} />;
    }

    return (
        <AdminDashboard
            onLogout={async () => {
                await logoutAdmin();
                setAuthed(false);
            }}
        />
    );
}

function AdminLogin({onSuccess}: {onSuccess: () => void}) {
    const [user, setUser] = useState("");
    const [pass, setPass] = useState("");
    const [err, setErr] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErr(null);
        setLoading(true);
        try {
            await loginAdmin(user.trim(), pass);
            onSuccess();
        } catch (e) {
            setErr((e as Error).message || "Invalid username or password.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className={shared.section}>
            <div className={shared.container}>
                <div className={styles.loginWrap}>
                    <form className={styles.loginCard} onSubmit={submit}>
                        <h1>Admin sign in</h1>
                        <p className={styles.muted}>Restricted area. Authorised personnel only.</p>
                        {err && <div className={styles.loginError}>{err}</div>}
                        <label htmlFor="adm-user">Username</label>
                        <input
                            id="adm-user"
                            autoComplete="username"
                            required
                            value={user}
                            onChange={(e) => setUser(e.target.value)}
                        />
                        <label htmlFor="adm-pass">Password</label>
                        <input
                            id="adm-pass"
                            type="password"
                            autoComplete="current-password"
                            required
                            value={pass}
                            onChange={(e) => setPass(e.target.value)}
                        />
                        <button type="submit" className={shared.btnPrimary} disabled={loading}>
                            {loading ? "Signing in…" : "Sign in"}
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
}

function AdminDashboard({onLogout}: {onLogout: () => void}) {
    const [tab, setTab] = useState<Tab>("bookings");
    const [bookings, setBookings] = useState<Booking[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [query, setQuery] = useState("");
    const [reloadTick, setReloadTick] = useState(0);

    useEffect(() => {
        const ctrl = new AbortController();
        setLoading(true);
        setError(null);
        fetchBookings(ctrl.signal)
        .then((list) => setBookings(list))
        .catch((err) => {
            if ((err as Error).name === "AbortError") return;
            setError((err as Error).message || "Failed to load bookings");
        })
        .finally(() => setLoading(false));
        return () => ctrl.abort();
    }, [reloadTick]);

    const customers = useMemo(() => aggregateCustomers(bookings ?? []), [bookings]);

    const q = query.trim().toLowerCase();
    const filteredBookings = useMemo(() => {
        const list = bookings ?? [];
        if (!q) return list;
        return list.filter((b) =>
            [b.name, b.email, b.phone, b.country, b.service, b.message]
            .filter(Boolean)
            .some((v) => String(v).toLowerCase().includes(q))
        );
    }, [bookings, q]);

    const filteredCustomers = useMemo(() => {
        if (!q) return customers;
        return customers.filter((c) =>
            [c.name, c.email, c.phone, c.country].filter(Boolean).some((v) => v.toLowerCase().includes(q))
        );
    }, [customers, q]);

    return (
        <section className={shared.section}>
            <div className={shared.container}>
                <div className={styles.wrap}>
                    <div className={styles.header}>
                        <div>
                            <h1>Admin Dashboard</h1>
                            <div className={styles.muted}>Bookings and customer enquiries</div>
                        </div>
                        <div className={styles.tabs} role="tablist">
                            <button
                                role="tab"
                                aria-selected={tab === "bookings"}
                                className={`${styles.tab} ${tab === "bookings" ? styles.tabActive : ""}`}
                                onClick={() => setTab("bookings")}
                            >
                                Bookings ({bookings?.length ?? 0})
                            </button>
                            <button
                                role="tab"
                                aria-selected={tab === "customers"}
                                className={`${styles.tab} ${tab === "customers" ? styles.tabActive : ""}`}
                                onClick={() => setTab("customers")}
                            >
                                Customers ({customers.length})
                            </button>
                        </div>
                        <button type="button" className={styles.refresh} onClick={onLogout}>
                            Sign out
                        </button>
                    </div>

                    <div className={styles.toolbar}>
                        <input
                            type="search"
                            placeholder="Search by name, email, phone, service…"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                        <button
                            type="button"
                            className={styles.refresh}
                            onClick={() => setReloadTick((t) => t + 1)}
                            disabled={loading}
                        >
                            {loading ? "Refreshing…" : "Refresh"}
                        </button>
                    </div>

                    <div className={styles.tableWrap}>
                        {error && <div className={styles.error}>Error: {error}</div>}
                        {!error && loading && bookings === null && <div className={styles.loading}>Loading…</div>}
                        {!error && bookings !== null && tab === "bookings" && (
                            <table className={styles.table}>
                                <thead>
                                    <tr>
                                        <th>Submitted</th>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Phone</th>
                                        <th>Country</th>
                                        <th>Service</th>
                                        <th>Preferred</th>
                                        <th>Message</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredBookings.length === 0 && (
                                        <tr>
                                            <td colSpan={9} className={styles.empty}>
                                                No bookings found.
                                            </td>
                                        </tr>
                                    )}
                                    {filteredBookings.map((b) => (
                                        <tr key={b.id}>
                                            <td>{formatDate(b.createdAt)}</td>
                                            <td>{b.name}</td>
                                            <td>{b.email ? <a href={`mailto:${b.email}`}>{b.email}</a> : "—"}</td>
                                            <td>{b.phone || "—"}</td>
                                            <td>{b.country || "—"}</td>
                                            <td>{b.service || "—"}</td>
                                            <td>{b.preferredAt || "—"}</td>
                                            <td>{b.message || "—"}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                        {!error && bookings !== null && tab === "customers" && (
                            <table className={styles.table}>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Phone</th>
                                        <th>Country</th>
                                        <th>Bookings</th>
                                        <th>Last contact</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredCustomers.length === 0 && (
                                        <tr>
                                            <td colSpan={6} className={styles.empty}>
                                                No customers found.
                                            </td>
                                        </tr>
                                    )}
                                    {filteredCustomers.map((c) => (
                                        <tr key={`${c.email}-${c.name}`}>
                                            <td>{c.name || "—"}</td>
                                            <td>{c.email ? <a href={`mailto:${c.email}`}>{c.email}</a> : "—"}</td>
                                            <td>{c.phone || "—"}</td>
                                            <td>{c.country || "—"}</td>
                                            <td>
                                                <span className={styles.badge}>{c.bookingsCount}</span>
                                            </td>
                                            <td>{formatDate(c.lastBookingAt)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
