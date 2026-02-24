'use client'

import React, { createContext, useContext, useMemo } from 'react'
import { GraphQLClient } from 'graphql-request'
import { usePublicClient, useWalletClient, useChainId } from 'wagmi'
import { configureClient } from '@0xintuition/graphql'
import { getMultiVaultAddressFromChainId } from '@0xintuition/protocol'
import * as sdk from '@0xintuition/sdk'

configureClient({
    apiUrl: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || 'https://api.intuition.systems/graphql',
})

interface IntuitionContextType {
    graphqlClient: GraphQLClient
    sdk: typeof sdk
    multivaultAddress: `0x${string}` | undefined
    writeConfig: sdk.WriteConfig | undefined
}

const IntuitionContext = createContext<IntuitionContextType | null>(null)

export const IntuitionProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const chainId = useChainId()
    const publicClient = usePublicClient()
    const { data: walletClient } = useWalletClient()

    const graphqlClient = useMemo(() => {
        return new GraphQLClient(
            process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT ||
            'https://api.intuition.systems/graphql',
            {
                headers: {
                    Authorization: `Bearer ${process.env.NEXT_PUBLIC_GRAPHQL_TOKEN || ''}`,
                },
            }
        )
    }, [])

    const multivaultAddress = useMemo(() => {
        try {
            return getMultiVaultAddressFromChainId(chainId)
        } catch (e) {
            console.error('Failed to get multivault address for chain:', chainId)
            return undefined
        }
    }, [chainId])

    const writeConfig = useMemo(() => {
        if (!multivaultAddress || !walletClient || !publicClient) {
            return undefined
        }
        return {
            address: multivaultAddress,
            walletClient,
            publicClient,
        } as sdk.WriteConfig
    }, [multivaultAddress, walletClient, publicClient])

    const value = useMemo(
        () => ({
            graphqlClient,
            sdk,
            multivaultAddress,
            writeConfig,
        }),
        [graphqlClient, multivaultAddress, writeConfig]
    )

    return (
        <IntuitionContext.Provider value={value}>
            {children}
        </IntuitionContext.Provider>
    )
}

export const useIntuition = () => {
    const context = useContext(IntuitionContext)
    if (!context) {
        throw new Error('useIntuition must be used within an IntuitionProvider')
    }
    return context
}
