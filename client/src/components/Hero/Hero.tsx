import {Link} from "react-router-dom";
import {IconArrow, IconCheck, IconDollar, IconShield, IconUsers} from "../Icons";
import shared from "../../styles/shared.module.css";
import styles from "./Hero.module.css";
import {useCountry} from "../../context/CountryContext";
import {useBooking} from "../../context/BookingContext";

export default function Hero() {
    const {country} = useCountry();
    const {open} = useBooking();
    const comingSoon = country.status === "coming-soon";

    return (
        <section className={styles.hero}>
            <div className={`${shared.container} ${styles.grid}`}>
                <div>
                    <span className={shared.eyebrow}>
                        {country.name} Services
                        {comingSoon && <span className={styles.soonBadge}>Coming Soon</span>}
                    </span>
                    <h1 className={styles.title}>{country.heroTitle}</h1>
                    <p className={styles.sub}>{country.heroSub}</p>
                    <div className={styles.ctas}>
                        <button
                            type="button"
                            className={shared.btnPrimary}
                            onClick={() => open({source: "hero", title: comingSoon ? "Join the Waitlist" : undefined})}
                        >
                            {comingSoon ? "Join Waitlist" : "Book a Free Consultation"} <IconArrow size={16} />
                        </button>
                        <Link to="/#services" className={shared.btnSecondary}>
                            Explore Services
                        </Link>
                    </div>
                    <div className={styles.trustBar}>
                        {country.trustBadges.map((badge) => (
                            <span className={styles.trustItem} key={badge}>
                                <IconCheck size={16} /> {badge}
                            </span>
                        ))}
                    </div>
                </div>
                <div className={styles.visual} aria-hidden="true">
                    <div className={styles.card1}>
                        <div className={styles.chip}>
                            <IconShield size={20} />
                        </div>
                        <div>
                            <div className={styles.num}>100%</div>
                            <div className={styles.lbl}>Compliant</div>
                        </div>
                    </div>
                    <div className={styles.card2}>
                        <div className={styles.chip}>
                            <IconUsers size={20} />
                        </div>
                        <div>
                            <div className={styles.num}>500+</div>
                            <div className={styles.lbl}>Happy Clients</div>
                        </div>
                    </div>
                    <div className={styles.cardCenter}>
                        <div className={styles.chip}>
                            <IconDollar size={20} />
                        </div>
                        <div>
                            <div className={styles.num}>Flat-Rate</div>
                            <div className={styles.lbl}>Transparent Pricing</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
