'use client'

import React from 'react'
import Link from 'next/link'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Progress } from '@/components/ui/progress'
import { ArrowRight, Info, ShieldCheck, TrendingUp, Users } from 'lucide-react'
import { useAttest } from '@/hooks/useAttest'

interface Triple {
    id: string
    subject: { id: string; label?: string }
    predicate: { id: string; label?: string }
    object: { id: string; label?: string }
    trustSignal: number
    attestersCount: number
    provenance: Array<{
        account: string
        label?: string
        shares: number
    }>
}

interface TripleCardProps {
    triple: Triple
}

export function TripleCard({ triple }: TripleCardProps) {
    const attestMutation = useAttest()

    const handleEndorse = async () => {
        const amount = prompt('Enter amount to stake (ETH):', '0.01')
        if (amount && !isNaN(Number(amount))) {
            await attestMutation.mutateAsync({
                id: triple.id as `0x${string}`,
                amount: amount
            })
        }
    }

    // Normalized trust for progress bar (cap at some reasonable value for visualization)
    const trustPercent = Math.min((triple.trustSignal / 5) * 100, 100)

    // Determine color based on trust signal
    const progressColor = triple.trustSignal > 1
        ? "bg-green-500"
        : triple.trustSignal > 0
            ? "bg-amber-500"
            : "bg-muted-foreground/30"

    return (
        <Card className="overflow-hidden border-l-4 border-l-primary/50 group transition-all hover:shadow-md">
            <CardHeader className="pb-2">
                <div className="flex justify-between items-start gap-2 mb-2">
                    <div className="flex flex-wrap items-center gap-2 text-sm font-medium">
                        <Link href={`/atoms/${triple.subject.id}`} className="hover:text-primary transition-colors hover:underline">
                            {triple.subject.label || 'Subject'}
                        </Link>
                        <ArrowRight className="h-3 w-3 text-muted-foreground" />
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Badge variant="outline" className="font-mono text-[10px] bg-muted/50 cursor-help">
                                    {triple.predicate.label || 'Predicate'}
                                </Badge>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p className="text-[10px] font-mono">{triple.predicate.id}</p>
                            </TooltipContent>
                        </Tooltip>
                        <ArrowRight className="h-3 w-3 text-muted-foreground" />
                        <Link href={`/atoms/${triple.object.id}`} className="hover:text-primary transition-colors text-primary font-bold hover:underline">
                            {triple.object.label || 'Object'}
                        </Link>
                    </div>
                    {triple.trustSignal > 1 ? (
                        <div className="flex items-center gap-1 text-green-500">
                            <ShieldCheck className="h-4 w-4" />
                            <span className="text-[10px] font-bold uppercase tracking-wider">Verified</span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-1 text-muted-foreground/50">
                            <Info className="h-4 w-4" />
                            <span className="text-[10px] font-bold uppercase tracking-wider">Sparse Signal</span>
                        </div>
                    )}
                </div>
            </CardHeader>
            <CardContent className="pb-4">
                <div className="space-y-3">
                    <div className="flex justify-between items-end text-xs mb-1">
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                            <TrendingUp className="h-3 w-3 text-primary" />
                            <span>Trust Signal: <span className="text-foreground font-semibold">{triple.trustSignal.toFixed(4)} $TRUST</span></span>
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                            <Users className="h-3 w-3" />
                            <span>{triple.attestersCount} attesters</span>
                        </div>
                    </div>
                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                        <div
                            className={`h-full transition-all duration-500 ${progressColor}`}
                            style={{ width: `${trustPercent}%` }}
                        />
                    </div>
                </div>
            </CardContent>
            <CardFooter className="pt-2 flex justify-between items-center bg-muted/20 border-t">
                <div className="flex items-center gap-2">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full hover:bg-primary/20">
                                <Users className="h-3 w-3" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-64 p-3 shadow-xl">
                            <div className="space-y-2">
                                <div className="flex items-center justify-between border-b pb-1">
                                    <h4 className="font-semibold text-xs">Provenance</h4>
                                    <Badge variant="outline" className="text-[8px] h-4 uppercase">Testnet Beta</Badge>
                                </div>
                                {triple.provenance.length > 0 ? (
                                    <div className="max-h-32 overflow-y-auto space-y-2 pr-1 pt-1">
                                        {triple.provenance.map((p, idx) => (
                                            <div key={idx} className="flex justify-between text-[10px] items-start border-b border-muted last:border-0 pb-1.5">
                                                <div className="flex flex-col">
                                                    <span className="font-mono text-foreground">
                                                        {p.label || (p.account ? `${p.account.slice(0, 6)}...${p.account.slice(-4)}` : 'Unknown')}
                                                    </span>
                                                    <span className="text-[8px] text-muted-foreground font-mono truncate max-w-[120px]">
                                                        {p.account || '0x...'}
                                                    </span>
                                                </div>
                                                <span className="font-bold text-primary">{p.shares.toFixed(4)} $T</span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-[10px] text-muted-foreground py-2 text-center">No signals yet. Be the first to verify!</p>
                                )}
                            </div>
                        </PopoverContent>
                    </Popover>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <code className="text-[10px] text-muted-foreground truncate max-w-[80px] cursor-help bg-muted/50 px-1 rounded">
                                {triple.id.slice(0, 8)}...
                            </code>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p className="text-[10px] font-mono">{triple.id}</p>
                        </TooltipContent>
                    </Tooltip>
                </div>
                <Button
                    size="sm"
                    variant={triple.trustSignal > 0 ? "secondary" : "outline"}
                    className="h-7 text-xs px-4 font-bold"
                    onClick={handleEndorse}
                    disabled={attestMutation.isPending}
                >
                    {attestMutation.isPending ? 'Processing...' : 'Endorse'}
                </Button>
            </CardFooter>
        </Card>
    )
}
