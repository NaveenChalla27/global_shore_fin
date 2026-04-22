import {BrowserRouter, Route, Routes} from "react-router-dom";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import WhatsAppFab from "./components/WhatsAppFab/WhatsAppFab";
import BookingModal from "./components/BookingModal/BookingModal";
import ScrollToHash from "./components/ScrollToHash";
import HomePage from "./pages/HomePage";
import ServicesIndexPage from "./pages/ServicesIndexPage";
import ServiceDetailPage from "./pages/ServiceDetailPage";
import BlogIndexPage from "./pages/BlogIndexPage";
import BlogDetailPage from "./pages/BlogDetailPage";

export default function App() {
    return (
        <BrowserRouter>
            <ScrollToHash />
            <Header />
            <main>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/services" element={<ServicesIndexPage />} />
                    <Route path="/services/:slug" element={<ServiceDetailPage />} />
                    <Route path="/blog" element={<BlogIndexPage />} />
                    <Route path="/blog/:slug" element={<BlogDetailPage />} />
                    <Route path="*" element={<HomePage />} />
                </Routes>
            </main>
            <Footer />
            <WhatsAppFab />
            <BookingModal />
        </BrowserRouter>
    );
}
