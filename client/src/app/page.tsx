import { Navbar } from '@/components/landing/Navbar';
import { Hero } from '@/components/landing/Hero';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { SkillGapShowcase } from '@/components/landing/SkillGapShowcase';
import { AssistantSpotlight } from '@/components/landing/AssistantSpotlight';
import { FinalCTA } from '@/components/landing/FinalCTA';
import { Footer } from '@/components/landing/Footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <HowItWorks />
        <SkillGapShowcase />
        <AssistantSpotlight />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
