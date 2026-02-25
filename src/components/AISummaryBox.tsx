'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import {
    Sparkles,
    Copy,
    Check,
    Loader2,
    AlertCircle,
    RefreshCw,
    Zap,
    Bot,
} from 'lucide-react'
import { useAISummary } from '@/hooks/useAISummary'

interface Triple {
    id: string
    subject: { label: string }
    predicate: { label: string }
    object: { label: string }
    trustSignal: number
    attestersCount: number
    provenance: { account: string; label?: string; shares: number }[]
}

interface AISummaryBoxProps {
    atomLabel: string
    atomId: string
    triples: Triple[]
    isLoading: boolean
}

export function AISummaryBox({ atomLabel, atomId, triples, isLoading }: AISummaryBoxProps) {
    const {
        summary,
        isGenerating,
        isCopied,
        hasGenerated,
        generate,
        copyToClipboard,
    } = useAISummary({ atomLabel, atomId, triples, isLoading })

    // Full skeleton loading state
    if (isLoading) {
        return (
            <Card className="relative overflow-hidden border-2 border-primary/10">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/3 pointer-events-none" />
                <CardHeader className="space-y-3 relative">
                    <Skeleton className="h-7 w-2/5" />
                    <Skeleton className="h-4 w-3/5" />
                </CardHeader>
                <CardContent className="space-y-4 relative">
                    <Skeleton className="h-[220px] w-full rounded-lg" />
                    <div className="flex gap-3">
                        <Skeleton className="h-12 flex-1" />
                        <Skeleton className="h-12 w-40" />
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card
            id="ai-summary-section"
            className="relative overflow-hidden border-2 border-primary/20 shadow-2xl shadow-primary/5 transition-all duration-700 group hover:border-primary/30"
        >
            {/* Animated gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-primary/3 to-transparent pointer-events-none" />
            <div className="absolute -top-20 -right-20 w-60 h-60 bg-primary/5 rounded-full blur-3xl pointer-events-none group-hover:bg-primary/10 transition-all duration-1000" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-primary/3 rounded-full blur-2xl pointer-events-none" />

            {/* Decorative sparkles */}
            <div className="absolute top-4 right-4 opacity-[0.08] pointer-events-none group-hover:opacity-[0.15] transition-opacity duration-700">
                <Sparkles className="h-28 w-28 text-primary" />
            </div>

            {/* Header */}
            <CardHeader className="pb-4 border-b border-primary/10 relative">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                                <Bot className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <CardTitle className="text-xl font-bold tracking-tight flex items-center gap-2">
                                    Verifiable AI Summary
                                    <Badge
                                        variant="outline"
                                        className="text-[9px] h-5 uppercase tracking-widest font-semibold border-primary/30 text-primary/80"
                                    >
                                        <Zap className="h-2.5 w-2.5 mr-1" />
                                        AI-Ready
                                    </Badge>
                                </CardTitle>
                                <CardDescription className="text-xs text-muted-foreground/80 mt-0.5">
                                    Trusted claims aggregated for LLM context grounding.
                                </CardDescription>
                            </div>
                        </div>
                    </div>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={generate}
                        disabled={isGenerating || triples.length === 0}
                        className="gap-2 whitespace-nowrap border-primary/20 hover:bg-primary/10 hover:border-primary/40 transition-all"
                    >
                        {isGenerating ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <RefreshCw className="h-4 w-4" />
                        )}
                        {isGenerating ? 'Synthesizing…' : hasGenerated ? 'Regenerate' : 'Generate Summary'}
                    </Button>
                </div>
            </CardHeader>

            {/* Content */}
            <CardContent className="pt-6 space-y-5 relative">
                {triples.length === 0 ? (
                    /* Empty / insufficient data state */
                    <div className="py-14 flex flex-col items-center text-center space-y-5 rounded-xl bg-muted/30 border-2 border-dashed border-primary/15">
                        <div className="p-4 rounded-full bg-primary/10 border border-primary/20">
                            <AlertCircle className="h-8 w-8 text-primary/50" />
                        </div>
                        <div className="space-y-2 max-w-[300px]">
                            <p className="font-semibold text-foreground/80">
                                Insufficient Data for Summary
                            </p>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                Add or endorse Triples for this Atom to build a verifiable,
                                AI-ready summary of trusted claims.
                            </p>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Generating animation */}
                        {isGenerating && !summary && (
                            <div className="py-14 flex flex-col items-center text-center space-y-4 rounded-xl bg-muted/20 border border-primary/10">
                                <div className="relative">
                                    <div className="p-4 rounded-full bg-primary/10 border border-primary/20">
                                        <Sparkles className="h-8 w-8 text-primary animate-pulse" />
                                    </div>
                                    <div className="absolute -inset-2 rounded-full border-2 border-primary/20 animate-ping" />
                                </div>
                                <div className="space-y-1">
                                    <p className="font-medium text-sm">Aggregating trusted claims…</p>
                                    <p className="text-xs text-muted-foreground">
                                        Analyzing {triples.length} triples by trust stake
                                    </p>
                                </div>
                                {/* Progress dots */}
                                <div className="flex gap-1.5">
                                    {[0, 1, 2].map((i) => (
                                        <div
                                            key={i}
                                            className="w-2 h-2 rounded-full bg-primary/60 animate-bounce"
                                            style={{ animationDelay: `${i * 200}ms` }}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Summary textarea */}
                        {(summary || (!isGenerating && hasGenerated)) && (
                            <div className="relative group/textarea">
                                <div className="absolute -inset-px rounded-lg bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 opacity-0 group-hover/textarea:opacity-100 transition-opacity duration-500 pointer-events-none" />
                                <Textarea
                                    id="ai-summary-output"
                                    value={summary}
                                    readOnly
                                    placeholder="Waiting for facts…"
                                    className="relative min-h-[240px] font-mono text-xs bg-background/80 dark:bg-black/40 border-primary/15 resize-none leading-relaxed focus-visible:ring-primary/30 scrollbar-thin scrollbar-thumb-primary/20 rounded-lg"
                                />
                                {!summary && !isGenerating && (
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none rounded-lg">
                                        <p className="text-muted-foreground/30 text-xs italic">
                                            Click &quot;Generate Summary&quot; to build the report
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Action buttons */}
                        {(summary || hasGenerated) && (
                            <div className="flex flex-col sm:flex-row gap-3">
                                <Button
                                    id="copy-summary-btn"
                                    className="flex-1 gap-2 font-bold shadow-lg shadow-primary/15 hover:shadow-primary/25 transition-all py-6 text-sm"
                                    onClick={copyToClipboard}
                                    disabled={!summary || isGenerating}
                                    variant={isCopied ? 'outline' : 'default'}
                                >
                                    {isCopied ? (
                                        <Check className="h-5 w-5 text-green-500" />
                                    ) : (
                                        <Copy className="h-5 w-5" />
                                    )}
                                    {isCopied ? 'Copied to Clipboard!' : 'Copy Summary for AI'}
                                </Button>
                                <Button
                                    variant="outline"
                                    className="gap-2 py-6 border-primary/20 hover:bg-primary/10 text-sm"
                                    onClick={generate}
                                    disabled={isGenerating}
                                >
                                    <RefreshCw className={`h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
                                    Regenerate
                                </Button>
                            </div>
                        )}

                        {/* Usage tip */}
                        {summary && (
                            <div className="flex items-start gap-2 px-4 py-3 rounded-lg bg-muted/30 border border-muted">
                                <Sparkles className="h-3.5 w-3.5 text-primary mt-0.5 flex-shrink-0" />
                                <p className="text-[11px] text-muted-foreground leading-relaxed">
                                    <strong className="text-foreground/80">Tip:</strong> Paste this summary into
                                    ChatGPT, Claude, or Gemini to provide verifiable, on-chain ground truth
                                    about &quot;{atomLabel}&quot;. The trust signals let AI models assess claim reliability.
                                </p>
                            </div>
                        )}
                    </>
                )}
            </CardContent>
        </Card>
    )
}
