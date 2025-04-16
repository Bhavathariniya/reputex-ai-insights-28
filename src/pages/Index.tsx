
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AddressInput from '@/components/AddressInput';
import LoadingAnimation from '@/components/LoadingAnimation';
import AnalysisReport from '@/components/AnalysisReport';
import { toast } from 'sonner';
import { Volume2, VolumeX, Shield } from 'lucide-react';
import {
  getWalletTransactions,
  getTokenData,
  getRepoActivity,
  getAIAnalysis,
  checkBlockchainForScore,
  storeScoreOnBlockchain,
  getSocialSentiment,
  detectScamIndicators,
} from '@/lib/api-client';
import { isContract, detectBlockchain } from '@/lib/chain-detection';

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<any | null>(null);
  const [searchedAddress, setSearchedAddress] = useState<string | null>(null);
  const [searchedNetwork, setSearchedNetwork] = useState<string>('ethereum');
  const [audioEnabled, setAudioEnabled] = useState<boolean>(false);
  const [addressType, setAddressType] = useState<'wallet' | 'contract' | null>(null);
  const [isAutoDetecting, setIsAutoDetecting] = useState<boolean>(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Check for address in URL query params
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const addressParam = query.get('address');
    const networkParam = query.get('network') || 'ethereum';
    
    if (addressParam) {
      setSearchedAddress(addressParam);
      setSearchedNetwork(networkParam);
      handleAddressSearch(addressParam, networkParam);
    }
  }, [location]);

  const autoDetectNetwork = async (address: string): Promise<string> => {
    setIsAutoDetecting(true);
    try {
      toast.info("Detecting blockchain network...");
      const detectedNetwork = await detectBlockchain(address);
      if (detectedNetwork) {
        toast.success(`Detected network: ${detectedNetwork}`);
        return detectedNetwork;
      } else {
        toast.warning("Could not detect network. Defaulting to Ethereum.");
        return 'ethereum';
      }
    } catch (error) {
      console.error("Error detecting network:", error);
      toast.error("Network detection failed. Defaulting to Ethereum.");
      return 'ethereum';
    } finally {
      setIsAutoDetecting(false);
    }
  };

  const handleAddressSearch = async (address: string, network: string) => {
    setIsLoading(true);
    setAnalysis(null);
    
    // Auto-detect network if set to 'auto'
    let resolvedNetwork = network;
    if (network === 'auto') {
      resolvedNetwork = await autoDetectNetwork(address);
    }
    
    try {
      // First check if we already have this score on the blockchain
      const existingScoreResponse = await checkBlockchainForScore(address, resolvedNetwork);
      
      if (existingScoreResponse.data) {
        // Use existing score
        setAnalysis(existingScoreResponse.data);
        toast.success('Retrieved existing analysis from blockchain');
        setIsLoading(false);
        
        // Set the address type based on the stored data
        setAddressType(existingScoreResponse.data.address_type || null);
        return;
      }
      
      // If no existing score, perform new analysis
      // First determine if this is a contract or wallet
      const isContractAddress = await isContract(address, resolvedNetwork);
      setAddressType(isContractAddress ? 'contract' : 'wallet');
      
      // Fetch wallet transaction data
      const walletData = await getWalletTransactions(address, resolvedNetwork);
      
      // Fetch token data (if it's a contract)
      const tokenData = await getTokenData(address, resolvedNetwork);
      
      // Simulate GitHub repo activity (relevant mainly for contracts/tokens)
      const repoData = await getRepoActivity("example/repo");
      
      // Get social sentiment data
      const sentimentData = await getSocialSentiment(address, resolvedNetwork);
      
      // Detect scam indicators
      const scamData = await detectScamIndicators(address, tokenData.data, resolvedNetwork);
      
      // Aggregate the data
      const aggregatedData = {
        ...walletData.data,
        ...tokenData.data,
        ...repoData.data,
        ...sentimentData.data,
        ...scamData.data,
        community_size: "Medium", // Simulated community size
        network: resolvedNetwork,
        address_type: isContractAddress ? 'contract' : 'wallet',
      };
      
      // Get enhanced AI analysis
      const aiAnalysisResponse = await getAIAnalysis(aggregatedData);
      
      if (aiAnalysisResponse.data) {
        // Prepare the final analysis data with all scores and indicators
        const enhancedData = {
          ...aiAnalysisResponse.data,
          network: resolvedNetwork,
          address_type: isContractAddress ? 'contract' : 'wallet',
          sentimentData: aiAnalysisResponse.data.sentiment_data,
          scamIndicators: aiAnalysisResponse.data.scam_indicators,
        };
        
        // Store the analysis result
        setAnalysis(enhancedData);
        
        // Store on blockchain
        await storeScoreOnBlockchain(address, enhancedData);
        
        const addressTypeText = isContractAddress ? 'contract' : 'wallet';
        toast.success(`Enhanced analysis complete for ${resolvedNetwork} ${addressTypeText}`);
      } else {
        toast.error('Failed to analyze address');
      }
    } catch (error) {
      console.error('Error in analysis process:', error);
      toast.error('Analysis failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (address: string, network: string) => {
    setSearchedAddress(address);
    setSearchedNetwork(network);
    // Update URL with the address and network parameters
    navigate(`/?address=${address}&network=${network}`);
  };

  const toggleAudio = () => {
    setAudioEnabled(!audioEnabled);
    if (!audioEnabled) {
      // Play ambient sound
      try {
        const audio = new Audio('/ambient.mp3'); // This file would need to be added
        audio.volume = 0.2;
        audio.loop = true;
        audio.play().catch(error => {
          console.log("Audio playback failed: ", error);
        });
      } catch (error) {
        console.error("Error playing audio:", error);
      }
    } else {
      // Stop ambient sound - this is simplified; you'd need to keep a reference to the audio element
      const audioElements = document.querySelectorAll('audio');
      audioElements.forEach(audio => {
        audio.pause();
        audio.currentTime = 0;
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden">
      <Navbar />
      
      <div className="audio-toggle" onClick={toggleAudio}>
        {audioEnabled ? (
          <Volume2 className="h-5 w-5 text-neon-cyan" />
        ) : (
          <VolumeX className="h-5 w-5 text-muted-foreground" />
        )}
      </div>
      
      <main className="flex-grow pt-32 pb-16 px-4 container mx-auto relative z-10">
        <section className="mb-12 text-center">
          <div className="shield-logo mx-auto mb-6 w-20 h-20 flex items-center justify-center">
            <Shield className="w-16 h-16 text-neon-cyan" />
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 animate-float">
            <span className="neon-text">ReputeX AI</span>
          </h1>
          
          <p className="tagline max-w-2xl mx-auto">
            Web3's Multi-Chain AI-Powered Reputation Shield – Detect Scams & Invest Fearlessly Across All Major Blockchains.
          </p>
          
          <AddressInput onSubmit={handleSubmit} isLoading={isLoading || isAutoDetecting} />
        </section>
        
        <section className="container mx-auto">
          {(isLoading || isAutoDetecting) && <LoadingAnimation />}
          
          {!isLoading && !isAutoDetecting && analysis && searchedAddress && (
            <AnalysisReport
              address={searchedAddress}
              network={searchedNetwork || 'ethereum'}
              scores={{
                trust_score: analysis.trust_score,
                developer_score: analysis.developer_score,
                liquidity_score: analysis.liquidity_score,
                community_score: analysis.community_score,
                holder_distribution: analysis.holder_distribution,
                fraud_risk: analysis.fraud_risk,
                social_sentiment: analysis.social_sentiment,
                confidence_score: analysis.confidence_score,
              }}
              analysis={analysis.analysis}
              timestamp={analysis.timestamp}
              sentimentData={analysis.sentimentData}
              scamIndicators={analysis.scamIndicators}
            />
          )}
          
          {!isLoading && !isAutoDetecting && !analysis && (
            <div className="max-w-4xl mx-auto mt-10">
              <div className="glowing-card rounded-xl p-8 text-center">
                <h3 className="text-2xl font-semibold mb-4">Enter an address to analyze</h3>
                <p className="text-muted-foreground">
                  Get comprehensive reputation scores, security analysis, and AI fraud detection for any blockchain wallet or token address across 12 major blockchains.
                </p>
              </div>
            </div>
          )}
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
