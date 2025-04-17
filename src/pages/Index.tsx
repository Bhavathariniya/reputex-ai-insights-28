import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LandingPage from '@/components/LandingPage';
import LoadingAnimation from '@/components/LoadingAnimation';
import AnalysisReport from '@/components/AnalysisReport';
import AnalysisDashboard from '@/components/AnalysisDashboard';
import { toast } from 'sonner';
import { Volume2, VolumeX } from 'lucide-react';
import { isContract, detectBlockchain } from '@/lib/chain-detection';
import { getAggregatedAnalysis } from '@/lib/blockchain-api';

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<any | null>(null);
  const [searchedAddress, setSearchedAddress] = useState<string | null>(null);
  const [searchedNetwork, setSearchedNetwork] = useState<string>('ethereum');
  const [audioEnabled, setAudioEnabled] = useState<boolean>(false);
  const [addressType, setAddressType] = useState<'token' | 'wallet' | null>(null);
  const [isAutoDetecting, setIsAutoDetecting] = useState<boolean>(false);
  const [showDashboard, setShowDashboard] = useState<boolean>(false);
  const location = useLocation();
  const navigate = useNavigate();
  const analyzeRef = useRef<HTMLDivElement>(null);

  // Check for address in URL query params
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const addressParam = query.get('address');
    const networkParam = query.get('network') || 'ethereum';
    const viewParam = query.get('view') || 'report';
    
    if (addressParam) {
      setSearchedAddress(addressParam);
      setSearchedNetwork(networkParam);
      setShowDashboard(viewParam === 'dashboard');
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
      // Determine address type (token or wallet)
      const isContractAddress = await isContract(address, resolvedNetwork);
      setAddressType(isContractAddress ? 'token' : 'wallet');
      
      // Get aggregated analysis
      const aggregatedData = await getAggregatedAnalysis(address, resolvedNetwork);
      
      // Set the analysis data
      setAnalysis(aggregatedData);
      
      toast.success(`Analysis complete for ${resolvedNetwork} ${aggregatedData.addressType}`);
      
      // Scroll to the analysis section
      setTimeout(() => {
        analyzeRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 500);
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
    navigate(`/?address=${address}&network=${network}&view=${showDashboard ? 'dashboard' : 'report'}`);
  };

  const toggleView = () => {
    setShowDashboard(!showDashboard);
    if (searchedAddress) {
      navigate(`/?address=${searchedAddress}&network=${searchedNetwork}&view=${!showDashboard ? 'dashboard' : 'report'}`);
    }
  };

  const handleNetworkChange = (network: string) => {
    setSearchedNetwork(network);
    if (searchedAddress) {
      navigate(`/?address=${searchedAddress}&network=${network}&view=${showDashboard ? 'dashboard' : 'report'}`);
      handleAddressSearch(searchedAddress, network);
    }
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
      
      <main className="flex-grow pt-16 pb-16 relative z-10">
        {/* No analysis yet - show landing page */}
        {!analysis && !isLoading && !isAutoDetecting && (
          <LandingPage onAddressSubmit={handleSubmit} />
        )}
        
        {/* Loading state */}
        {(isLoading || isAutoDetecting) && (
          <div className="container mx-auto px-4 py-20 text-center">
            <LoadingAnimation />
          </div>
        )}
        
        {/* Analysis result */}
        <div ref={analyzeRef}>
          {!isLoading && !isAutoDetecting && analysis && searchedAddress && (
            <>
              {showDashboard ? (
                <AnalysisDashboard 
                  address={searchedAddress}
                  network={searchedNetwork} 
                  onNetworkChange={handleNetworkChange}
                />
              ) : (
                <AnalysisReport
                  address={searchedAddress}
                  network={searchedNetwork || 'ethereum'}
                />
              )}
            </>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
