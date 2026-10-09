import shared from "../../styles/shared.module.css";
import styles from "./Process.module.css";
import {IconCalculator, IconCheck, IconPhone, IconShield} from "../Icons";

const steps = [
    {icon: <IconPhone size={26} />, t: "Book a Free Consultation", d: "30-minute discovery call to understand your needs."},
    {icon: <IconShield size={26} />, t: "Share Documents Securely", d: "Upload via our encrypted client portal."},
    {icon: <IconCalculator size={26} />, t: "We Do the Work", d: "Our CPAs handle preparation, calculation, and review."},
    {icon: <IconCheck size={26} />, t: "Review, Approve & File", d: "You sign off. We file with the IRS and state agencies."},
];

export default function Process() {
    return (
        <section className={shared.sectionAlt} id="process">
            <div className={shared.container}>
                <div className={shared.sectionHead}>
                    <span className={shared.eyebrow}>How It Works</span>
                    <h2>A Simple, Four-Step Process</h2>
                    <p>From first call to filed return — clear, fast, and stress-free.</p>
                </div>
                <div>
                    <div className={styles.grid}>
                        {steps.map((s) => (
                            <div className={styles.card} key={s.t}>
                                <div className={styles.icon}>{s.icon}</div>
                                <h4 className={styles.title}>{s.t}</h4>
                                <p className={styles.desc}>{s.d}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
