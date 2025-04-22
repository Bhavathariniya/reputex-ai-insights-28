import { Alchemy, Network, AssetTransfersCategory, fromHex } from 'alchemy-sdk';

const ALCHEMY_CONFIG = {
  apiKey: 'pYRNPV2ZKbpraqzkqwIzEWp3osFe_LW4',
  network: Network.ETH_MAINNET,
};

const alchemy = new Alchemy(ALCHEMY_CONFIG);

interface TokenBalance {
  contractAddress: string;
  tokenBalance: string;
  error: string | null;
}

interface TokenBalancesResponse {
  address: string;
  tokenBalances: TokenBalance[];
}

interface TokenMetadata {
  name: string;
  symbol: string;
  totalSupply: string;
  decimals: number;
  logo?: string;
}

interface ContractData {
  isVerified: boolean;
  creatorAddress?: string;
  creationTime?: string;
  bytecode?: string;
  isLiquidityLocked?: boolean;
  hasTransferLimits?: boolean;
  hasTax?: boolean;
  ownerFunctions?: string[];
}

interface TokenTransferAnalysis {
  uniqueSenders: number;
  uniqueReceivers: number;
  topSenders: Array<{ address: string; count: number }>;
  topReceivers: Array<{ address: string; count: number }>;
  suspiciousAddresses: number;
  sybilRiskScore: number;
  totalTransfers: number;
  averageTransferAmount: string;
  transferPeriods: Array<{ timeframe: string; count: number }>;
}

export async function getAddressBalance(address: string, network: string): Promise<string> {
  try {
    const balance = await alchemy.core.getBalance(address);
    return balance.toString();
  } catch (error) {
    console.error('Error fetching balance:', error);
    throw error;
  }
}

export async function detectNetwork(address: string): Promise<string> {
  try {
    const balance = await alchemy.core.getBalance(address);
    return balance.gt(0) ? 'ethereum' : 'ethereum'; // Default to ethereum for now
  } catch (error) {
    console.error('Error detecting network:', error);
    return 'ethereum';
  }
}

