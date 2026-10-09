import {createContext, useContext, useEffect, useMemo, useState, type ReactNode} from "react";
import {fetchServiceCategories, type ServiceCategory} from "../api/countries";

type ServicesContextValue = {
    categories: ServiceCategory[];
    loading: boolean;
    error: string | null;
};

const ServicesContext = createContext<ServicesContextValue | null>(null);

export function ServicesProvider({children}: {children: ReactNode}) {
    const [categories, setCategories] = useState<ServiceCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const ctrl = new AbortController();
        fetchServiceCategories(ctrl.signal)
        .then(setCategories)
        .catch((err) => {
            if ((err as Error).name !== "AbortError") setError((err as Error).message);
        })
        .finally(() => setLoading(false));
        return () => ctrl.abort();
    }, []);

    const value = useMemo(() => ({categories, loading, error}), [categories, loading, error]);
    return <ServicesContext.Provider value={value}>{children}</ServicesContext.Provider>;
}

export function useServices() {
    const ctx = useContext(ServicesContext);
    if (!ctx) throw new Error("useServices must be used inside ServicesProvider");
    return ctx;
}
