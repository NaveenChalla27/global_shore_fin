import {IconClock, IconDollar, IconGlobe, IconShield} from "../Icons";
import shared from "../../styles/shared.module.css";
import styles from "./WhyChoose.module.css";

const items = [
    {
        icon: <IconClock />,
        title: "100% Remote Delivery",
        desc: "Work with us from anywhere in the US. Secure document sharing and digital workflows.",
    },
    {
        icon: <IconShield />,
        title: "IRS-Compliant & CPA-Supervised",
        desc: "Every filing reviewed by qualified professionals. Accuracy you can count on.",
    },
    {
        icon: <IconGlobe />,
        title: "India-US Bridge",
        desc: "Deep understanding of NRI, expat, and immigrant tax needs across both jurisdictions.",
    },
    {
        icon: <IconDollar />,
        title: "Flat-Rate Pricing",
        desc: "No surprise bills. Transparent fee structure quoted upfront, every time.",
    },
];

export default function WhyChoose() {
    return (
        <section className={shared.sectionAlt} id="about">
            <div className={shared.container}>
                <div className={shared.sectionHead}>
                    <span className={shared.eyebrow}>Why Global Shore</span>
                    <h2>Built for the Modern US Financial Client</h2>
                    <p>Four reasons clients in 50 states trust us with their payroll, taxes, and books.</p>
                </div>
                <div className={styles.grid}>
                    {items.map((it) => (
                        <div key={it.title}>
                            <div className={styles.iconCircle}>{it.icon}</div>
                            <h4 className={styles.title}>{it.title}</h4>
                            <p className={styles.desc}>{it.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
