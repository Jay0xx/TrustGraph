import { useMemo } from 'react'
import { useGetAtomQuery } from '@0xintuition/graphql'

export function useAtomDetails(atomId: string) {
    const { data, isLoading, error, refetch } = useGetAtomQuery(
        {
            id: atomId || '',
        },
        {
            enabled: !!atomId && atomId.length > 5,
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
