'use client'

import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
    BookOpen,
    ArrowLeft,
    Search,
    Plus,
    ShieldCheck,
    Network,
    Sparkles,
    MessageSquarePlus
} from 'lucide-react'
import { FeedbackButton } from '@/components/FeedbackButton'

export default function HowItWorksPage() {
    return (
        <div className="container mx-auto py-12 px-4 max-w-4xl">
            <div className="mb-10">
                <Button asChild variant="ghost" className="mb-6 -ml-4 text-muted-foreground hover:text-primary">
                    <Link href="/">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Explorer
                    </Link>
                </Button>

                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                        <BookOpen className="h-6 w-6 text-primary" />
                    </div>
                    <h1 className="text-4xl font-extrabold tracking-tight">How TrustGraph Works</h1>
                </div>
                <p className="text-xl text-muted-foreground">
                    TrustGraph is a testnet explorer for Intuition's knowledge graph. It allows you to explore, build, and verify semantic relationships using on-chain trust signals.
                </p>
            </div>

            <div className="grid gap-8 mb-12">
                <section className="space-y-6">
                    <h2 className="text-2xl font-bold border-b pb-2">Core Concepts</h2>
                    <div className="grid sm:grid-cols-2 gap-6">
                        <Card className="bg-muted/30 border-none">
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                                        <span className="text-xs font-bold font-mono">1</span>
                                    </div>
                                    Atoms
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm text-muted-foreground leading-relaxed">
                                An **Atom** is a basic unit of knowledge—a person, a company, a concept, or even a specific claim. Everything in the Intuition ecosystem starts with an atom.
                            </CardContent>
                        </Card>
                        <Card className="bg-muted/30 border-none">
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                                        <span className="text-xs font-bold font-mono">2</span>
                                    </div>
                                    Triples
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm text-muted-foreground leading-relaxed">
                                A **Triple** connects atoms together (Subject → Predicate → Object). For example: `Intuition (Atom) → is → Reliable (Atom)`. This builds the map of verifiable relationships.
                            </CardContent>
                        </Card>
                    </div>
                </section>

                <section className="space-y-6">
                    <h2 className="text-2xl font-bold border-b pb-2">Step-by-Step Guide</h2>
                    <div className="space-y-4">
                        <div className="flex gap-4 items-start">
                            <div className="mt-1 bg-primary/10 p-3 rounded-full shrink-0">
                                <Search className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-bold">1. Search & Explore</h3>
                                <p className="text-sm text-muted-foreground">Search for existing entities. If you find one, explore its relationships to see what the community thinks.</p>
                            </div>
                        </div>
                        <div className="flex gap-4 items-start">
                            <div className="mt-1 bg-primary/10 p-3 rounded-full shrink-0">
                                <Plus className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-bold">2. Create & Connect</h3>
                                <p className="text-sm text-muted-foreground">Is an entity or relationship missing? Create a new Atom or build a Triple to add it to the graph.</p>
                            </div>
                        </div>
                        <div className="flex gap-4 items-start">
                            <div className="mt-1 bg-primary/10 p-3 rounded-full shrink-0">
                                <ShieldCheck className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-bold">3. Endorse & Verify</h3>
                                <p className="text-sm text-muted-foreground">Signal your trust by "Endorsing" (staking $TRUST) on claims. This creates an economic signal of reliability and truth.</p>
                            </div>
                        </div>
                        <div className="flex gap-4 items-start">
                            <div className="mt-1 bg-primary/10 p-3 rounded-full shrink-0">
                                <Sparkles className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-bold">4. Summarize for AI</h3>
                                <p className="text-sm text-muted-foreground">Use the "Summarize for AI" tool to get a verifiable context snippet for your favorite LLM or RAG workflow.</p>
                            </div>
                        </div>
                    </div>
                </section>

                <Card className="border-primary/20 bg-primary/5">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <MessageSquarePlus className="h-5 w-5 text-primary" />
                            Feedback Welcome!
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                            TrustGraph is currently in **Testnet Beta**. Full step-by-step documentation is coming soon. In the meantime, play around and let us know what you think!
                        </p>
                        <FeedbackButton variant="default" className="w-full sm:w-auto" />
                    </CardContent>
                </Card>
            </div>

            <footer className="text-center pt-8 border-t">
                <Button asChild variant="link">
                    <Link href="/">Back to Search the Graph</Link>
                </Button>
            </footer>
        </div>
    )
}
