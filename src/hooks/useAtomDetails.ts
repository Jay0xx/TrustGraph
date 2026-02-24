import { useMemo } from 'react'
import { useGetAtomDetailsQuery } from '@0xintuition/graphql'
import { useIntuition } from '@/context/IntuitionContext'
import { useAccount } from 'wagmi'

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

export function useAtomDetails(atomId: string) {
    const { address } = useAccount()

    const { data, isLoading, error, refetch } = useGetAtomDetailsQuery(
        {
            id: atomId,
            userPositionAddress: address ?? ZERO_ADDRESS,
        },
        {
            enabled: !!atomId,
        }
    )

    const atom = useMemo(() => {
        return data?.atom
    }, [data])

    return {
        atom,
        isLoading,
        error,
        refetch,
    }
}
