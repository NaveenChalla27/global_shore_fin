import {StrictMode} from "react";
import {createRoot} from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import {CountryProvider} from "./context/CountryContext";
import {ContactsProvider} from "./context/ContactsContext";
import {BookingProvider} from "./context/BookingContext";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <CountryProvider>
            <ContactsProvider>
                <BookingProvider>
                    <App />
                </BookingProvider>
            </ContactsProvider>
        </CountryProvider>
    </StrictMode>
);
