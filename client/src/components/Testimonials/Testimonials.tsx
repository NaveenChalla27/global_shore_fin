import {useEffect, useState} from "react";
import {IconQuote} from "../Icons";
import {fetchReviews, type Review} from "../../api/countries";
import ReviewForm from "./ReviewForm";
import shared from "../../styles/shared.module.css";
import styles from "./Testimonials.module.css";
import {useCountry} from "../../context/CountryContext";

type Item = {key: string; text: string; name: string; meta: string; initials: string; rating: number};

const initialsOf = (name: string) =>
    name
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((w) => w[0].toUpperCase())
        .join("");

const fromReview = (r: Review): Item => ({
    key: r.id,
    text: r.comment,
    name: r.name,
    meta: [r.title, r.country, r.service].filter(Boolean).join(" · "),
    initials: initialsOf(r.name),
    rating: r.rating,
});

export default function Testimonials() {
    const {country} = useCountry();
    const [reviews, setReviews] = useState<Review[]>([]);

    useEffect(() => {
        const ctrl = new AbortController();
        fetchReviews(ctrl.signal)
            .then(setReviews)
            .catch((err) => {
                if ((err as Error).name !== "AbortError") console.warn("[api] fetchReviews failed:", err);
            });
        return () => ctrl.abort();
    }, []);

    const items = reviews.slice(0, 6).map(fromReview);

    return (
        <section className={shared.section}>
            <div className={shared.container}>
                <div className={shared.sectionHead}>
                    <span className={shared.eyebrow}>What Clients Say</span>
                    <h2>Trusted by Businesses &amp; Individuals Across {country.name}</h2>
                </div>
                <div className={styles.layout}>
                <div>
                {items.length === 0 ? (
                    <p className={styles.empty}>No reviews yet — be the first to share your experience.</p>
                ) : (
                <div className={styles.grid}>
                    {items.map((t) => (
                        <div className={styles.card} key={t.key}>
                            <div className={styles.quote}>
                                <IconQuote size={32} />
                            </div>
                            <div className={styles.stars} aria-label={`${t.rating} out of 5`}>
                                {"★".repeat(t.rating)}
                            </div>
                            <p className={styles.text}>{t.text}</p>
                            <div className={styles.author}>
                                <div className={styles.avatar}>{t.initials}</div>
                                <div>
                                    <div className={styles.name}>{t.name}</div>
                                    <div className={styles.meta}>{t.meta}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                )}
                </div>
                <aside className={styles.side}>
                    <ReviewForm onCreated={(r) => setReviews((prev) => [r, ...prev])} />
                </aside>
                </div>
            </div>
        </section>
    );
}
