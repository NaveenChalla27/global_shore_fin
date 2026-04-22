import {IconQuote} from "../Icons";
import shared from "../../styles/shared.module.css";
import styles from "./Testimonials.module.css";

const items = [
    {
        text: "Global Shore handled my H1B tax return and FBAR filings flawlessly. Clear pricing, fast turnaround, and they actually explained things in plain English.",
        name: "Priya R.",
        meta: "New Jersey · Individual Taxation",
        initials: "PR",
    },
    {
        text: "We switched our payroll from a national provider to Global Shore last year. Better service, better price, and zero compliance issues since.",
        name: "Marcus T.",
        meta: "Texas · Payroll Services",
        initials: "MT",
    },
    {
        text: "Incorporated my LLC from Bangalore in under two weeks. EIN, banking guidance, S-Corp election — all handled by one team.",
        name: "Anand K.",
        meta: "NRI · LLC Formation",
        initials: "AK",
    },
];

export default function Testimonials() {
    return (
        <section className={shared.section}>
            <div className={shared.container}>
                <div className={shared.sectionHead}>
                    <span className={shared.eyebrow}>What Clients Say</span>
                    <h2>Trusted by Businesses &amp; Individuals Across the US</h2>
                </div>
                <div className={styles.grid}>
                    {items.map((t) => (
                        <div className={styles.card} key={t.name}>
                            <div className={styles.quote}>
                                <IconQuote size={32} />
                            </div>
                            <div className={styles.stars}>★★★★★</div>
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
