import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useIntuition } from '@/context/IntuitionContext'
import { toast } from 'react-hot-toast'

export function useCreateAtom() {
    const { sdk, writeConfig } = useIntuition()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({ name, description }: { name: string; description?: string }) => {
            if (!writeConfig) {
                throw new Error('Wallet not connected or invalid configuration')
            }
            if (description) {
                return sdk.createAtomFromThing(writeConfig, {
                    name,
                    description,
                })
            }
            return sdk.createAtomFromString(writeConfig, name as `${string}`)
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['GlobalSearch'] })
        },
        onError: (error: any) => {
            console.error('Error creating atom:', error)
            toast.error(`Failed to create atom: ${error.message || 'Unknown error'}`)
        },
    })
}
