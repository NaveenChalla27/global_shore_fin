import {useEffect, useState} from "react";
import {IconQuote} from "../Icons";
import shared from "../../styles/shared.module.css";
import styles from "./Testimonials.module.css";
import {fetchTestimonials, type Testimonial} from "../../api/countries";
import {useCountry} from "../../context/CountryContext";

export default function Testimonials() {
    const {country} = useCountry();
    const [items, setItems] = useState<Testimonial[]>([]);

    useEffect(() => {
        const controller = new AbortController();
        fetchTestimonials(controller.signal, country.code)
        .then((list) => setItems(list))
        .catch((err) => {
            if (err.name !== "AbortError") console.error("[Testimonials] fetch failed:", err);
        });
        return () => controller.abort();
    }, [country.code]);

    return (
        <section className={shared.section}>
            <div className={shared.container}>
                <div className={shared.sectionHead}>
                    <span className={shared.eyebrow}>What Clients Say</span>
                    <h2>Trusted by Businesses &amp; Individuals Across {country.name}</h2>
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
            </div>
        </section>
    );
}
