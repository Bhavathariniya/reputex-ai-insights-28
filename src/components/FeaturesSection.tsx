
import React from 'react';
import { 
  Shield, 
  Sparkles, 
  AlertTriangle, 
  Link2, 
  Database, 
  BarChart3, 
  Fingerprint,
  Globe
} from 'lucide-react';

const features = [
  {
    icon: Sparkles,
    title: "AI-powered Reputation Scoring",
    description: "Advanced ML models analyze on-chain data to provide accurate trust scores for any wallet or token."
  },
  {
    icon: Shield,
    title: "Smart Contract & Token Audit",
    description: "Automated security checks identify vulnerabilities, backdoors, and high-risk functions in token contracts."
  },
  {
    icon: AlertTriangle,
    title: "Rug Pull & Honeypot Detection",
    description: "Proactively identify scam indicators with our AI-driven risk detection engine."
  },
  {
    icon: Globe,
    title: "Multi-Chain Analysis",
    description: "Supports Ethereum, BNB Chain, Polygon, Arbitrum, Optimism, Solana, Avalanche, Base, and more."
  },
  {
    icon: Fingerprint,
    title: "Investor Confidence Dashboard",
    description: "Get a complete overview of any token's trustworthiness with our comprehensive metrics."
  },
  {
    icon: Database,
    title: "Token Distribution Visualization",
    description: "Analyze holder concentration, liquidity depth, and ownership patterns to avoid manipulated markets."
  },
  {
    icon: BarChart3,
    title: "Real-time Risk Metrics",
    description: "Monitor liquidity changes, holder movements, and transaction patterns to identify emerging risks."
  },
  {
    icon: Link2,
    title: "Cross-Chain Identity Tracking",
    description: "Track connected wallets and contract ownership across multiple blockchains to reveal coordinated activity."
  }
];

const FeaturesSection: React.FC = () => {
  return (
    <section className="relative py-20 overflow-hidden" id="features">
      <div className="absolute inset-0 bg-gradient-to-b from-background to-muted/5 opacity-80 z-0"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            ReputeX AI combines advanced blockchain analytics with artificial intelligence to provide comprehensive security insights.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="glass-card p-6 rounded-xl transition-all duration-300 hover:translate-y-[-5px] hover:shadow-lg"
            >
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-muted/40 mb-4">
                <feature.icon className="h-6 w-6 text-neon-cyan" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
