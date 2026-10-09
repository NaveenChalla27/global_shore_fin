import {useEffect, useState} from "react";
import {createPortal} from "react-dom";
import {createReview} from "../../api/countries";
import shared from "../../styles/shared.module.css";
import styles from "./ReviewModal.module.css";

type Props = {
    countryCode: string;
    countryName: string;
    onClose: () => void;
    onSubmitted: () => void;
};

const EMPTY = {name: "", service: "", rating: 5, text: ""};

export default function ReviewModal({countryCode, countryName, onClose, onSubmitted}: Props) {
    const [form, setForm] = useState(EMPTY);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [done, setDone] = useState(false);

    const set = <K extends keyof typeof EMPTY>(key: K, value: (typeof EMPTY)[K]) =>
        setForm((f) => ({...f, [key]: value}));

    // Lock body scroll while open + close on Escape.
    useEffect(() => {
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
        window.addEventListener("keydown", onKey);
        return () => {
            document.body.style.overflow = prev;
            window.removeEventListener("keydown", onKey);
        };
    }, [onClose]);

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);
        try {
            await createReview({
                name: form.name.trim(),
                text: form.text.trim(),
                rating: form.rating,
                service: form.service.trim() || undefined,
                country: countryCode,
            });
            setDone(true);
            onSubmitted();
        } catch (err) {
            setError((err as Error).message || "Could not submit your review. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    return createPortal(
        <div className={styles.backdrop} onClick={onClose} role="dialog" aria-modal="true">
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <button type="button" className={styles.close} onClick={onClose} aria-label="Close">
                    ×
                </button>
                {done ? (
                    <div className={styles.thanks}>
                        <h3>Thank you!</h3>
                        <p>Your review has been posted.</p>
                        <button type="button" className={shared.btnPrimary} onClick={onClose}>
                            Done
                        </button>
                    </div>
                ) : (
                    <>
                        <div className={styles.head}>
                            <h3>Share Your Experience</h3>
                            <p>Tell us how we did. Your review helps others in {countryName} decide.</p>
                        </div>
                        <form className={styles.form} onSubmit={submit}>
                            {error && <div className={styles.error}>{error}</div>}
                            <div className={styles.ratingBox}>
                                <label>Your rating *</label>
                                <div className={styles.rate} role="radiogroup" aria-label="Rating">
                                    {[1, 2, 3, 4, 5].map((n) => (
                                        <button
                                            type="button"
                                            key={n}
                                            role="radio"
                                            aria-checked={form.rating === n}
                                            aria-label={`${n} star${n > 1 ? "s" : ""}`}
                                            className={n <= form.rating ? styles.starOn : styles.starOff}
                                            onClick={() => set("rating", n)}
                                        >
                                            ★
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className={styles.row}>
                                <div className={styles.field}>
                                    <label htmlFor="rv-name">Your name *</label>
                                    <input
                                        id="rv-name"
                                        required
                                        value={form.name}
                                        onChange={(e) => set("name", e.target.value)}
                                    />
                                </div>
                                <div className={styles.field}>
                                    <label htmlFor="rv-service">Location · Service</label>
                                    <input
                                        id="rv-service"
                                        placeholder="e.g. Texas · Payroll Services"
                                        value={form.service}
                                        onChange={(e) => set("service", e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className={styles.field}>
                                <label htmlFor="rv-text">Your review *</label>
                                <textarea
                                    id="rv-text"
                                    rows={4}
                                    required
                                    minLength={10}
                                    value={form.text}
                                    onChange={(e) => set("text", e.target.value)}
                                />
                            </div>
                            <div className={styles.actions}>
                                <button type="button" className={shared.btnSecondary} onClick={onClose}>
                                    Cancel
                                </button>
                                <button type="submit" className={shared.btnPrimary} disabled={submitting}>
                                    {submitting ? "Submitting…" : "Submit Review"}
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
