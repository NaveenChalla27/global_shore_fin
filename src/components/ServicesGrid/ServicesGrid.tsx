import {Link} from "react-router-dom";
import {IconArrow, IconBriefcase, IconBuilding, IconCalculator, IconShield, IconUsers} from "../Icons";
import shared from "../../styles/shared.module.css";
import styles from "./ServicesGrid.module.css";
import {useCountry} from "../../context/CountryContext";
import type {ServiceKey} from "../../data/countries";
import type {ReactNode} from "react";

const ICONS: Record<ServiceKey, ReactNode> = {
    payroll: <IconUsers />,
    tax: <IconCalculator />,
    accounting: <IconBriefcase />,
    compliance: <IconShield />,
    formation: <IconBuilding />,
    advisory: <IconBriefcase />,
};

const KEY_TO_SERVICE_SLUG: Record<ServiceKey, string> = {
    payroll: "payroll-services",
    tax: "individual-taxation",
    accounting: "accounting-services",
    compliance: "auditing",
    formation: "llc-formation",
    advisory: "accounting-services",
};

export default function ServicesGrid() {
    const {country, selectedServices, toggleService, clearServices, visibleServices} = useCountry();

    return (
        <section className={shared.section} id="services">
            <div className={shared.container}>
                <div className={shared.sectionHead}>
                    <span className={shared.eyebrow}>Our Services in {country.name}</span>
                    <h2>Everything Your Business Needs, Under One Roof</h2>
                    <p>Choose the services that matter to you. We&rsquo;ll tailor a package for {country.name}.</p>
                </div>

                <div className={styles.filters} role="group" aria-label="Filter services">
                    <button
                        type="button"
                        className={`${styles.chip} ${selectedServices.length === 0 ? styles.chipActive : ""}`}
                        onClick={clearServices}
                    >
                        All Services
                    </button>
                    {country.services.map((s) => {
                        const active = selectedServices.includes(s.key);
                        return (
                            <button
                                key={s.key}
                                type="button"
                                className={`${styles.chip} ${active ? styles.chipActive : ""}`}
                                aria-pressed={active}
                                onClick={() => toggleService(s.key)}
                            >
                                {s.title}
                            </button>
                        );
                    })}
                </div>

                <div className={styles.grid}>
                    {visibleServices.map((c) => (
                        <div className={styles.card} key={c.key}>
                            <div className={styles.iconCircle}>{ICONS[c.key]}</div>
                            <h4 className={styles.title}>{c.title}</h4>
                            <p className={styles.desc}>{c.desc}</p>
                            <Link to={`/services/${KEY_TO_SERVICE_SLUG[c.key]}`} className={shared.btnGhost}>
                                Learn More <IconArrow size={14} />
                            </Link>
                        </div>
                    ))}
                </div>
                <div className={shared.center}>
                    <Link to="/services" className={shared.btnSecondary}>
                        View All Services <IconArrow size={16} />
                    </Link>
                </div>
            </div>
        </section>
    );
}
