
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { AlertTriangle, ShieldOff, ThumbsDown, Ban, Info } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';

interface ScamPatternProps {
  tokenInfo: any;
  analysis: any;
}

const ScamPattern: React.FC<ScamPatternProps> = ({ tokenInfo, analysis }) => {
  // Common scam patterns to check against
  const scamPatterns = [
    {
      id: 'concentration',
      name: 'High Wallet Concentration',
      icon: <Users size={18} />,
      description: 'Excessive token concentration in few wallets indicates potential for price manipulation.',
      detected: tokenInfo?.holders?.distribution_percentage && 
                parseFloat(tokenInfo.holders.distribution_percentage.top_10 || '0') > 80,
      severity: 'high'
    },
    {
      id: 'social',
      name: 'Missing Social Presence',
      icon: <Info size={18} />,
      description: 'Legitimate projects typically maintain active social media channels.',
      detected: !tokenInfo?.twitter_handle && !tokenInfo?.discord_url && !tokenInfo?.telegram_handle,
      severity: 'medium'
    },
    {
      id: 'website',
      name: 'No Official Website',
      icon: <Ban size={18} />,
      description: 'Lack of an official website is a common red flag for scam tokens.',
      detected: !tokenInfo?.websites || tokenInfo.websites.length === 0,
      severity: 'high'
    },
    {
      id: 'score',
      name: 'Low Trust Score',
      icon: <ThumbsDown size={18} />,
      description: 'Token has received a notably low trust score based on multiple factors.',
      detected: analysis?.trustScore < 30,
      severity: 'high'
    }
  ];

  // Filter to only detected patterns
  const detectedPatterns = scamPatterns.filter(pattern => pattern.detected);
  
  // Helper for rendering severity badges
  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'high':
        return <span className="text-xs font-medium bg-red-100 text-red-800 px-2 py-0.5 rounded-full">High</span>;
      case 'medium':
        return <span className="text-xs font-medium bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">Medium</span>;
      default:
        return <span className="text-xs font-medium bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">Low</span>;
    }
  };

  // Common scam types with explanations
  const commonScamTypes = [
    {
      name: 'Pump and Dump',
      description: 'Creators artificially inflate the price through misleading statements and then sell their shares when the price rises enough.'
    },
    {
      name: 'Rug Pull',
      description: 'Developers abandon a project and run away with investor funds, often after removing liquidity from trading pools.'
    },
    {
      name: 'Honeypot',
      description: 'Smart contract prevents regular investors from selling their tokens while allowing privileged accounts to withdraw.'
    },
    {
      name: 'Impersonation Scam',
      description: 'Projects that mimic legitimate tokens with slight name variations to trick investors.'
    }
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-red-600">
          <AlertTriangle className="text-red-600" size={20} />
          Scam Pattern Detection
        </CardTitle>
        <CardDescription>Analysis of potential fraudulent characteristics</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="p-4 rounded-lg border border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800">
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            <ShieldOff className="text-red-600" size={18} />
            Detected Warning Signs
          </h3>
          
          {detectedPatterns.length > 0 ? (
            <ul className="space-y-3">
              {detectedPatterns.map(pattern => (
                <li key={pattern.id} className="flex items-start gap-2">
                  <AlertTriangle className="text-red-600 mt-1 shrink-0" size={16} />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{pattern.name}</span>
                      {getSeverityBadge(pattern.severity)}
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{pattern.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm">No explicit scam patterns detected. However, always conduct your own research.</p>
          )}
        </div>
        
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="scam-types">
            <AccordionTrigger className="font-semibold">
              Common Crypto Scam Types
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 pt-2">
                {commonScamTypes.map((scam, index) => (
                  <div key={index} className="border-l-4 border-red-500 pl-3">
                    <h4 className="font-medium">{scam.name}</h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{scam.description}</p>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="safety-tips">
            <AccordionTrigger className="font-semibold">
              Safety Tips for Investors
            </AccordionTrigger>
            <AccordionContent>
              <ul className="space-y-2 list-disc list-inside text-sm">
                <li>Always verify token contract addresses on blockchain explorers.</li>
                <li>Check if the token has locked liquidity and for how long.</li>
                <li>Research the team behind the project - anonymous teams are higher risk.</li>
                <li>Be wary of tokens that limit selling or have high transaction taxes.</li>
                <li>Avoid projects with unrealistic promises or guaranteed returns.</li>
                <li>Check if the project has been audited by reputable security firms.</li>
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
};

// Additional Users component needed for the ScamPattern component
const Users = ({ size = 24 }: { size?: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

export default ScamPattern;
