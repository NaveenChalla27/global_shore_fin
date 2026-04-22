import shared from "../../styles/shared.module.css";
import styles from "./Stats.module.css";
import {useCountry} from "../../context/CountryContext";

export default function Stats() {
    const {country} = useCountry();
    return (
        <section className={styles.stats}>
            <div className={shared.container}>
                <div className={styles.grid}>
                    {country.stats.map((s) => (
                        <div key={s.label}>
                            <div className={styles.num}>{s.num}</div>
                            <div className={styles.lbl}>{s.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
