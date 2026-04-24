import {createContext, useCallback, useContext, useEffect, useState, type ReactNode} from "react";
import {fetchContacts, type Contacts} from "../api/countries";

const FALLBACK: Contacts = {
    phone: "+1 (203) 435-3563",
    phoneHref: "tel:+12034353563",
    email: "support@taxmonkglobal.com",
    emailHref: "mailto:support@taxmonkglobal.com",
    hours: "Mon-Fri: 9AM - 7PM (MST)",
    whatsapp: "10000000000",
    address: "Tennessee, United States",
    socials: {linkedin: "#", twitter: "#", instagram: "#"},
};

type ContactsContextValue = {
    contacts: Contacts;
    loading: boolean;
    error: string | null;
    refresh: () => void;
};

const ContactsContext = createContext<ContactsContextValue | null>(null);

export function ContactsProvider({children}: {children: ReactNode}) {
    const [contacts, setContacts] = useState<Contacts>(FALLBACK);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [reloadKey, setReloadKey] = useState(0);

    useEffect(() => {
        const ctrl = new AbortController();
        setLoading(true);
        setError(null);
        fetchContacts(ctrl.signal)
        .then((data) => setContacts({...FALLBACK, ...data}))
        .catch((err) => {
            if ((err as Error).name !== "AbortError") setError((err as Error).message);
        })
        .finally(() => setLoading(false));
        return () => ctrl.abort();
    }, [reloadKey]);

    const refresh = useCallback(() => setReloadKey((k) => k + 1), []);

    return <ContactsContext.Provider value={{contacts, loading, error, refresh}}>{children}</ContactsContext.Provider>;
}

export function useContacts() {
    const ctx = useContext(ContactsContext);
    if (!ctx) throw new Error("useContacts must be used inside ContactsProvider");
    return ctx;
}
