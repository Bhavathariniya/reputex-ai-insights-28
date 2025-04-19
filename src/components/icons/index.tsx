
import React from 'react';

const iconStyle = { width: '100%', height: '100%', objectFit: 'contain' as const };

const BitcoinIcon = () => (
  <img 
    src="https://cryptologos.cc/logos/bitcoin-btc-logo.svg" 
    alt="Bitcoin" 
    style={iconStyle} 
  />
);

const L1XIcon = () => (
  <img 
    src="https://s2.coinmarketcap.com/static/img/coins/64x64/27331.png" 
    alt="L1X" 
    style={iconStyle} 
  />
);

const EthereumIcon = () => (
  <img 
    src="https://cryptologos.cc/logos/ethereum-eth-logo.svg" 
    alt="Ethereum" 
    style={iconStyle} 
  />
);

const BNBChainIcon = () => (
  <img 
    src="https://cryptologos.cc/logos/bnb-bnb-logo.svg" 
    alt="BNB Chain" 
    style={iconStyle} 
  />
);

const PolygonIcon = () => (
  <img 
    src="https://cryptologos.cc/logos/polygon-matic-logo.svg" 
    alt="Polygon" 
    style={iconStyle} 
  />
);

const ArbitrumIcon = () => (
  <img 
    src="https://cryptologos.cc/logos/arbitrum-arb-logo.svg" 
    alt="Arbitrum" 
    style={iconStyle} 
  />
);

const OptimismIcon = () => (
  <img 
    src="https://cryptologos.cc/logos/optimism-op-logo.svg" 
    alt="Optimism" 
    style={iconStyle} 
  />
);

const SolanaIcon = () => (
  <img 
    src="https://cryptologos.cc/logos/solana-sol-logo.svg" 
    alt="Solana" 
    style={iconStyle} 
  />
);

const AvalancheIcon = () => (
  <img 
    src="https://cryptologos.cc/logos/avalanche-avax-logo.svg" 
    alt="Avalanche" 
    style={iconStyle} 
  />
);

const FantomIcon = () => (
  <img 
    src="https://cryptologos.cc/logos/fantom-ftm-logo.svg" 
    alt="Fantom" 
    style={iconStyle} 
  />
);

const BaseIcon = () => (
  <img 
    src="https://cryptologos.cc/logos/base-base-logo.svg" 
    alt="Base" 
    style={iconStyle} 
  />
);

const ZkSyncIcon = () => (
  <img 
    src="https://cryptologos.cc/logos/zksync-zksync-logo.svg" 
    alt="zkSync" 
    style={iconStyle} 
  />
);

export {
  BitcoinIcon,
  L1XIcon,
  EthereumIcon,
  BNBChainIcon,
  PolygonIcon,
  ArbitrumIcon,
  OptimismIcon,
  SolanaIcon,
  AvalancheIcon,
  FantomIcon,
  BaseIcon,
  ZkSyncIcon,
};
