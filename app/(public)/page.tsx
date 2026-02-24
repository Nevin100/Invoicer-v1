import Navbar from "@/components/Home/Navbar";
import Hero from "@/components/Home/Hero";
import Features from "@/components/Home/Features";
import Pricing from "@/components/Home/Pricing";
import CTA from "@/components/Home/CTA";
import Footer from "@/components/Home/Footer";

export default function LandingPage() {
  return (
    <main className="bg-[#fcfcfd] min-h-screen antialiased">
      <Navbar />
      <Hero />
      <Features />
      <CTA/>
      <Pricing />
      <Footer />
     
    </main>
  );
}