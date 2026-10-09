import {createContext, useCallback, useContext, useEffect, useState, type ReactNode} from "react";
import {fetchContacts, type Contacts} from "../api/countries";
import {useCountry} from "./CountryContext";

type ContactsContextValue = {
    contacts: Contacts;
    loading: boolean;
    error: string | null;
    refresh: () => void;
};

const ContactsContext = createContext<ContactsContextValue | null>(null);

export function ContactsProvider({children}: {children: ReactNode}) {
    const {country} = useCountry();
    const [contacts, setContacts] = useState<Contacts>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [reloadKey, setReloadKey] = useState(0);

    useEffect(() => {
        if (!country.code) return;
        const ctrl = new AbortController();
        setLoading(true);
        setError(null);
        fetchContacts(ctrl.signal, country.code)
        .then((data) => setContacts(data))
        .catch((err) => {
            if ((err as Error).name !== "AbortError") setError((err as Error).message);
        })
        .finally(() => setLoading(false));
        return () => ctrl.abort();
    }, [reloadKey, country.code]);

    const refresh = useCallback(() => setReloadKey((k) => k + 1), []);

    return <ContactsContext.Provider value={{contacts, loading, error, refresh}}>{children}</ContactsContext.Provider>;
}

export function useContacts() {
    const ctx = useContext(ContactsContext);
    if (!ctx) throw new Error("useContacts must be used inside ContactsProvider");
    return ctx;
}
