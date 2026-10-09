import {Link} from "react-router-dom";
import {useEffect} from "react";
import shared from "../styles/shared.module.css";
import styles from "./ServicePage.module.css";
import {SERVICE_CATEGORIES} from "../data/serviceDetails";

export default function ServicesIndexPage() {
    useEffect(() => {
        window.scrollTo({top: 0, behavior: "instant" as ScrollBehavior});
        document.title = "Services — Global Shore Fin Services";
    }, []);

    return (
        <>
            <section className={styles.indexHero}>
                <div className={shared.container}>
                    <h1>Our Services</h1>
                    <p>
                        Payroll, taxation, accounting, compliance, and business formation — every US financial service
                        your business or family needs, under one roof.
                    </p>
                </div>
            </section>

            <section className={styles.body}>
                <div className={shared.container}>
                    {SERVICE_CATEGORIES.map((cat) => (
                        <div key={cat.slug} className={styles.category}>
                            <h2>{cat.name}</h2>
                            <p>{cat.blurb}</p>
                            <div className={styles.cards}>
                                {cat.services.map((s) => (
                                    <Link key={s.slug} to={`/services/${s.slug}`} className={styles.card}>
                                        <h3>{s.name}</h3>
                                        <p>{s.benefit}</p>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </>
    );
}
