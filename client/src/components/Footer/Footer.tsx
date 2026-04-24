import shared from "../../styles/shared.module.css";
import styles from "./Footer.module.css";
import {Link} from "react-router-dom";
import {useContacts} from "../../context/ContactsContext";
import {useCountry} from "../../context/CountryContext";
import {SERVICE_CATEGORIES} from "../../data/serviceDetails";

export default function Footer() {
    const {contacts} = useContacts();
    const {country} = useCountry();
    const socials = contacts.socials ?? {};
    return (
        <footer id="contact" className={styles.footer}>
            <div className={shared.container}>
                <div className={styles.grid}>
                    <div>
                        <Link to="/" className={styles.brand}>
                            <img src="/assets/logo.png" alt="Global Shore Fin Services" className={styles.brandMark} />
                            <span>Global Shore Fin Services</span>
                        </Link>
                        <p className={styles.tag}>
                            Your {country.short ?? country.name} financial partner — payroll, tax, accounting, and
                            compliance for businesses, NRIs, expats, and immigrants.
                        </p>
                    </div>
                    <div>
                        <h5>Services</h5>
                        <ul>
                            {SERVICE_CATEGORIES.map((cat) => (
                                <li key={cat.slug}>
                                    <Link to={`/services/${cat.services[0].slug}`}>{cat.name}</Link>
                                </li>
                            ))}
                            <li>
                                <Link to="/services">All Services →</Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h5>Quick Links</h5>
                        <ul>
                            <li>
                                <Link to="/#about">About Us</Link>
                            </li>
                            <li>
                                <Link to="/#industries">Industries</Link>
                            </li>
                            <li>
                                <Link to="/#blog">Resources</Link>
                            </li>
                            <li>
                                <Link to="/#careers">Careers</Link>
                            </li>
                            <li>
                                <Link to="/#contact">Contact</Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h5>Contact</h5>
                        <ul>
                            {contacts.address && <li>{contacts.address}</li>}
                            {contacts.email && (
                                <li>
                                    <a href={contacts.emailHref ?? `mailto:${contacts.email}`}>{contacts.email}</a>
                                </li>
                            )}
                            {contacts.phone && (
                                <li>
                                    <a href={contacts.phoneHref ?? `tel:${contacts.phone}`}>{contacts.phone}</a>
                                </li>
                            )}
                        </ul>
                    </div>
                    <div>
                        <h5>Follow</h5>
                        <ul>
                            {socials.linkedin && (
                                <li>
                                    <a href={socials.linkedin} target="_blank" rel="noopener noreferrer">
                                        LinkedIn
                                    </a>
                                </li>
                            )}
                            {socials.twitter && (
                                <li>
                                    <a href={socials.twitter} target="_blank" rel="noopener noreferrer">
                                        Twitter / X
                                    </a>
                                </li>
                            )}
                            {socials.youtube && (
                                <li>
                                    <a href={socials.youtube} target="_blank" rel="noopener noreferrer">
                                        YouTube
                                    </a>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
                <div className={styles.bottom}>
                    <span>© {new Date().getFullYear()} Global Shore Fin Services Inc. All rights reserved.</span>
                    <span>
                        <a href="#">Privacy Policy</a>
                        <a href="#">Terms &amp; Conditions</a>
                        <a href="#">Disclaimer</a>
                    </span>
                </div>
            </div>
        </footer>
    );
}
