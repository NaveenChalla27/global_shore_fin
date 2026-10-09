import {useState} from "react";
import {createReview, type Review, type ReviewInput} from "../../api/countries";
import shared from "../../styles/shared.module.css";
import styles from "./Testimonials.module.css";

const EMPTY: ReviewInput = {name: "", rating: 5, comment: "", title: "", country: "", service: ""};

type Props = {onCreated: (review: Review) => void};

export default function ReviewForm({onCreated}: Props) {
    const [form, setForm] = useState<ReviewInput>(EMPTY);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [done, setDone] = useState(false);

    const update = <K extends keyof ReviewInput>(key: K, value: ReviewInput[K]) =>
        setForm((f) => ({...f, [key]: value}));

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);
        try {
            onCreated(await createReview(form));
            setForm(EMPTY);
            setDone(true);
        } catch (err) {
            setError((err as Error).message || "Could not submit. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    if (done) {
        return (
            <div className={styles.formCard}>
                <h3>Thank you for your review!</h3>
                <button type="button" className={`${shared.btnSecondary} ${styles.formBtn}`} onClick={() => setDone(false)}>
                    Write another
                </button>
            </div>
        );
    }

    return (
        <form className={styles.formCard} onSubmit={submit}>
            <h3>Share your experience</h3>
            {error && <div className={styles.error}>{error}</div>}
            <div className={styles.field}>
                <label>Rating *</label>
                <div className={styles.picker} role="radiogroup" aria-label="Rating">
                    {[1, 2, 3, 4, 5].map((n) => (
                        <button
                            key={n}
                            type="button"
                            role="radio"
                            aria-checked={form.rating === n}
                            aria-label={`${n} star${n > 1 ? "s" : ""}`}
                            className={n <= form.rating ? styles.starOn : styles.starOff}
                            onClick={() => update("rating", n)}
                        >
                            ★
                        </button>
                    ))}
                </div>
            </div>
            <div className={styles.field}>
                <label htmlFor="rv-name">Name *</label>
                <input id="rv-name" required value={form.name} onChange={(e) => update("name", e.target.value)} />
            </div>
            <div className={styles.field}>
                <label htmlFor="rv-title">Headline</label>
                <input id="rv-title" value={form.title} onChange={(e) => update("title", e.target.value)} />
            </div>
            <div className={styles.field}>
                <label htmlFor="rv-comment">Your review *</label>
                <textarea
                    id="rv-comment"
                    required
                    rows={4}
                    maxLength={2000}
                    value={form.comment}
                    onChange={(e) => update("comment", e.target.value)}
                />
            </div>
            <button type="submit" className={`${shared.btnPrimary} ${styles.formBtn}`} disabled={submitting}>
                {submitting ? "Submitting…" : "Submit Review"}
            </button>
        </form>
    );
}
