
import React from 'react';
import { User, Quote, MessageCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const testimonials = [
  {
    name: "Alex Thompson",
    role: "Crypto Fund Manager",
    quote: "ReputeX AI saved us from a potential rug pull that would have cost our investors millions. Now we run every investment through it first."
  },
  {
    name: "Sarah Chen",
    role: "DeFi Developer",
    quote: "The smart contract analysis is incredibly thorough. As a developer, I appreciate the technical depth while keeping the UI accessible for everyone."
  },
  {
    name: "Michael Edwards",
    role: "Blockchain Investor",
    quote: "Finally, a tool that gives me confidence in my investments. The multi-chain support means I can analyze any token regardless of the blockchain."
  }
];

const TestimonialsSection: React.FC = () => {
  return (
    <section className="py-20 relative overflow-hidden" id="testimonials">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-20 right-10 w-72 h-72 bg-neon-pink/5 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-neon-cyan/5 rounded-full filter blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center mb-4">
            <MessageCircle className="h-5 w-5 mr-2 text-neon-cyan" />
            <span className="text-sm font-medium">Trusted by professionals</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Users Say</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            ReputeX AI is trusted by investors, developers, and fund managers around the world.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-card/50 backdrop-blur-sm border border-muted hover:border-neon-cyan/50 transition-all duration-300">
              <CardContent className="p-6">
                <Quote className="h-8 w-8 text-neon-cyan/50 mb-4" />
                <p className="text-foreground/90 mb-6">"{testimonial.quote}"</p>
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center mr-3">
                    <User className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
