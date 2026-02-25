'use client'

import { useState, useMemo } from 'react'
import { useGlobalSearchQuery } from '@0xintuition/graphql'
import { useDebounce } from '@/hooks/useDebounce'

export interface SearchedAtom {
    id: string
    label: string
    description: string
    emoji?: string
    type?: string
}

export function useAtomSearch(query: string) {
    const debouncedQuery = useDebounce(query, 300)

    const { data, isLoading, error } = useGlobalSearchQuery(
        {
            likeStr: debouncedQuery ? `%${debouncedQuery}%` : undefined,
            atomsLimit: 15,
        },
        {
            enabled: !!debouncedQuery && debouncedQuery.length > 1,
        }
    )

    const atoms = useMemo((): SearchedAtom[] => {
        return (data?.atoms || []).map((atom: any) => ({
            id: atom.term_id,
            label:
                atom.label ||
                atom.value?.thing?.name ||
                atom.value?.person?.name ||
                atom.value?.organization?.name ||
                'Unnamed Atom',
            description:
                atom.value?.thing?.description ||
                atom.value?.person?.description ||
                atom.value?.organization?.description ||
                (atom.data && !atom.data.startsWith('ipfs://') ? atom.data : '') ||
                'No description',
            emoji: atom.emoji || undefined,
            type: atom.type || undefined,
        }))
    }, [data])

    return {
        atoms,
        isLoading: !!debouncedQuery && debouncedQuery.length > 1 && isLoading,
        error,
    }
}
