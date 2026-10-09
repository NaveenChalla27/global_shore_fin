import {IconBriefcase, IconBuilding, IconGlobe, IconUsers} from "../Icons";
import shared from "../../styles/shared.module.css";
import styles from "./WhoWeServe.module.css";

const items = [
    {icon: <IconBriefcase />, label: "Small & Mid-Size US Businesses"},
    {icon: <IconUsers />, label: "HNIs, NRIs & Indian Immigrants"},
    {icon: <IconGlobe />, label: "H1B / L1 / OPT Visa Holders"},
    {icon: <IconGlobe />, label: "US Expats Living Abroad"},
    {icon: <IconUsers />, label: "Freelancers & Independent Contractors"},
    {icon: <IconBuilding />, label: "Startups & New LLCs"},
];

export default function WhoWeServe() {
    return (
        <section className={shared.section} id="industries">
            <div className={shared.container}>
                <div className={shared.sectionHead}>
                    <span className={shared.eyebrow}>Who We Serve</span>
                    <h2>Tailored for Your Situation</h2>
                    <p>
                        We specialise in US financial services for clients who need clarity, compliance, and a partner
                        that understands their context.
                    </p>
                </div>
                <div className={styles.grid}>
                    {items.map((i) => (
                        <div className={styles.card} key={i.label}>
                            <div className={styles.iconCircle}>{i.icon}</div>
                            <span className={styles.label}>{i.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
