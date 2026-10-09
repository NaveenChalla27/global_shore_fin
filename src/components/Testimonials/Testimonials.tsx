import {useCallback, useEffect, useState} from "react";
import {IconQuote} from "../Icons";
import ReviewModal from "../ReviewModal/ReviewModal";
import shared from "../../styles/shared.module.css";
import styles from "./Testimonials.module.css";
import {fetchReviews, fetchTestimonials, type Review, type Testimonial} from "../../api/countries";
import {useCountry} from "../../context/CountryContext";

const initialsOf = (name: string) =>
    name
        .trim()
        .split(/\s+/)
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

const reviewToCard = (r: Review): Testimonial => ({
    id: r.id,
    text: r.text,
    name: r.name,
    meta: r.service || r.country || "",
    initials: initialsOf(r.name),
    rating: r.rating,
    country: r.country,
    publishedAt: r.createdAt,
});

export default function Testimonials() {
    const {country} = useCountry();
    const [items, setItems] = useState<Testimonial[]>([]);
    const [open, setOpen] = useState(false);
    const [reload, setReload] = useState(0);
    const close = useCallback(() => setOpen(false), []);
    const refresh = useCallback(() => setReload((n) => n + 1), []);

    useEffect(() => {
        const controller = new AbortController();
        Promise.all([fetchTestimonials(controller.signal, country.code), fetchReviews(controller.signal, country.code)])
            .then(([testimonials, reviews]) =>
                setItems(
                    [...reviews.map(reviewToCard), ...testimonials].sort((a, b) =>
                        (b.publishedAt ?? "").localeCompare(a.publishedAt ?? "")
                    )
                )
            )
            .catch((err) => {
                if (err.name !== "AbortError") console.error("[Testimonials] fetch failed:", err);
            });
        return () => controller.abort();
    }, [country.code, reload]);

    return (
        <section className={shared.section}>
            <div className={shared.container}>
                <div className={shared.sectionHead}>
                    <span className={shared.eyebrow}>What Clients Say</span>
                    <h2>Trusted by Businesses &amp; Individuals Across {country.name}</h2>
                </div>
                <div className={styles.toolbar}>
                    <div className={styles.summary}>
                        <strong>Worked with us?</strong>
                        <span>Share your experience and help others choose the right partner.</span>
                    </div>
                    <button type="button" className={shared.btnSecondary} onClick={() => setOpen(true)}>
                        Write a Review
                    </button>
                </div>
                <div className={styles.grid}>
                    {items.map((t) => (
                        <div className={styles.card} key={t.id}>
                            <div className={styles.quote}>
                                <IconQuote size={32} />
                            </div>
                            <div className={styles.stars}>{"★".repeat(t.rating)}</div>
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
                {open && (
                    <ReviewModal
                        countryCode={country.code}
                        countryName={country.name}
                        onClose={close}
                        onSubmitted={refresh}
                    />
                )}
            </div>
        </section>
    );
}
