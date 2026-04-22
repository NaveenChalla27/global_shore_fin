import shared from "../../styles/shared.module.css";
import styles from "./Process.module.css";

const steps = [
    {n: 1, t: "Book a Free Consultation", d: "30-minute discovery call to understand your needs."},
    {n: 2, t: "Share Documents Securely", d: "Upload via our encrypted client portal."},
    {n: 3, t: "We Do the Work", d: "Our CPAs handle preparation, calculation, and review."},
    {n: 4, t: "Review, Approve & File", d: "You sign off. We file with the IRS and state agencies."},
];

export default function Process() {
    return (
        <section className={shared.sectionAlt}>
            <div className={shared.container}>
                <div className={shared.sectionHead}>
                    <span className={shared.eyebrow}>How It Works</span>
                    <h2>A Simple, Four-Step Process</h2>
                    <p>From first call to filed return — clear, fast, and stress-free.</p>
                </div>
                <div className={styles.grid}>
                    {steps.map((s) => (
                        <div className={styles.step} key={s.n}>
                            <div className={styles.numCircle}>{s.n}</div>
                            <h4 className={styles.title}>{s.t}</h4>
                            <p className={styles.desc}>{s.d}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
