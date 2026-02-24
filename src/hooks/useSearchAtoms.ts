import { useMemo } from 'react'
import { useGlobalSearchQuery } from '@0xintuition/graphql'
import { useIntuition } from '@/context/IntuitionContext'

export function useSearchAtoms(query: string) {
    const { data, isLoading, error, refetch } = useGlobalSearchQuery(
        {
            likeStr: query ? `%${query}%` : undefined,
            atomsLimit: 20,
        },
        {
            enabled: !!query && query.length > 2,
        }
    )

    const atoms = useMemo(() => {
        return (data?.atoms || []).map((atom: any) => ({
            id: atom.term_id,
            label: atom.label || atom.value?.thing?.name || atom.value?.person?.name || atom.value?.organization?.name || 'Unnamed Atom',
            description: atom.data || atom.value?.thing?.description || atom.value?.person?.description || atom.value?.organization?.description || 'No description available.',
            triplesCount: (atom as any).term?.vaults?.reduce((acc: number, v: any) => acc + (v.position_count || 0), 0) || 0,
        }))
    }, [data])

    return {
        atoms,
        isLoading,
        error,
        refetch,
    }
}
