import {useEffect, useState} from "react";
import {createPortal} from "react-dom";
import {useBooking} from "../../context/BookingContext";
import {useCountry} from "../../context/CountryContext";
import {createBooking, type BookingInput} from "../../api/countries";
import shared from "../../styles/shared.module.css";
import styles from "./BookingModal.module.css";

const SERVICE_OPTIONS = [
    "Payroll Services",
    "Payroll Taxation",
    "Bookkeeping",
    "Accounting",
    "Individual Taxation",
    "Business Taxation",
    "Expat Taxation",
    "Sales & Use Tax",
    "LLC / Company Formation",
    "Compliance",
    "Other",
];

const EMPTY: BookingInput = {
    name: "",
    email: "",
    phone: "",
    country: "",
    service: "",
    preferredAt: "",
    message: "",
    source: "website",
};

export default function BookingModal() {
    const {isOpen, options, close} = useBooking();
    const {country, countries} = useCountry();
    const [form, setForm] = useState<BookingInput>(EMPTY);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [done, setDone] = useState(false);

    // Reset form whenever the modal opens with new options.
    useEffect(() => {
        if (!isOpen) return;
        setForm({
            ...EMPTY,
            country: country?.name ?? "",
            service: options.service ?? "",
            source: options.source ?? "website",
        });
        setError(null);
        setDone(false);
    }, [isOpen, options, country]);

    // Lock body scroll while open + close on Escape.
    useEffect(() => {
        if (!isOpen) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") close();
        };
        window.addEventListener("keydown", onKey);
        return () => {
            document.body.style.overflow = prev;
            window.removeEventListener("keydown", onKey);
        };
    }, [isOpen, close]);

    if (!isOpen) return null;

    const update = <K extends keyof BookingInput>(key: K, value: BookingInput[K]) =>
        setForm((f) => ({...f, [key]: value}));

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);
        try {
            await createBooking(form);
            setDone(true);
        } catch (err) {
            setError((err as Error).message || "Could not submit. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    return createPortal(
        <div className={styles.backdrop} onClick={close} role="dialog" aria-modal="true">
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <button className={styles.close} onClick={close} aria-label="Close">
                    ×
                </button>
                {done ? (
                    <div className={styles.success}>
                        <h3>Thanks, {form.name.split(" ")[0] || "there"}!</h3>
                        <p>
                            We received your request and will reach out within one business day to confirm your free
                            consultation.
                        </p>
                        <button type="button" className={shared.btnPrimary} onClick={close}>
                            Done
                        </button>
                    </div>
                ) : (
                    <>
                        <div className={styles.head}>
                            <h3>{options.title ?? "Book a Free Consultation"}</h3>
                            <p>Tell us a bit about you and we'll be in touch within one business day.</p>
                        </div>
                        <form className={styles.form} onSubmit={submit}>
                            {error && <div className={styles.error}>{error}</div>}
                            <div className={styles.row}>
                                <div className={styles.field}>
                                    <label htmlFor="bk-name">Full name *</label>
                                    <input
                                        id="bk-name"
                                        required
                                        value={form.name}
                                        onChange={(e) => update("name", e.target.value)}
                                    />
                                </div>
                                <div className={styles.field}>
                                    <label htmlFor="bk-email">Email *</label>
                                    <input
                                        id="bk-email"
                                        type="email"
                                        required
                                        value={form.email}
                                        onChange={(e) => update("email", e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className={styles.row}>
                                <div className={styles.field}>
                                    <label htmlFor="bk-phone">Phone</label>
                                    <input
                                        id="bk-phone"
                                        type="tel"
                                        inputMode="tel"
                                        value={form.phone}
                                        onChange={(e) => update("phone", e.target.value)}
                                    />
                                </div>
                                <div className={styles.field}>
                                    <label htmlFor="bk-country">Country</label>
                                    <select
                                        id="bk-country"
                                        value={form.country}
                                        onChange={(e) => update("country", e.target.value)}
                                    >
                                        <option value="">Select a country</option>
                                        {countries.map((c) => {
                                            const label = c.name + (c.status === "coming-soon" ? " (coming soon)" : "");
                                            return (
                                                <option key={c.code} value={c.name}>
                                                    {label}
                                                </option>
                                            );
                                        })}
                                    </select>
                                </div>
                            </div>
                            <div className={styles.row}>
                                <div className={styles.field}>
                                    <label htmlFor="bk-service">Service interested in</label>
                                    <select
                                        id="bk-service"
                                        value={form.service}
                                        onChange={(e) => update("service", e.target.value)}
                                    >
                                        <option value="">Select a service</option>
                                        {SERVICE_OPTIONS.map((s) => (
                                            <option key={s} value={s}>
                                                {s}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className={styles.field}>
                                    <label htmlFor="bk-when">Preferred date / time</label>
                                    <input
                                        id="bk-when"
                                        placeholder="e.g. Tue afternoon ET"
                                        value={form.preferredAt}
                                        onChange={(e) => update("preferredAt", e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className={styles.field}>
                                <label htmlFor="bk-message">How can we help?</label>
                                <textarea
                                    id="bk-message"
                                    rows={3}
                                    value={form.message}
                                    onChange={(e) => update("message", e.target.value)}
                                />
                            </div>
                            <div className={styles.actions}>
                                <button type="button" className={shared.btnSecondary} onClick={close}>
                                    Cancel
                                </button>
                                <button type="submit" className={shared.btnPrimary} disabled={submitting}>
                                    {submitting ? "Submitting…" : "Request Consultation"}
                                </button>
                            </div>
                        </form>
                    </>
                )}
            </div>
        </div>,
        document.body
    );
}
