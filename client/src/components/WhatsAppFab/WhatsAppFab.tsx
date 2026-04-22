import {IconWhatsapp} from "../Icons";
import styles from "./WhatsAppFab.module.css";
import {useContacts} from "../../context/ContactsContext";

export default function WhatsAppFab() {
    const {contacts} = useContacts();
    const number = contacts.whatsapp ?? "10000000000";
    return (
        <a
            className={styles.fab}
            href={`https://wa.me/${number}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat on WhatsApp"
        >
            <IconWhatsapp />
        </a>
    );
}
