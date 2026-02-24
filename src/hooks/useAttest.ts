import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useIntuition } from '@/context/IntuitionContext'
import { toast } from 'react-hot-toast'
import { parseEther } from 'viem'
import { multiVaultDeposit } from '@0xintuition/protocol'

interface AttestData {
    id: `0x${string}`
    amount: string // in ETH/TRUST
}

export function useAttest() {
    const { writeConfig } = useIntuition()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({ id, amount }: AttestData) => {
            if (!writeConfig || !writeConfig.walletClient.account) {
                throw new Error('Wallet not connected or invalid configuration')
            }
            const value = parseEther(amount)
            const txHash = await multiVaultDeposit(writeConfig, {
                args: [writeConfig.walletClient.account.address, id, 1n, 0n],
                value,
            })
            if (!txHash) {
                throw new Error('Deposit transaction failed')
            }
            return txHash
        },
        onSuccess: () => {
            toast.success('Attestation successful!')
            queryClient.invalidateQueries({ queryKey: ['GetAtom'] })
            queryClient.invalidateQueries({ queryKey: ['GetTriplesWithPositions'] })
        },
        onError: (error: any) => {
            console.error('Error attesting:', error)
            toast.error(`Failed to attest: ${error.message || 'Unknown error'}`)
        },
    })
}
