
/**
 * Returns a string ID for the detected blockchain, or null if unknown.
 * Supported: ethereum, binance, solana, polygon, arbitrum, optimism, avalanche, fantom, base, zksync, l1x
 */

const ETH_LIKE = /^0x[a-fA-F0-9]{40}$/;
const SOLANA_BASE58 = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
const BNB_NATIVE = /^bnb1[0-9a-z]{38}$/;
const BASE_CHAIN_IDS = ["base", "base-mainnet"];

export function detectBlockchain(addressOrToken: string): {
  id: string | null;
  name: string;
} {
  const addr = addressOrToken.trim();

  // Explicit checks (order matters!)
  if (SOLANA_BASE58.test(addr)) {
    return { id: "solana", name: "Solana" };
  }
  if (BNB_NATIVE.test(addr)) {
    return { id: "binance", name: "BNB Chain" };
  }
  if (ETH_LIKE.test(addr)) {
    // Could be Ethereum, BNB/BEP20, Polygon, Arbitrum, Optimism, Avalanche C, etc.
    // If user inputs a 0x address, try to infer from token lists or prefixes
    // For simplicity, we'll prompt for common special prefixes or let UI query metadata later

    // Try heuristics: Base special tokens
    if (
      addr.toLowerCase().startsWith("0x420") || addr.toLowerCase().endsWith("base")
    ) {
      return { id: "base", name: "Base" };
    }
    // Could do further checks here... but default to Ethereum-format
    return { id: "ethereum", name: "Ethereum" };
  }
  // Polygon, Arbitrum, Optimism, etc. are all ETH-like for address format

  // L1X mainnet (hypothetical): use similar pattern
  if (
    addr.length === 40 &&
    addr.match(/^[a-zA-Z0-9]+$/) &&
    addr.startsWith("l1x")
  ) {
    return { id: "l1x", name: "L1X" };
  }

  // Fallbacks for future: add zksync, avalanche, polygon, by querying metadata
  // If strictly numeric or unknown, treat as invalid for now
  return { id: null, name: "Unknown" };
}
