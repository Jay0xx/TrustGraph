'use client'

import Link from 'next/link'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Share2, TrendingUp } from 'lucide-react'

interface AtomCardProps {
    atom: {
        id: string
        label?: string
        description?: string
        triplesCount?: number
    }
}

export function AtomCard({ atom }: AtomCardProps) {
    return (
        <Link href={`/atoms/${atom.id}`}>
            <Card className="h-full hover:border-primary/50 transition-colors cursor-pointer group">
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <CardTitle className="line-clamp-1 group-hover:text-primary transition-colors">
                            {atom.label || 'Unnamed Atom'}
                        </CardTitle>
                        <Share2 className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <CardDescription className="line-clamp-2 min-h-[2.5rem]">
                        {atom.description || 'No description available.'}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                            <TrendingUp className="h-4 w-4" />
                            <span>{atom.triplesCount || 0} triples</span>
                        </div>
                    </div>
                </CardContent>
                <CardFooter>
                    <code className="text-[10px] text-muted-foreground truncate w-full">
                        {atom.id}
                    </code>
                </CardFooter>
            </Card>
        </Link>
    )
}

export function AtomCardSkeleton() {
    return (
        <Card className="h-full">
            <CardHeader>
                <div className="h-6 w-3/4 bg-muted animate-pulse rounded" />
                <div className="h-4 w-full bg-muted animate-pulse rounded mt-2" />
                <div className="h-4 w-2/3 bg-muted animate-pulse rounded mt-1" />
            </CardHeader>
            <CardContent>
                <div className="h-4 w-1/4 bg-muted animate-pulse rounded" />
            </CardContent>
            <CardFooter>
                <div className="h-3 w-full bg-muted animate-pulse rounded" />
            </CardFooter>
        </Card>
    )
}
