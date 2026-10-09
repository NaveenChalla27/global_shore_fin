import Hero from "../components/Hero/Hero";
import ServicesGrid from "../components/ServicesGrid/ServicesGrid";
import WhyChoose from "../components/WhyChoose/WhyChoose";
import Stats from "../components/Stats/Stats";
import WhoWeServe from "../components/WhoWeServe/WhoWeServe";
import Process from "../components/Process/Process";
import Testimonials from "../components/Testimonials/Testimonials";
import BlogPosts from "../components/BlogPosts/BlogPosts";

export default function HomePage() {
    return (
        <>
            <Hero />
            <ServicesGrid />
            <WhyChoose />
            <Stats />
            <WhoWeServe />
            <Process />
            <Testimonials />
            <BlogPosts />
        </>
    );
}
