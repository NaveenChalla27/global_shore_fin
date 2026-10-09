import {createContext, useCallback, useContext, useMemo, useState, type ReactNode} from "react";

type OpenOptions = {service?: string; title?: string};

type BookingContextValue = {
    isOpen: boolean;
    options: OpenOptions;
    open: (opts?: OpenOptions) => void;
    close: () => void;
};

const BookingContext = createContext<BookingContextValue | null>(null);

export function BookingProvider({children}: {children: ReactNode}) {
    const [isOpen, setIsOpen] = useState(false);
    const [options, setOptions] = useState<OpenOptions>({});

    const open = useCallback((opts: OpenOptions = {}) => {
        setOptions(opts);
        setIsOpen(true);
    }, []);
    const close = useCallback(() => setIsOpen(false), []);

    const value = useMemo(() => ({isOpen, options, open, close}), [isOpen, options, open, close]);

    return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}

export function useBooking() {
    const ctx = useContext(BookingContext);
    if (!ctx) throw new Error("useBooking must be used inside BookingProvider");
    return ctx;
}
