import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useIntuition } from '@/context/IntuitionContext'
import { toast } from 'react-hot-toast'
import { parseEther } from 'viem'

interface AttestData {
    id: `0x${string}`
    amount: string // in ETH/TRUST
}

export function useAttest() {
    const { sdk, writeConfig } = useIntuition()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({ id, amount }: AttestData) => {
            if (!writeConfig || !writeConfig.walletClient.account) {
                throw new Error('Wallet not connected or invalid configuration')
            }
            const value = parseEther(amount)
            return sdk.multiVaultDeposit(writeConfig, {
                args: [writeConfig.walletClient.account.address, id, 1n, 0n],
                value,
            })
        },
        onSuccess: () => {
            toast.success('Attestation successful!')
            queryClient.invalidateQueries({ queryKey: ['GetAtomDetails'] })
            queryClient.invalidateQueries({ queryKey: ['GetTriples'] })
        },
        onError: (error: any) => {
            console.error('Error attesting:', error)
            toast.error(`Failed to attest: ${error.message || 'Unknown error'}`)
        },
    })
}