export async function validateAddress(address: string): Promise<boolean> {
  if (!address) return false;
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

export async function getTokenBalances(address: string): Promise<TokenBalancesResponse> {
  try {
    const balances = await alchemy.core.getTokenBalances(address, ['erc20']);
    return {
      address: balances.address,
      tokenBalances: balances.tokenBalances.map(balance => ({
        contractAddress: balance.contractAddress,
        tokenBalance: balance.tokenBalance,
        error: balance.error
      }))
    };
  } catch (error) {
    console.error('Error fetching token balances:', error);
    throw error;
  }
}

export async function getTokenAllowance(
  contractAddress: string,
  ownerAddress: string,
  spenderAddress: string
): Promise<string> {
  try {
    // Since getProvider returns a Promise, we need to await it first
    const provider = await alchemy.config.getProvider();
    const response = await provider.send("alchemy_getTokenAllowance", [{
      contract: contractAddress,
      owner: ownerAddress,
      spender: spenderAddress
    }]);
    
    return response || '0';
  } catch (error) {
    console.error('Error fetching token allowance:', error);
    throw error;
  }
}

export async function getTokenMetadata(address: string): Promise<TokenMetadata> {
  try {
    const alchemyMetadata = await alchemy.core.getTokenMetadata(address);
    
    // Get token balance to estimate total supply if not available
    const balances = await alchemy.core.getTokenBalances(address, [address]);
    const balance = balances.tokenBalances[0]?.tokenBalance || '0';
    
    return {
      name: alchemyMetadata.name || 'Unknown Token',
      symbol: alchemyMetadata.symbol || 'UNKNOWN',
      totalSupply: balance.toString(),
      decimals: alchemyMetadata.decimals || 18,
      logo: alchemyMetadata.logo || undefined
    };
  } catch (error) {
    console.error('Error fetching token metadata:', error);
    return {
      name: 'Unknown Token',
      symbol: 'UNKNOWN',
      totalSupply: '0',
      decimals: 18
    };
  }
}

export async function getContractData(address: string): Promise<ContractData> {
  try {
    // Get contract metadata from Alchemy
    const provider = await alchemy.config.getProvider();
    
    // Try to get contract bytecode
    const bytecode = await provider.getCode(address);
    const isContract = bytecode && bytecode !== '0x';
    
    if (!isContract) {
      return { isVerified: false };
    }
    
    // Call Etherscan API to check if contract is verified
    // For demo, we'll simulate this as we don't have Etherscan key integration yet
    const isVerified = bytecode.length > 100;
    
    // Get contract creation info
    let creatorAddress;
    let creationTime;
    
    try {
      // Get the earliest transaction involving this address
      const transfers = await alchemy.core.getAssetTransfers({
        toAddress: address,
        category: [AssetTransfersCategory.ERC20],
        // Order parameter omitted as it's causing type errors
        maxCount: 1,
        withMetadata: true
      });
      
      if (transfers.transfers.length > 0) {
        const firstTransfer = transfers.transfers[0];
        creatorAddress = firstTransfer.from;
        creationTime = new Date(firstTransfer.metadata.blockTimestamp).toISOString();
      }
    } catch (error) {
      console.error('Error getting contract creation info:', error);
    }
    
    // Check for common risky functions in ERC20 tokens
    // This is simulated since we'd need to parse ABI which is complex
    const hasTransferLimits = Math.random() > 0.7;
    const hasTax = Math.random() > 0.8;
    const isLiquidityLocked = Math.random() > 0.5;
    
    return {
      isVerified,
      creatorAddress,
      creationTime,
      bytecode,
      isLiquidityLocked,
      hasTransferLimits,
      hasTax,
      ownerFunctions: hasTransferLimits ? ['setMaxTxAmount', 'excludeFromFee'] : []
    };
  } catch (error) {
    console.error('Error analyzing contract:', error);
    return { isVerified: false };
  }
}

export async function analyzeTokenTransfers(address: string): Promise<TokenTransferAnalysis> {
  try {
    // Get token transfers
    const transfers = await alchemy.core.getAssetTransfers({
      fromAddress: address,
      category: [AssetTransfersCategory.ERC20],
      maxCount: 100,
      withMetadata: true
    });
    
    const receiverTransfers = await alchemy.core.getAssetTransfers({
      toAddress: address,
      category: [AssetTransfersCategory.ERC20],
      maxCount: 100,
      withMetadata: true
    });
    
    // Combine all transfers
    const allTransfers = [...transfers.transfers, ...receiverTransfers.transfers];
    
    // Extract unique senders and receivers
    const senders = new Set();
    const receivers = new Set();
    const senderCounts = new Map();
    const receiverCounts = new Map();
    
    allTransfers.forEach(transfer => {
      if (transfer.from) {
        senders.add(transfer.from);
        senderCounts.set(transfer.from, (senderCounts.get(transfer.from) || 0) + 1);
      }
      
      if (transfer.to) {
        receivers.add(transfer.to);
        receiverCounts.set(transfer.to, (receiverCounts.get(transfer.to) || 0) + 1);
      }
    });
    
    // Calculate average transfer value
    const averageValue = allTransfers.reduce((sum, transfer) => {
      const value = transfer.value || 0;
      return sum + value;
    }, 0) / (allTransfers.length || 1);
    
    // Get top senders
    const topSenders = [...senderCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([address, count]) => ({ address, count }));
    
    // Get top receivers
    const topReceivers = [...receiverCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([address, count]) => ({ address, count }));
    
    // Detect suspicious addresses (simplified algorithm)
    const suspiciousAddresses = [...senderCounts.entries(), ...receiverCounts.entries()]
      .filter(([_, count]) => count > 20) // High frequency activity
      .length;
    
    // Calculate Sybil risk score (0-100)
    const maxReceiverConcentration = Math.max(...receiverCounts.values()) / receivers.size;
    const maxSenderConcentration = Math.max(...senderCounts.values()) / senders.size;
    const sybilRiskScore = Math.min(
      100,
      Math.round(
        (suspiciousAddresses * 10) +
        (maxReceiverConcentration * 50) +
        (maxSenderConcentration * 50)
      )
    );
    
    // Group transfers by time periods
    const transferPeriods = [
      { timeframe: "Last 24h", count: 0 },
      { timeframe: "Last week", count: 0 },
      { timeframe: "Last month", count: 0 }
    ];
    
    const now = new Date();
    const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    allTransfers.forEach(transfer => {
      const txTime = new Date(transfer.metadata.blockTimestamp);
      if (txTime >= dayAgo) {
        transferPeriods[0].count++;
      }
      if (txTime >= weekAgo) {
        transferPeriods[1].count++;
      }
      if (txTime >= monthAgo) {
        transferPeriods[2].count++;
      }
    });
    
    return {
      uniqueSenders: senders.size,
      uniqueReceivers: receivers.size,
      topSenders,
      topReceivers,
      suspiciousAddresses,
      sybilRiskScore,
      totalTransfers: allTransfers.length,
      averageTransferAmount: averageValue.toFixed(6),
      transferPeriods
    };
  } catch (error) {
    console.error('Error analyzing token transfers:', error);
    
    return {
      uniqueSenders: 0,
      uniqueReceivers: 0,
      topSenders: [],
      topReceivers: [],
      suspiciousAddresses: 0,
      sybilRiskScore: 0,
      totalTransfers: 0,
      averageTransferAmount: '0',
      transferPeriods: []
    };
  }
}

export async function checkHoneypotRisk(address: string): Promise<{
  isHoneypot: boolean;
  riskLevel: string;
  indicators: string[];
}> {
  try {
    // This would typically involve simulating transactions
    // But for demo purposes, we're returning mock data
    const riskLevel = Math.random() > 0.8 ? "High" : Math.random() > 0.5 ? "Medium" : "Low";
    const isHoneypot = riskLevel === "High";
    
    const indicators = [];
    if (riskLevel === "High") {
      indicators.push("Sell transactions consistently fail");
      indicators.push("Contract contains unusual transfer limits");
    } else if (riskLevel === "Medium") {
      indicators.push("High transaction fees observed");
    }
    
    return {
      isHoneypot,
      riskLevel,
      indicators
    };
  } catch (error) {
    console.error('Error checking honeypot risk:', error);
    return {
      isHoneypot: false,
      riskLevel: "Unknown",
      indicators: ["Analysis failed"]
    };
  }
}
