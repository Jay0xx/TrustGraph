'use client'

// Deployment Verification: 2026-02-24 19:16

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { ArrowRight, Search, Plus, Info, Network, ShieldCheck, AlertCircle, Sparkles } from 'lucide-react'
import { useSearchAtoms } from '@/hooks/useSearchAtoms'
import { AtomCard, AtomCardSkeleton } from '@/components/AtomCard'
import { useDebounce } from '@/hooks/useDebounce'
import { FeedbackButton } from '@/components/FeedbackButton'
import { toast } from 'react-hot-toast'

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearch = useDebounce(searchTerm, 500)
  const { atoms, isLoading, error } = useSearchAtoms(debouncedSearch)

  useEffect(() => {
    const hasSeenToast = localStorage.getItem('trustgraph_testnet_toast')
    if (!hasSeenToast) {
      toast('Welcome to the Testnet MVP! Found issues? Share via the feedback form.', {
        icon: '🚀',
        duration: 6000,
      })
      localStorage.setItem('trustgraph_testnet_toast', 'true')
    }
  }, [])

  return (
    <div className="flex flex-col items-center pb-20">
      {/* Hero Section */}
      <section className="w-full py-16 md:py-28 lg:py-36 bg-gradient-to-b from-primary/5 via-background to-background border-b relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="container px-4 md:px-6 mx-auto relative z-10">
          <div className="flex flex-col items-center space-y-10 text-center">
            <div className="space-y-4">
              <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary/10 text-primary mb-4">
                Now Live on Intuition Testnet (Chain ID 13579)
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                Trust<span className="text-primary">Graph</span>
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                The verifiable knowledge graph for human intuition. Search, curate, and verify claims with on-chain trust signals.
              </p>
            </div>

            {/* Search Bar */}
            <div className="w-full max-w-2xl relative group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
              </div>
              <Input
                type="text"
                placeholder="Search atoms (e.g., 'Bitcoin', 'Intuition', 'Reliable')"
                className="pl-12 py-7 text-lg rounded-2xl border-2 shadow-sm focus-visible:ring-primary h-14 bg-background transition-all focus:scale-[1.01]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-4">
              <Button asChild variant="outline" className="rounded-full px-8 shadow-sm">
                <Link href="/create-atom">
                  <Plus className="mr-2 h-4 w-4" /> Create New Atom
                </Link>
              </Button>
              <FeedbackButton variant="secondary" className="rounded-full px-8" />
            </div>

            {/* AI Summary Teaser Card */}
            <Card className="w-full max-w-xl border-primary/20 bg-gradient-to-r from-primary/8 via-primary/5 to-transparent shadow-lg shadow-primary/5 hover:shadow-primary/10 transition-all duration-500 group animate-in fade-in slide-in-from-bottom-4 duration-1000">
              <CardContent className="flex items-center gap-4 py-4 px-5">
                <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 group-hover:bg-primary/15 transition-colors flex-shrink-0">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0 space-y-0.5">
                  <p className="text-sm font-semibold text-foreground/90">
                    ✨ Verifiable AI Summaries
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Explore any Atom → get a copyable, trust-ranked summary of verified claims to paste into ChatGPT, Claude, or Gemini.
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 text-primary/50 group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0" />
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="w-full container px-4 md:px-6 mx-auto pt-16">
        {!!error && (
          <Alert variant="destructive" className="max-w-2xl mx-auto mb-10">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Search Error</AlertTitle>
            <AlertDescription>
              {String((error as any)?.message || 'Failed to connect to the knowledge graph.')}
            </AlertDescription>
          </Alert>
        )}

        {searchTerm.length > 0 && searchTerm.length <= 2 && (
          <div className="text-center py-10 text-muted-foreground animate-pulse">
            Keep typing to search the graph...
          </div>
        )}

        {debouncedSearch.length > 2 && (
          <div className="space-y-8">
            <Alert className="max-w-4xl mx-auto bg-primary/5 border-primary/20">
              <Info className="h-4 w-4 text-primary" />
              <AlertTitle className="text-sm font-semibold">Testnet Data Notice</AlertTitle>
              <AlertDescription className="text-xs text-muted-foreground">
                As this is the Intuition Testnet, data may be sparse. If you don't see results, try creating a new Atom or Triple to test the protocol!
              </AlertDescription>
            </Alert>

            <div className="flex items-center justify-between border-b pb-4">
              <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                <Network className="h-5 w-5 text-primary" />
                {isLoading ? 'Scanning TrustGraph...' : `Results for "${String(debouncedSearch)}"`}
              </h2>
              {!isLoading && atoms.length > 0 && (
                <div className="text-sm text-muted-foreground">
                  Found {atoms.length} matching entities
                </div>
              )}
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {isLoading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <AtomCardSkeleton key={i} />
                ))
              ) : atoms.length > 0 ? (
                atoms.map((atom: any) => (
                  <AtomCard key={atom.id} atom={atom} />
                ))
              ) : (
                <div className="col-span-full py-24 text-center space-y-6 border-2 border-dashed rounded-3xl bg-muted/5">
                  <div className="space-y-2">
                    <div className="text-muted-foreground text-xl font-medium">No results found for "{debouncedSearch}"</div>
                    <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                      This atom doesn't exist in our graph yet. You can be the first to define it!
                    </p>
                  </div>
                  <Button asChild size="lg" className="rounded-full">
                    <Link href="/create-atom">
                      <Plus className="mr-2 h-4 w-4" /> Create "{debouncedSearch}"
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}

        {searchTerm.length === 0 && (
          <div className="space-y-12">
            <div className="flex flex-col items-center text-center space-y-2">
              <h2 className="text-xl font-semibold">How it works</h2>
              <div className="h-1 w-12 bg-primary rounded-full" />
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <Card className="border-none shadow-md bg-gradient-to-br from-card to-muted/20 relative overflow-hidden group">
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/5 rounded-full group-hover:bg-primary/10 transition-colors" />
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Info className="h-5 w-5 text-primary" />
                    1. Search Atoms
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground text-sm leading-relaxed">
                  An atom is a basic unit of knowledge—a person, a company, or a concept. Everything starts with an atom.
                </CardContent>
              </Card>
              <Card className="border-none shadow-md bg-gradient-to-br from-card to-muted/20 relative overflow-hidden group">
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/5 rounded-full group-hover:bg-primary/10 transition-colors" />
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Network className="h-5 w-5 text-primary" />
                    2. Connect Triples
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground text-sm leading-relaxed">
                  Triples connect atoms (Subject → Predicate → Object). Help build the map of verifiable relationships.
                </CardContent>
              </Card>
              <Card className="border-none shadow-md bg-gradient-to-br from-card to-muted/20 relative overflow-hidden group">
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/5 rounded-full group-hover:bg-primary/10 transition-colors" />
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-primary" />
                    3. Stake & Verify
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground text-sm leading-relaxed">
                  Signal your trust by staking $TRUST on claims. This creates a crowdsourced, verifiable map of truth.
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </section>

      <footer className="mt-32 w-full max-w-5xl px-4 border-t pt-10 text-center text-sm text-muted-foreground/60">
        <div className="flex flex-col items-center gap-6">
          <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest bg-muted px-3 py-1 rounded-full">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Intuition Testnet (Chain ID 13579)
          </div>
          <div className="flex flex-col items-center gap-2">
            <p className="font-medium text-foreground/80">TrustGraph Beta | Feedback Welcome!</p>
            <FeedbackButton variant="link" className="h-auto p-0" />
          </div>
          <p className="text-[10px]">© 2026 TrustGraph MVP. Experimental AI-ready knowledge verification.</p>
        </div>
      </footer>
    </div>
  )
}
