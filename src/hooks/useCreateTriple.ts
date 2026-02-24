import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useIntuition } from '@/context/IntuitionContext'
import { toast } from 'react-hot-toast'

interface CreateTripleData {
    subjectId: `0x${string}`
    predicateId: `0x${string}`
    objectId: `0x${string}`
}

export function useCreateTriple() {
    const { sdk, writeConfig } = useIntuition()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({ subjectId, predicateId, objectId }: CreateTripleData) => {
            if (!writeConfig) {
                throw new Error('Wallet not connected or invalid configuration')
            }
            return sdk.createTripleStatement(writeConfig, {
                args: [[subjectId], [predicateId], [objectId], [0n]], // 0n for initial assets if not specifying
                value: 0n, // Total value to send
            })
        },
        onSuccess: () => {
            toast.success('Triple created successfully!')
            queryClient.invalidateQueries({ queryKey: ['GetTriples'] })
        },
        onError: (error: any) => {
            console.error('Error creating triple:', error)
            toast.error(`Failed to create triple: ${error.message || 'Unknown error'}`)
        },
    })
}
