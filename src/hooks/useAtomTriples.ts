import { useMemo } from 'react'
import { useGetTriplesWithPositionsQuery } from '@0xintuition/graphql'

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

export function useAtomTriples(atomId: string) {
    const { data, isLoading, error, refetch } = useGetTriplesWithPositionsQuery(
        {
            where: { subject_id: { _eq: atomId } },
            limit: 50,
            address: ZERO_ADDRESS, // Required by _ilike filter; prevents null errors
        },
        {
            enabled: !!atomId && atomId.length > 0,
        }
    )

    const triples = useMemo(() => {
        const items = (data?.triples || []).map((t: any) => {
            const vault = t.term?.vaults?.[0]
            const totalShares = vault?.total_shares || '0'
            const positions = vault?.positions || []

            return {
                id: t.term_id,
                subject: {
                    id: t.subject?.term_id,
                    label: t.subject?.label,
                },
                predicate: {
                    id: t.predicate?.term_id,
                    label: t.predicate?.label,
                },
                object: {
                    id: t.object?.term_id,
                    label: t.object?.label,
                },
                trustSignal: Number(totalShares) / 1e18,
                attestersCount: vault?.position_count || 0,
                provenance: positions.map((p: any) => ({
                    account: p.account?.id,
                    label: p.account?.label,
                    shares: Number(p.shares) / 1e18,
                }))
            }
        })

        // Sort by trust signal descending
        return items.sort((a, b) => b.trustSignal - a.trustSignal)
    }, [data])

    return {
        triples,
        isLoading,
        error,
        refetch,
    }
}
