'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import { useAtomDetails } from '@/hooks/useAtomDetails'
import { useAtomTriples } from '@/hooks/useAtomTriples'
import { TripleCard } from '@/components/TripleCard'
import { CreateTripleDialog } from '@/components/CreateTripleDialog'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import {
    ArrowLeft,
    User,
    Info,
    Network,
    Hash,
    Sparkles,
    Copy,
    ChevronRight,
    Home,
    AlertCircle
} from 'lucide-react'
import Link from 'next/link'
import { toast } from 'react-hot-toast'

import { FeedbackButton } from '@/components/FeedbackButton'

export default function AtomDetailPage() {
    const params = useParams()
    const atomId = params.atomId as string
    const { atom, isLoading: isAtomLoading, error: atomError } = useAtomDetails(atomId)
    const { triples, isLoading: isTriplesLoading, error: triplesError } = useAtomTriples(atomId)

    const isLoading = isAtomLoading || isTriplesLoading
    const error = atomError || triplesError

    const copyAISummary = () => {
        if (!atom || triples.length === 0) return

        const label = (atom as any).label || 'Unnamed Atom'
        const summary = `Verified facts about "${label}" (ID: ${atomId}):
${triples.slice(0, 10).map((t: any, i: number) => {
            const provenanceStr = t.provenance.length > 0
                ? ` (Endorsed by ${t.attestersCount} accounts)`
                : ' (Unendorsed)'
            return `${i + 1}. ${t.predicate.label || 'relates to'} ${t.object.label || 'unknown'} - Trust: ${t.trustSignal.toFixed(4)} $TRUST${provenanceStr}`
        }).join('\n')}

Source: TrustGraph / Intuition Protocol (Intuition Testnet Beta)`

        navigator.clipboard.writeText(summary)
        toast.success('Verifiable summary copied for AI!')
    }

    if (error) {
        return (
            <div className="container mx-auto py-20 px-4 max-w-2xl">
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error loading atom details</AlertTitle>
                    <AlertDescription>
                        {String((error as any)?.message || 'Atom not found or network error.')}
                    </AlertDescription>
                </Alert>
                <Button asChild variant="outline" className="mt-6 w-full">
                    <Link href="/">Back to Search</Link>
                </Button>
            </div>
        )
    }

    const atomLabel = (atom as any)?.label ||
        (atom as any)?.value?.thing?.name ||
        (atom as any)?.value?.person?.name ||
        (atom as any)?.value?.organization?.name ||
        'Unnamed Atom'

    return (
        <div className="container mx-auto py-10 px-4 max-w-5xl">
            {/* Breadcrumbs */}
            <nav className="flex items-center space-x-1 text-sm text-muted-foreground mb-8">
                <Link href="/" className="hover:text-primary flex items-center gap-1">
                    <Home className="h-3 w-3" /> Home
                </Link>
                <ChevronRight className="h-4 w-4" />
                <span className="truncate max-w-[200px] font-medium text-foreground">
                    {isAtomLoading ? <Skeleton className="h-4 w-20" /> : atomLabel}
                </span>
            </nav>

            {/* Atom Header */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                <div className="lg:col-span-2 space-y-6">
                    {isAtomLoading ? (
                        <div className="space-y-4">
                            <Skeleton className="h-12 w-3/4" />
                            <Skeleton className="h-20 w-full" />
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <h1 className="text-4xl font-extrabold tracking-tight">
                                    {atomLabel}
                                </h1>
                                {(atom as any)?.as_predicate_triples?.length > 0 && (
                                    <Badge variant="secondary" className="mt-1">
                                        Predicate
                                    </Badge>
                                )}
                            </div>
                            <p className="text-xl text-muted-foreground leading-relaxed">
                                {(atom as any)?.value?.thing?.description ||
                                    (atom as any)?.value?.person?.description ||
                                    (atom as any)?.value?.organization?.description ||
                                    ((atom as any)?.data?.startsWith('ipfs://') ? '' : (atom as any)?.data) ||
                                    'No description provided for this atom.'}
                            </p>

                            <div className="flex flex-wrap gap-4 pt-4">
                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted text-xs font-mono">
                                    <Hash className="h-3 w-3 text-primary" />
                                    {atomId}
                                </div>
                                {atom?.creator && (
                                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted text-xs">
                                        <User className="h-3 w-3 text-primary" />
                                        Created by: {atom.creator.id.slice(0, 6)}...{atom.creator.id.slice(-4)}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <div className="space-y-4">
                    <Card className="bg-primary/5 border-primary/10">
                        <CardHeader>
                            <CardTitle className="text-sm flex items-center gap-2 font-semibold">
                                <Info className="h-4 w-4 text-primary" />
                                Atom Overview
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-muted-foreground">Total Trust Signal</span>
                                <span className="font-bold">
                                    {isAtomLoading ? (
                                        <Skeleton className="h-3 w-12" />
                                    ) : (
                                        (Number((atom as any)?.term?.vaults?.[0]?.total_shares || 0) / 1e18).toFixed(4)
                                    )} $T
                                </span>
                            </div>
                            <Separator />
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-muted-foreground">Outgoing Triples</span>
                                <span className="font-bold">{isTriplesLoading ? <Skeleton className="h-3 w-8" /> : triples.length}</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Button
                        onClick={copyAISummary}
                        disabled={isLoading || triples.length === 0}
                        className="w-full gap-2 shadow-lg hover:shadow-primary/20 transition-all font-semibold"
                    >
                        <Sparkles className="h-4 w-4" />
                        Summarize for AI
                    </Button>
                    <FeedbackButton variant="outline" className="w-full" />
                </div>
            </div>

            {/* Relationships Section */}
            <div className="space-y-6">
                <div className="flex items-center justify-between border-b pb-4">
                    <div className="space-y-1">
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            <Network className="h-6 w-6 text-primary" />
                            Top Verified Claims
                        </h2>
                        <p className="text-sm text-muted-foreground">Highest stake relationships for this atom.</p>
                    </div>
                    {!isAtomLoading && <CreateTripleDialog subjectId={atomId} subjectLabel={atomLabel} />}
                </div>

                {isTriplesLoading ? (
                    <div className="grid gap-6 sm:grid-cols-2">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <Skeleton key={i} className="h-32 w-full rounded-xl" />
                        ))}
                    </div>
                ) : triples.length > 0 ? (
                    <div className="grid gap-6 sm:grid-cols-2">
                        {triples.map((triple: any) => (
                            <TripleCard key={triple.id} triple={triple} />
                        ))}
                    </div>
                ) : (
                    <div className="py-24 text-center space-y-4 rounded-2xl border-2 border-dashed border-muted bg-muted/5">
                        <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                            <Network className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div className="space-y-1">
                            <p className="text-muted-foreground font-medium">No verified claims found yet.</p>
                            <p className="text-xs text-muted-foreground/60 text-balance max-w-xs mx-auto">
                                Be the first to define how this atom relates to others in the TrustGraph!
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
