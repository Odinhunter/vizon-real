import Navbar from '@/components/landing/Navbar';
import HeroSection from '@/components/landing/HeroSection';
import ProblemSection from '@/components/landing/ProblemSection';
import HowItWorksSection from '@/components/landing/HowItWorksSection';
import OutputSection from '@/components/landing/OutputSection';
import TracksSection from '@/components/landing/TracksSection';
import Footer from '@/components/landing/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#dce8f8] flex flex-col">
      <Navbar />
      <HeroSection />
      <ProblemSection />
      <TracksSection />
      <HowItWorksSection />
      <OutputSection />
      <Footer />
    </div>
  );
}
