'use client'

import Link from 'next/link'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { ThemeToggle } from './ThemeToggle'
import { Share2, Beaker, BookOpen } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { FeedbackButton } from './FeedbackButton'

export function Navbar() {
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between">
                <div className="flex items-center gap-2">
                    <Link href="/" className="flex items-center space-x-2">
                        <Share2 className="h-6 w-6 text-primary" />
                        <span className="inline-block font-bold text-xl tracking-tight">
                            TrustGraph
                        </span>
                        <Badge variant="outline" className="text-[10px] py-0 px-1.5 h-4 bg-orange-500/10 text-orange-600 border-orange-500/20 flex items-center gap-1">
                            <Beaker className="h-2.5 w-2.5" />
                            Testnet Beta
                        </Badge>
                    </Link>
                    <nav className="ml-8 hidden md:flex items-center gap-6">
                        <Link href="/how-it-works" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5">
                            <BookOpen className="h-4 w-4" />
                            How It Works
                        </Link>
                        <Link href="/create-atom" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                            Create Atom
                        </Link>
                        <Link href="/test" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                            SDK Test
                        </Link>
                    </nav>
                </div>
                <div className="flex items-center gap-3">
                    <FeedbackButton variant="ghost" className="hidden lg:flex" />
                    <ThemeToggle />
                    <ConnectButton
                        accountStatus="avatar"
                        chainStatus="icon"
                        showBalance={false}
                    />
                </div>
            </div>
        </header>
    )
}
