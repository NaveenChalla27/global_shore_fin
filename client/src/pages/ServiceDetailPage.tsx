import {Link, useParams} from "react-router-dom";
import {useEffect} from "react";
import shared from "../styles/shared.module.css";
import styles from "./ServicePage.module.css";
import {getCategoryBySlug, getServiceBySlug} from "../data/serviceDetails";
import {useBooking} from "../context/BookingContext";

export default function ServiceDetailPage() {
    const {slug = ""} = useParams();
    const service = getServiceBySlug(slug);
    const {open} = useBooking();

    useEffect(() => {
        window.scrollTo({top: 0, behavior: "instant" as ScrollBehavior});
        if (service) document.title = `${service.name} — Global Shore Fin Services`;
    }, [service]);

    if (!service) {
        return (
            <section className={styles.body}>
                <div className={shared.container}>
                    <h1>Service not found</h1>
                    <p>
                        <Link to="/services">Back to all services</Link>
                    </p>
                </div>
            </section>
        );
    }

    const category = getCategoryBySlug(service.categorySlug);
    const related = (category?.services ?? []).filter((s) => s.slug !== service.slug).slice(0, 5);

    return (
        <>
            <section className={styles.hero}>
                <div className={shared.container}>
                    <div className={styles.crumbs}>
                        <Link to="/">Home</Link>
                        <span>/</span>
                        <Link to="/services">Services</Link>
                        <span>/</span>
                        <span>{service.category}</span>
                    </div>
                    <h1>{service.name}</h1>
                    <p>{service.benefit}</p>
                </div>
            </section>

            <section className={styles.body}>
                <div className={shared.container}>
                    <div className={styles.layout}>
                        <article>
                            <div className={styles.block}>
                                <h2>What this service is</h2>
                                <p>{service.description}</p>
                            </div>

                            <div className={styles.block}>
                                <h2>Who it’s for</h2>
                                <ul className={styles.list}>
                                    {service.whoFor.map((item) => (
                                        <li key={item}>{item}</li>
                                    ))}
                                </ul>
                            </div>

                            <div className={styles.block}>
                                <h2>What’s included</h2>
                                <ul className={styles.list}>
                                    {service.includes.map((item) => (
                                        <li key={item}>{item}</li>
                                    ))}
                                </ul>
                            </div>

                            <div className={styles.block}>
                                <h2>Why choose Global Shore</h2>
                                <ul className={styles.list}>
                                    {service.whyChoose.map((item) => (
                                        <li key={item}>{item}</li>
                                    ))}
                                </ul>
                            </div>

                            <div className={styles.block}>
                                <h2>Frequently asked questions</h2>
                                <div className={styles.faq}>
                                    {service.faqs.map((faq) => (
                                        <div key={faq.q} className={styles.faqItem}>
                                            <h3>{faq.q}</h3>
                                            <p>{faq.a}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className={styles.block}>
                                <button
                                    type="button"
                                    className={shared.btnPrimary}
                                    onClick={() => open({service: service.name, source: "service-page-bottom"})}
                                >
                                    Book a Free Consultation
                                </button>
                            </div>
                        </article>

                        <aside className={styles.aside}>
                            <h4>Talk to an expert</h4>
                            <p>
                                A 30-minute call to scope your needs and get a flat-rate quote — no pressure, no
                                surprise bills.
                            </p>
                            <button
                                type="button"
                                className={shared.btnPrimary}
                                onClick={() => open({service: service.name, source: "service-page-aside"})}
                            >
                                Book a Free Call
                            </button>
                            {related.length > 0 && (
                                <div className={styles.related}>
                                    <h5>Related Services</h5>
                                    <ul>
                                        {related.map((s) => (
                                            <li key={s.slug}>
                                                <Link to={`/services/${s.slug}`}>{s.name}</Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </aside>
                    </div>
                </div>
            </section>

            <section className={styles.bottomCta}>
                <div className={shared.container}>
                    <h2>Ready to get started?</h2>
                    <p>Book your free 30-minute consultation today.</p>
                    <button
                        type="button"
                        className={shared.btnPrimary}
                        onClick={() =>
                            open({service: service.name, source: "service-page-banner", title: "Schedule a Call"})
                        }
                    >
                        Schedule a Call
                    </button>
                </div>
            </section>
        </>
    );
}
