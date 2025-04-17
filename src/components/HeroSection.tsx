
import React from 'react';
import { Shield, Sparkles, Search, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeroSectionProps {
  scrollToAnalyze: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ scrollToAnalyze }) => {
  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-neon-purple/10 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-neon-cyan/10 rounded-full filter blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="lg:w-1/2 space-y-6 text-center lg:text-left">
            <div className="inline-block mb-4 px-3 py-1.5 rounded-full bg-muted/30 border border-muted">
              <span className="text-sm font-medium flex items-center">
                <Sparkles className="h-3.5 w-3.5 mr-2 text-neon-cyan" />
                Web3's Multi-Chain Reputation Intelligence
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
              <span className="block">ReputeX AI –</span>
              <span className="neon-text mt-2 block">Unmask Risk. Build Trust. Invest Smart.</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0">
              AI-powered blockchain intelligence that gives you confidence in every crypto investment across 12 major blockchains.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
              <Button 
                onClick={scrollToAnalyze} 
                size="lg" 
                className="bg-neon-cyan hover:bg-neon-cyan/90 text-background font-medium"
              >
                <Zap className="mr-2 h-5 w-5" />
                Try Demo
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-neon-cyan text-neon-cyan hover:bg-neon-cyan/10"
              >
                <Shield className="mr-2 h-5 w-5" />
                Learn More
              </Button>
            </div>
          </div>

          <div className="lg:w-1/2 relative">
            <div className="shield-container mx-auto">
              <div className="shield-pulse-ring"></div>
              <div className="shield-glow">
                <Shield className="shield-icon h-16 w-16" />
              </div>
            </div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full">
              <div className="relative w-full h-full">
                <div className="absolute top-0 left-0 w-20 h-20 bg-neon-pink/30 rounded-full filter blur-xl animate-pulse"></div>
                <div className="absolute bottom-10 right-10 w-24 h-24 bg-neon-cyan/30 rounded-full filter blur-xl animate-pulse delay-700"></div>
                <div className="absolute top-1/3 right-1/4 w-16 h-16 bg-neon-blue/30 rounded-full filter blur-xl animate-pulse delay-500"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
