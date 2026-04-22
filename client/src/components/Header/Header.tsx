import {useEffect, useRef, useState} from "react";
import {createPortal} from "react-dom";
import {Link, useLocation} from "react-router-dom";
import {IconClock, IconMail, IconMenu, IconPhone} from "../Icons";
import shared from "../../styles/shared.module.css";
import styles from "./Header.module.css";
import CountrySelector from "../CountrySelector/CountrySelector";
import {useContacts} from "../../context/ContactsContext";
import {useBooking} from "../../context/BookingContext";
import {SERVICE_CATEGORIES} from "../../data/serviceDetails";

export default function Header() {
    const {contacts} = useContacts();
    const {open: openBooking} = useBooking();
    const [megaOpen, setMegaOpen] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
    const closeTimer = useRef<number | null>(null);
    const location = useLocation();

    // Close mobile drawer on route change
    useEffect(() => {
        setMobileOpen(false);
        setMobileServicesOpen(false);
    }, [location.pathname, location.hash]);

    // Lock body scroll while drawer is open
    useEffect(() => {
        document.body.style.overflow = mobileOpen ? "hidden" : "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [mobileOpen]);

    const openMega = () => {
        if (closeTimer.current) {
            window.clearTimeout(closeTimer.current);
            closeTimer.current = null;
        }
        setMegaOpen(true);
    };
    const scheduleClose = () => {
        if (closeTimer.current) window.clearTimeout(closeTimer.current);
        closeTimer.current = window.setTimeout(() => setMegaOpen(false), 180);
    };
    return (
        <header className={styles.header}>
            <div className={styles.topBar}>
                <div className={styles.topInner}>
                    <Link to="/" className={styles.brand} aria-label="Global Shore Fin Services">
                        <img src="/assets/logo.png" alt="Global Shore Fin Services" className={styles.brandMark} />
                        <span className={styles.brandName}>Global Shore Fin Services</span>
                    </Link>
                    <div className={styles.topContacts}>
                        {contacts.phone && (
                            <a href={contacts.phoneHref ?? `tel:${contacts.phone}`} className={styles.topItem}>
                                <IconPhone size={16} />
                                <span>{contacts.phone}</span>
                            </a>
                        )}
                        {contacts.email && (
                            <a href={contacts.emailHref ?? `mailto:${contacts.email}`} className={styles.topItem}>
                                <IconMail size={16} />
                                <span>{contacts.email}</span>
                            </a>
                        )}
                        {contacts.hours && (
                            <span className={`${styles.topItem} ${styles.topItemHours}`}>
                                <IconClock size={16} />
                                <span>{contacts.hours}</span>
                            </span>
                        )}
                        <CountrySelector />
                    </div>
                </div>
            </div>
            <div className={`${shared.container} ${styles.inner}`}>
                <nav className={styles.nav} aria-label="Primary">
                    <Link to="/#about">About</Link>
                    <span className={styles.navItem} onMouseEnter={openMega} onMouseLeave={scheduleClose}>
                        <Link to="/services">Services ▾</Link>
                        {megaOpen && (
                            <div className={styles.megaMenu} onMouseEnter={openMega} onMouseLeave={scheduleClose}>
                                {SERVICE_CATEGORIES.map((cat: typeof SERVICE_CATEGORIES[number]) => (
                                    <div key={cat.slug} className={styles.megaCol}>
                                        <h6>{cat.name}</h6>
                                        <ul>
                                            {cat.services.map((s: typeof cat.services[number]) => (
                                                <li key={s.slug}>
                                                    <Link to={`/services/${s.slug}`} onClick={() => setMegaOpen(false)}>
                                                        {s.name}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        )}
                    </span>
                    <Link to="/#industries">Industries</Link>
                    <Link to="/blog">Resources</Link>
                    <Link to="/#careers">Careers</Link>
                    <button
                        type="button"
                        className={styles.navLinkBtn}
                        onClick={() => openBooking({source: "header-nav"})}
                    >
                        Contact
                    </button>
                </nav>
                <div className={styles.cta}>
                    <button
                        className={styles.menuBtn}
                        aria-label={mobileOpen ? "Close menu" : "Open menu"}
                        aria-expanded={mobileOpen}
                        aria-controls="mobile-drawer"
                        onClick={() => setMobileOpen((v) => !v)}
                    >
                        <IconMenu />
                    </button>
                    <button
                        type="button"
                        className={shared.btnPrimary}
                        onClick={() => openBooking({source: "header-cta"})}
                    >
                        Book Consultation
                    </button>
                </div>
            </div>

            {mobileOpen &&
                createPortal(
                    <>
                        <div
                            className={styles.mobileBackdrop}
                            onClick={() => setMobileOpen(false)}
                            aria-hidden="true"
                        />
                        <div id="mobile-drawer" className={styles.mobileDrawer} role="dialog" aria-modal="true">
                            <nav className={styles.mobileNav} aria-label="Mobile">
                                <Link to="/#about" onClick={() => setMobileOpen(false)}>
                                    About
                                </Link>
                                <button
                                    type="button"
                                    className={styles.mobileToggle}
                                    aria-expanded={mobileServicesOpen}
                                    onClick={() => setMobileServicesOpen((v) => !v)}
                                >
                                    <span>Services</span>
                                    <span className={styles.chev}>{mobileServicesOpen ? "▴" : "▾"}</span>
                                </button>
                                {mobileServicesOpen && (
                                    <div className={styles.mobileServices}>
                                        <Link
                                            to="/services"
                                            onClick={() => setMobileOpen(false)}
                                            className={styles.mobileServicesAll}
                                        >
                                            All Services
                                        </Link>
                                        {SERVICE_CATEGORIES.map((cat: typeof SERVICE_CATEGORIES[number]) => (
                                            <div key={cat.slug} className={styles.mobileCat}>
                                                <h6>{cat.name}</h6>
                                                <ul>
                                                    {cat.services.map((s: typeof cat.services[number]) => (
                                                        <li key={s.slug}>
                                                            <Link
                                                                to={`/services/${s.slug}`}
                                                                onClick={() => setMobileOpen(false)}
                                                            >
                                                                {s.name}
                                                            </Link>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                <Link to="/#industries" onClick={() => setMobileOpen(false)}>
                                    Industries
                                </Link>
                                <Link to="/blog" onClick={() => setMobileOpen(false)}>
                                    Resources
                                </Link>
                                <Link to="/#careers" onClick={() => setMobileOpen(false)}>
                                    Careers
                                </Link>
                                <button
                                    type="button"
                                    className={styles.mobileToggle}
                                    onClick={() => {
                                        setMobileOpen(false);
                                        openBooking({source: "header-mobile"});
                                    }}
                                >
                                    <span>Contact</span>
                                </button>
                            </nav>
                        </div>
                    </>,
                    document.body
                )}
        </header>
    );
}
