
import axios from 'axios';
import { TokenData } from './types';

const ETHERSCAN_API_KEY = 'VZFDUWB3YGQ1YCDKTCU1D6DDSS';
const ETHERSCAN_API_URL = 'https://api.etherscan.io/api';

export interface EtherscanTokenInfoResponse {
  status: string;
  message: string;
  result: Array<{
    contractAddress: string;
    tokenName?: string;
    symbol?: string;
    divisor?: string;
    tokenType?: string;
    totalSupply?: string;
    blueCheckmark?: string;
    description?: string;
    website?: string;
    email?: string;
    blog?: string;
    reddit?: string;
    slack?: string;
    facebook?: string;
    twitter?: string;
    bitcointalk?: string;
    github?: string;
    telegram?: string;
    wechat?: string;
    linkedin?: string;
    discord?: string;
    whitepaper?: string;
  }>;
}

export interface EtherscanSourceCodeResponse {
  status: string;
  message: string;
  result: Array<{
    SourceCode: string;
    ABI: string;
    ContractName: string;
    CompilerVersion: string;
    OptimizationUsed: string;
    Runs: string;
    ConstructorArguments: string;
    EVMVersion: string;
    Library: string;
    LicenseType: string;
    Proxy: string;
    Implementation: string;
    SwarmSource: string;
    ContractCreationCode?: string;
    ContractCreator?: string;
    DeployedTimestamp?: string;
  }>;
}

export interface EtherscanTxListResponse {
  status: string;
  message: string;
  result: Array<{
    blockNumber: string;
    timeStamp: string;
    hash: string;
    from: string;
    to: string;
    value: string;
    contractAddress: string;
    input: string;
    gasUsed: string;
    confirmations: string;
  }>;
}

export const getTokenInfo = async (address: string): Promise<TokenData | null> => {
  try {
    // Fetch token info
    const tokenInfoResponse = await axios.get<EtherscanTokenInfoResponse>(
      `${ETHERSCAN_API_URL}?module=token&action=tokeninfo&contractaddress=${address}&apikey=${ETHERSCAN_API_KEY}`
    );

    // Fetch contract source code (for verified status, creation time, etc.)
    const sourceCodeResponse = await axios.get<EtherscanSourceCodeResponse>(
      `${ETHERSCAN_API_URL}?module=contract&action=getsourcecode&address=${address}&apikey=${ETHERSCAN_API_KEY}`
    );

    // Fetch token transactions to estimate holder count
    const txListResponse = await axios.get<EtherscanTxListResponse>(
      `${ETHERSCAN_API_URL}?module=account&action=tokentx&address=${address}&startblock=0&endblock=999999999&sort=asc&apikey=${ETHERSCAN_API_KEY}`
    );

    // Check if responses are valid
    if (
      tokenInfoResponse.data.status !== '1' || 
      sourceCodeResponse.data.status !== '1' ||
      txListResponse.data.status !== '1'
    ) {
      console.error('Error fetching token data from Etherscan:', {
        tokenInfo: tokenInfoResponse.data.message,
        sourceCode: sourceCodeResponse.data.message,
        txList: txListResponse.data.message
      });
      return null;
    }

    // Extract token info
    const tokenInfo = tokenInfoResponse.data.result[0] || {};
    const sourceCode = sourceCodeResponse.data.result[0] || {};
    const txList = txListResponse.data.result || [];

    // Calculate unique holders (approximate by counting unique "to" addresses)
    const uniqueHolders = new Set<string>();
    txList.forEach(tx => {
      if (tx.to) uniqueHolders.add(tx.to.toLowerCase());
    });

    // Check if liquidity is locked by looking for "lock" in source code (simplified)
    const isLiquidityLocked = sourceCode.SourceCode 
      ? sourceCode.SourceCode.toLowerCase().includes('liquidity') && sourceCode.SourceCode.toLowerCase().includes('lock')
      : false;

    return {
      tokenName: tokenInfo.tokenName || 'Unknown Token',
      tokenSymbol: tokenInfo.symbol || 'UNKNOWN',
      totalSupply: tokenInfo.totalSupply || '0',
      holderCount: uniqueHolders.size || 0,
      isLiquidityLocked,
      decimals: parseInt(tokenInfo.divisor || '18', 10),
      creationTime: sourceCode.DeployedTimestamp,
      contractCreator: sourceCode.ContractCreator,
      isVerified: sourceCode.SourceCode !== '' && sourceCode.SourceCode !== null,
      compilerVersion: sourceCode.CompilerVersion
    };
  } catch (error) {
    console.error('Error fetching token data from Etherscan:', error);
    return null;
  }
};

export const getContractSourceCode = async (address: string): Promise<string | null> => {
  try {
    const response = await axios.get<EtherscanSourceCodeResponse>(
      `${ETHERSCAN_API_URL}?module=contract&action=getsourcecode&address=${address}&apikey=${ETHERSCAN_API_KEY}`
    );

    if (response.data.status !== '1' || !response.data.result.length) {
      return null;
    }

    return response.data.result[0].SourceCode;
  } catch (error) {
    console.error('Error fetching contract source code:', error);
    return null;
  }
};

export const checkForRiskyFunctions = (sourceCode: string): Array<{term: string; found: boolean; risk: string}> => {
  const riskyFunctions = [
    {
      term: 'mint', 
      risk: 'Token supply can be increased arbitrarily'
    },
    {
      term: 'excludeFromFee', 
      risk: 'Certain addresses can be excluded from fees'
    },
    {
      term: 'setFee', 
      risk: 'Fees can be changed after deployment'
    },
    {
      term: 'setMaxTxAmount', 
      risk: 'Transaction limits can be changed'
    },
    {
      term: 'transferOwnership', 
      risk: 'Ownership can be transferred'
    },
    {
      term: 'blacklist', 
      risk: 'Addresses can be blacklisted from trading'
    }
  ];

  return riskyFunctions.map(func => ({
    ...func,
    found: sourceCode.toLowerCase().includes(func.term.toLowerCase())
  }));
};

export const checkOwnershipRenounced = (sourceCode: string, txList: any[]): boolean => {
  // Check if ownership has been renounced by looking for renounceOwnership function calls
  // This is a simplified approach
  const renounceOwnershipTxs = txList.filter(tx => 
    tx.input && tx.input.toLowerCase().includes('79ba5097') // renounceOwnership function signature
  );
  
  // Also check if the source code indicates ownership has been renounced
  const ownershipRenounced = sourceCode.toLowerCase().includes('ownrenounced') || 
                            sourceCode.toLowerCase().includes('renounceownership');
  
  return renounceOwnershipTxs.length > 0 || ownershipRenounced;
};
