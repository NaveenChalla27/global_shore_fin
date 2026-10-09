import {StrictMode} from "react";
import {createRoot} from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import {CountryProvider} from "./context/CountryContext";
import {ContactsProvider} from "./context/ContactsContext";
import {BookingProvider} from "./context/BookingContext";
import {ServicesProvider} from "./context/ServicesContext";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <CountryProvider>
            <ContactsProvider>
                <ServicesProvider>
                    <BookingProvider>
                        <App />
                    </BookingProvider>
                </ServicesProvider>
            </ContactsProvider>
        </CountryProvider>
    </StrictMode>
);
