import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { http } from 'wagmi'
import { intuitionTestnet } from './chains'

export const config = getDefaultConfig({
    appName: 'TrustGraph',
    projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '1cca018b214902a7ef824a737e4fb376', // Default or Env
    chains: [intuitionTestnet],
    transports: {
        [intuitionTestnet.id]: http(process.env.NEXT_PUBLIC_TESTNET_RPC_URL || 'https://testnet.rpc.intuition.systems/http'),
    },
    ssr: true,
})
