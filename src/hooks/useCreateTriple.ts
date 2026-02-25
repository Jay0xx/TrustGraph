import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useIntuition } from '@/context/IntuitionContext'
import { toast } from 'react-hot-toast'
import { parseEther, formatEther } from 'viem'
import { multiVaultGetTripleCost, multiVaultCreateTriples } from '@0xintuition/protocol'

interface CreateTripleData {
    subjectId: `0x${string}`
    predicateId: `0x${string}`
    objectId: `0x${string}`
    initialDeposit?: string // in ETH
}

/**
 * Hook to fetch the on-chain triple creation cost.
 * Returns the base cost in wei and formatted ETH.
 */
export function useTripleCost() {
    const { multivaultAddress, writeConfig } = useIntuition()

    return useQuery({
        queryKey: ['tripleCost', multivaultAddress],
        queryFn: async () => {
            if (!writeConfig || !multivaultAddress) {
                throw new Error('Wallet not connected')
            }
            const cost = await multiVaultGetTripleCost({
                publicClient: writeConfig.publicClient,
                address: multivaultAddress,
            })
            return {
                raw: cost as bigint,
                formatted: formatEther(cost as bigint),
            }
        },
        enabled: !!writeConfig && !!multivaultAddress,
        staleTime: 60_000, // cache for 1 minute
        retry: 2,
    })
}

/**
 * Hook to create a triple on-chain with proper cost estimation.
 * Fixes the previous bug where value: 0n was sent (protocol requires triple cost).
 */
export function useCreateTriple() {
    const { writeConfig, multivaultAddress } = useIntuition()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({ subjectId, predicateId, objectId, initialDeposit }: CreateTripleData) => {
            if (!writeConfig || !multivaultAddress) {
                throw new Error('Wallet not connected. Please connect your wallet first.')
            }

            if (!writeConfig.walletClient.account) {
                throw new Error('No account found. Please reconnect your wallet.')
            }

            // 1. Fetch the on-chain triple cost
            const tripleCost = await multiVaultGetTripleCost({
                publicClient: writeConfig.publicClient,
                address: multivaultAddress,
            }) as bigint

            // 2. Calculate total value: tripleCost + optional deposit
            const depositAmount = initialDeposit ? parseEther(initialDeposit) : 0n
            const totalValue = tripleCost + depositAmount

            // 3. Check user balance  
            const balance = await writeConfig.publicClient.getBalance({
                address: writeConfig.walletClient.account.address,
            })

            if (balance < totalValue) {
                const needed = formatEther(totalValue)
                const available = formatEther(balance)
                throw new Error(
                    `Insufficient funds. Need ${needed} ETH but only have ${available} ETH.`
                )
            }

            // 4. Create triple via low-level protocol function
            //    Args format: [subjectIds[], predicateIds[], objectIds[], assets[]]
            const txHash = await multiVaultCreateTriples(writeConfig, {
                args: [
                    [subjectId],
                    [predicateId],
                    [objectId],
                    [totalValue],
                ],
                value: totalValue,
            })

            if (!txHash) {
                throw new Error('Transaction failed — no hash returned.')
            }

            return txHash
        },
        onSuccess: () => {
            toast.success('Triple created successfully! 🎉')
            queryClient.invalidateQueries({ queryKey: ['GetTriplesWithPositions'] })
            queryClient.invalidateQueries({ queryKey: ['GlobalSearch'] })
            queryClient.invalidateQueries({ queryKey: ['GetAtom'] })
        },
        onError: (error: any) => {
            console.error('Error creating triple:', error)

            const message = String(error?.message || error || 'Unknown error')

            // Parse common contract/wallet errors into friendly messages
            if (message.includes('Insufficient funds') || message.includes('insufficient')) {
                toast.error('Insufficient funds. You need more ETH to create this triple.')
            } else if (message.includes('User rejected') || message.includes('user rejected') || message.includes('denied')) {
                toast.error('Transaction cancelled by user.')
            } else if (message.includes('already exists') || message.includes('AlreadyExists')) {
                toast.error('This triple already exists! You can endorse it instead.')
            } else if (message.includes('TermDoesNotExist') || message.includes('not found')) {
                toast.error('One or more Atom IDs do not exist on-chain. Please verify your selections.')
            } else if (message.includes('execution reverted')) {
                toast.error('Transaction reverted. The atoms may not exist or there may be a protocol issue.')
            } else if (message.includes('Wallet not connected') || message.includes('No account')) {
                toast.error('Please connect your wallet first.')
            } else {
                toast.error(`Failed to create triple: ${message.slice(0, 120)}`)
            }
        },
    })
}
