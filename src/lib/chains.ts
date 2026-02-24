import { type Chain } from 'viem'

export const intuitionTestnet = {
  id: 13579,
  name: 'Intuition Testnet',
  nativeCurrency: { name: 'TRUST', symbol: 'TRUST', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://testnet.rpc.intuition.systems/http'] },
  },
  blockExplorers: {
    default: { name: 'Blockscout', url: 'https://testnet.explorer.intuition.systems' },
  },
  testnet: true,
} as const satisfies Chain

/* export const intuitionMainnet = {
  id: 1155,
  name: 'Intuition',
  nativeCurrency: { name: 'TRUST', symbol: 'TRUST', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://rpc.intuition.systems/http'] },
  },
  blockExplorers: {
    default: { name: 'Blockscout', url: 'https://explorer.intuition.systems' },
  },
  testnet: false,
} as const satisfies Chain */
