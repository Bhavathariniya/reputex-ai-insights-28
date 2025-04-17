
import React, { useRef } from 'react';
import HeroSection from './HeroSection';
import FeaturesSection from './FeaturesSection';
import TestimonialsSection from './TestimonialsSection';
import CtaSection from './CtaSection';
import AddressInput from './AddressInput';

interface LandingPageProps {
  onAddressSubmit: (address: string, network: string) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onAddressSubmit }) => {
  const analyzeRef = useRef<HTMLDivElement>(null);
  
  const scrollToAnalyze = () => {
    analyzeRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection scrollToAnalyze={scrollToAnalyze} />
      
      {/* Features Section */}
      <FeaturesSection />
      
      {/* Analyze Section */}
      <section ref={analyzeRef} className="py-20 relative" id="analyze">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Analyze Any Token or Wallet</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Enter any blockchain address to get a comprehensive security analysis and AI-powered risk assessment.
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <AddressInput onSubmit={onAddressSubmit} isLoading={false} />
          </div>
          
          <div className="mt-12 text-center">
            <p className="text-sm text-muted-foreground">
              Supports Ethereum, BNB Chain, Polygon, Arbitrum, Optimism, Solana, and more.
            </p>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <TestimonialsSection />
      
      {/* CTA Section */}
      <CtaSection scrollToAnalyze={scrollToAnalyze} />
    </div>
  );
};

export default LandingPage;
