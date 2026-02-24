'use client'

import { useState } from 'react'
import { useSearchAtoms } from '@/hooks/useSearchAtoms'
import { useCreateAtom } from '@/hooks/useCreateAtom'
import { useCreateTriple } from '@/hooks/useCreateTriple'
import { useAttest } from '@/hooks/useAttest'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { Loader2, Plus, Search, Share2, ShieldCheck } from 'lucide-react'

export default function TestPage() {
    const [searchQuery, setSearchQuery] = useState('')
    const [atomData, setAtomData] = useState('')
    const [triple, setTriple] = useState({ subject: '', predicate: '', object: '' })
    const [attestAmount, setAttestAmount] = useState('0.001')

    const { atoms, isLoading: isSearching } = useSearchAtoms(searchQuery)
    const createAtom = useCreateAtom()
    const createTriple = useCreateTriple()
    const attest = useAttest()

    const handleCreateAtom = (e: React.FormEvent) => {
        e.preventDefault()
        createAtom.mutate({ name: atomData })
    }

    const handleCreateTriple = (e: React.FormEvent) => {
        e.preventDefault()
        createTriple.mutate({
            subjectId: triple.subject as `0x${string}`,
            predicateId: triple.predicate as `0x${string}`,
            objectId: triple.object as `0x${string}`,
        })
    }

    return (
        <div className="container py-10 max-w-4xl">
            <div className="space-y-2 mb-8 text-center md:text-left">
                <h1 className="text-4xl font-bold tracking-tight">SDK Integration Test</h1>
                <p className="text-muted-foreground">
                    Test the Intuition SDK and GraphQL integration in real-time.
                </p>
            </div>

            <Tabs defaultValue="search" className="space-y-6">
                <TabsList className="grid w-full grid-cols-3 rounded-full p-1 bg-muted/50">
                    <TabsTrigger value="search" className="rounded-full">Search Atoms</TabsTrigger>
                    <TabsTrigger value="create-atom" className="rounded-full">Create Atom</TabsTrigger>
                    <TabsTrigger value="create-triple" className="rounded-full">Create Triple</TabsTrigger>
                </TabsList>

                <TabsContent value="search" className="space-y-4">
                    <Card className="border-border/50 bg-background/50 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle>Search the Graph</CardTitle>
                            <CardDescription>Find existing atoms to build triples.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search by label or data..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-9 rounded-full bg-background"
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                {isSearching ? (
                                    Array.from({ length: 3 }).map((_, i) => (
                                        <Skeleton key={i} className="h-20 w-full rounded-xl" />
                                    ))
                                ) : atoms.length > 0 ? (
                                    atoms.map((atom: any) => (
                                        <Card key={atom.id} className="group overflow-hidden border-border/40 hover:border-primary/50 transition-all">
                                            <div className="p-4 flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                                        {atom.label?.charAt(0) || '?'}
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold">{atom.label || 'Unnamed Atom'}</p>
                                                        {atom.id}
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="rounded-full"
                                                        onClick={() => {
                                                            attest.mutate({ id: atom.id, amount: attestAmount })
                                                        }}
                                                        disabled={attest.isPending}
                                                    >
                                                        {attest.isPending ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <ShieldCheck className="h-3 w-3 mr-1" />}
                                                        Attest
                                                    </Button>
                                                </div>
                                            </div>
                                        </Card>
                                    ))
                                ) : searchQuery.length > 2 ? (
                                    <p className="text-center py-10 text-muted-foreground">No atoms found.</p>
                                ) : (
                                    <p className="text-center py-10 text-muted-foreground italic">Type at least 3 characters to search.</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="create-atom">
                    <Card className="border-border/50 bg-background/50 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle>Create New Atom</CardTitle>
                            <CardDescription>Add a new piece of knowledge to the graph.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleCreateAtom} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Atom Content</label>
                                    <Input
                                        placeholder="Enter string content... (human readable label)"
                                        value={atomData}
                                        onChange={(e) => setAtomData(e.target.value)}
                                        className="rounded-xl"
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    className="w-full rounded-full"
                                    disabled={createAtom.isPending || !atomData}
                                >
                                    {createAtom.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                                    Create Atom
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="create-triple">
                    <Card className="border-border/50 bg-background/50 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle>Create Relation (Triple)</CardTitle>
                            <CardDescription>Connect atoms via a predicate relation.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleCreateTriple} className="space-y-4">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium flex items-center gap-2">
                                            <div className="h-2 w-2 rounded-full bg-blue-500" /> Subject ID
                                        </label>
                                        <Input
                                            placeholder="0x..."
                                            value={triple.subject}
                                            onChange={(e) => setTriple({ ...triple, subject: e.target.value })}
                                            className="font-mono rounded-xl"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium flex items-center gap-2">
                                            <div className="h-2 w-2 rounded-full bg-purple-500" /> Predicate ID
                                        </label>
                                        <Input
                                            placeholder="0x..."
                                            value={triple.predicate}
                                            onChange={(e) => setTriple({ ...triple, predicate: e.target.value })}
                                            className="font-mono rounded-xl"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium flex items-center gap-2">
                                            <div className="h-2 w-2 rounded-full bg-pink-500" /> Object ID
                                        </label>
                                        <Input
                                            placeholder="0x..."
                                            value={triple.object}
                                            onChange={(e) => setTriple({ ...triple, object: e.target.value })}
                                            className="font-mono rounded-xl"
                                        />
                                    </div>
                                </div>
                                <Button
                                    type="submit"
                                    className="w-full rounded-full"
                                    disabled={createTriple.isPending || !triple.subject || !triple.predicate || !triple.object}
                                >
                                    {createTriple.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Share2 className="h-4 w-4 mr-2" />}
                                    Link Atoms
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div >
    )
}
