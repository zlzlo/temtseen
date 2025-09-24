import Navigation from "@/components/navigation";
import HeroSection from "@/components/hero-section";
import AboutSection from "@/components/about-section";
import ProgramsSection from "@/components/programs-section";
import AdmissionsSection from "@/components/admissions-section";
import StudentLifeSection from "@/components/student-life-section";
import NewsSection from "@/components/news-section";
import TestimonialsSection from "@/components/testimonials-section";
import PartnershipsSection from "@/components/partnerships-section";
import FaqSection from "@/components/faq-section";
import ContactSection from "@/components/contact-section";
import Footer from "@/components/footer";
import BackToTop from "@/components/back-to-top";
import ChatbotWidget from "@/components/chatbot";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <HeroSection />
        <AboutSection />
        <ProgramsSection />
        <AdmissionsSection />
        <StudentLifeSection />
        <NewsSection />
        <TestimonialsSection />
        <PartnershipsSection />
        <FaqSection />
        <ContactSection />
      </main>
      <Footer />
      <BackToTop />
      <ChatbotWidget />
    </div>
  );
}
