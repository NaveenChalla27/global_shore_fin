import {useEffect, useState} from "react";
import {IconQuote} from "../Icons";
import shared from "../../styles/shared.module.css";
import styles from "./Testimonials.module.css";

const API_BASE: string = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? "/api";

type Testimonial = {
    id: string;
    text: string;
    name: string;
    meta: string;
    initials: string;
    rating: number;
};

export default function Testimonials() {
    const [items, setItems] = useState<Testimonial[]>([]);

    useEffect(() => {
        const controller = new AbortController();
        fetch(`${API_BASE}/testimonials`, {signal: controller.signal, headers: {Accept: "application/json"}})
        .then((res) => {
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            return res.json() as Promise<{testimonials: Testimonial[]}>;
        })
        .then((data) => setItems(data.testimonials))
        .catch((err) => {
            if (err.name !== "AbortError") console.error("[Testimonials] fetch failed:", err);
        });
        return () => controller.abort();
    }, []);

    return (
        <section className={shared.section}>
            <div className={shared.container}>
                <div className={shared.sectionHead}>
                    <span className={shared.eyebrow}>What Clients Say</span>
                    <h2>Trusted by Businesses &amp; Individuals Across the US</h2>
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
