import {createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode} from "react";
import {fetchCountries} from "../api/countries";
import {type Country, type Service, type ServiceKey} from "../data/countries";

const DEFAULT_COUNTRY_CODE = "US";

// Structural placeholder used while the real data loads — keeps consuming components
// from crashing before the first API response arrives.
const PLACEHOLDER_COUNTRY: Country = {
    code: DEFAULT_COUNTRY_CODE,
    name: "",
    status: "active",
    eyebrow: "",
    heroTitle: "",
    heroSub: "",
    trustBadges: [],
    services: [],
    stats: [],
};

type CountryContextValue = {
    countries: Country[];
    country: Country;
    setCountryCode: (code: string) => void;
    selectedServices: ServiceKey[];
    toggleService: (key: ServiceKey) => void;
    clearServices: () => void;
    visibleServices: Service[];
    loading: boolean;
    error: string | null;
    refresh: () => void;
};

const CountryContext = createContext<CountryContextValue | null>(null);

export function CountryProvider({children}: {children: ReactNode}) {
    const [countries, setCountries] = useState<Country[]>([]);
    const [code, setCode] = useState(DEFAULT_COUNTRY_CODE);
    const [selectedServices, setSelectedServices] = useState<ServiceKey[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [reloadKey, setReloadKey] = useState(0);

    useEffect(() => {
        const ctrl = new AbortController();
        setLoading(true);
        setError(null);
        fetchCountries(ctrl.signal)
        .then((list) => setCountries(list))
        .catch((err) => {
            if ((err as Error).name !== "AbortError") setError((err as Error).message);
        })
        .finally(() => setLoading(false));
        return () => ctrl.abort();
    }, [reloadKey]);

    const country = useMemo(
        () => countries.find((c) => c.code === code) ?? countries[0] ?? PLACEHOLDER_COUNTRY,
        [countries, code]
    );

    const refresh = useCallback(() => setReloadKey((k) => k + 1), []);

    const value = useMemo<CountryContextValue>(() => {
        const visibleServices =
            selectedServices.length === 0
                ? country.services
                : country.services.filter((s) => selectedServices.includes(s.key));
        return {
            countries,
            country,
            setCountryCode: (next) => {
                setCode(next);
                setSelectedServices([]);
            },
            selectedServices,
            toggleService: (key) =>
                setSelectedServices((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key])),
            clearServices: () => setSelectedServices([]),
            visibleServices,
            loading,
            error,
            refresh,
        };
    }, [countries, country, selectedServices, loading, error, refresh]);

    return <CountryContext.Provider value={value}>{children}</CountryContext.Provider>;
}

export function useCountry() {
    const ctx = useContext(CountryContext);
    if (!ctx) throw new Error("useCountry must be used inside CountryProvider");
    return ctx;
}
