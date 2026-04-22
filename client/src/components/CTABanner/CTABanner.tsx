import shared from "../../styles/shared.module.css";
import styles from "./CTABanner.module.css";
import {useBooking} from "../../context/BookingContext";

export default function CTABanner() {
    const {open} = useBooking();
    return (
        <section className={styles.banner} id="contact">
            <div className={shared.container}>
                <h2>Ready to get started?</h2>
                <p>
                    Book your free 30-minute consultation today and find out how Global Shore can simplify your US
                    payroll, taxes, and accounting.
                </p>
                <button
                    type="button"
                    className={shared.btnLight}
                    onClick={() => open({source: "cta-banner", title: "Schedule a Call"})}
                >
                    Schedule a Call
                </button>
            </div>
        </section>
    );
}
