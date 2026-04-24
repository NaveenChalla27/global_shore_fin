import {useEffect} from "react";
import {useLocation} from "react-router-dom";

const HEADER_OFFSET = 120;

export default function ScrollToHash() {
    const {pathname, hash, key} = useLocation();

    useEffect(() => {
        if (hash) {
            const id = hash.slice(1);
            // Wait a tick so the target route has rendered
            const t = window.setTimeout(() => {
                const el = document.getElementById(id);
                if (el) {
                    const top = el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
                    window.scrollTo({top, behavior: "smooth"});
                }
            }, 50);
            return () => window.clearTimeout(t);
        }
        window.scrollTo({top: 0, behavior: "instant" as ScrollBehavior});
    }, [pathname, hash, key]);

    return null;
}
