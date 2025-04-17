
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronRight, Search, Shield } from 'lucide-react';

interface CtaSectionProps {
  scrollToAnalyze: () => void;
}

const CtaSection: React.FC<CtaSectionProps> = ({ scrollToAnalyze }) => {
  return (
    <section className="py-20 relative">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-radial from-neon-purple/10 via-background to-background z-0"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="neon-border p-[1px] rounded-xl overflow-hidden">
          <div className="bg-card/90 backdrop-blur-md rounded-xl p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-4">
                  Ready to securely explore the world of crypto?
                </h2>
                <p className="text-muted-foreground max-w-xl">
                  Get started with ReputeX AI today and never invest in a scam token again. 
                  Analyze any blockchain address for free.
                </p>
              </div>
              
              <div className="flex gap-4">
                <Button 
                  onClick={scrollToAnalyze}
                  size="lg" 
                  className="bg-neon-cyan hover:bg-neon-cyan/90 text-background font-medium"
                >
                  <Search className="mr-2 h-5 w-5" />
                  Try Now
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-neon-pink text-neon-pink hover:bg-neon-pink/10"
                >
                  Learn More
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
