import {useEffect, useRef, useState} from "react";
import {useCountry} from "../../context/CountryContext";
import {IconPin} from "../Icons";
import styles from "./CountrySelector.module.css";

export default function CountrySelector() {
    const {countries, country, setCountryCode} = useCountry();
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function onDocClick(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        }
        document.addEventListener("mousedown", onDocClick);
        return () => document.removeEventListener("mousedown", onDocClick);
    }, []);

    return (
        <div className={styles.wrap} ref={ref}>
            <button
                type="button"
                className={styles.trigger}
                onClick={() => setOpen((o) => !o)}
                aria-haspopup="listbox"
                aria-expanded={open}
                title="Choose your country"
            >
                <span className={styles.pin} aria-hidden="true">
                    <IconPin size={16} />
                </span>
                <span className={styles.code}>{country.name}</span>
                <span className={styles.caret} aria-hidden="true">
                    ▾
                </span>
            </button>
            {open && (
                <ul className={styles.menu} role="listbox" aria-label="Select country">
                    {countries.map((c) => {
                        const active = c.code === country.code;
                        const comingSoon = c.status === "coming-soon";
                        return (
                            <li key={c.code}>
                                <button
                                    type="button"
                                    className={`${styles.item} ${active ? styles.itemActive : ""} ${
                                        comingSoon ? styles.itemDisabled : ""
                                    }`}
                                    role="option"
                                    aria-selected={active}
                                    disabled={comingSoon}
                                    onClick={() => {
                                        if (comingSoon) return;
                                        setCountryCode(c.code);
                                        setOpen(false);
                                    }}
                                >
                                    <span className={styles.itemName}>{c.name}</span>
                                    {comingSoon && <span className={styles.badge}>Soon</span>}
                                </button>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}
