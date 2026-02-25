'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
    Search,
    X,
    Hash,
    Loader2,
    Plus,
    ExternalLink,
    CheckCircle2,
} from 'lucide-react'
import { useAtomSearch, SearchedAtom } from '@/hooks/useAtomSearch'
import Link from 'next/link'

interface AtomPickerProps {
    label: string
    value: SearchedAtom | null
    onChange: (atom: SearchedAtom | null) => void
    placeholder?: string
    disabled?: boolean
    prefilledAtom?: SearchedAtom | null
    suggestedLabels?: string[]
}

export function AtomPicker({
    label,
    value,
    onChange,
    placeholder = 'Search atoms by name…',
    disabled = false,
    prefilledAtom,
    suggestedLabels,
}: AtomPickerProps) {
    const [query, setQuery] = useState('')
    const [isOpen, setIsOpen] = useState(false)
    const { atoms, isLoading } = useAtomSearch(query)
    const containerRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    // Close dropdown on outside click
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    // Auto-select prefilled atom on mount
    useEffect(() => {
        if (prefilledAtom && !value) {
            onChange(prefilledAtom)
        }
    }, [prefilledAtom, value, onChange])

    const handleSelect = (atom: SearchedAtom) => {
        onChange(atom)
        setQuery('')
        setIsOpen(false)
    }

    const handleClear = () => {
        onChange(null)
        setQuery('')
        inputRef.current?.focus()
    }

    const handleSuggestedClick = (label: string) => {
        setQuery(label)
        setIsOpen(true)
        inputRef.current?.focus()
    }

    // If an atom is selected, show a chip
    if (value) {
        return (
            <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">{label}</label>
                <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg border bg-muted/30 border-primary/20 group">
                    <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                            <span className="font-medium text-sm truncate">{value.label}</span>
                            <Badge
                                variant="outline"
                                className="text-[9px] h-4 font-mono bg-muted/50 flex-shrink-0"
                            >
                                <Hash className="h-2 w-2 mr-0.5" />
                                {value.id.slice(0, 8)}…
                            </Badge>
                        </div>
                        {value.description && value.description !== 'No description' && (
                            <p className="text-[10px] text-muted-foreground truncate mt-0.5">
                                {value.description}
                            </p>
                        )}
                    </div>
                    {!disabled && (
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 rounded-full opacity-50 hover:opacity-100 flex-shrink-0"
                            onClick={handleClear}
                        >
                            <X className="h-3 w-3" />
                        </Button>
                    )}
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-1.5 relative" ref={containerRef}>
            <label className="text-sm font-medium text-foreground">{label}</label>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    {isLoading ? (
                        <Loader2 className="h-4 w-4 text-muted-foreground animate-spin" />
                    ) : (
                        <Search className="h-4 w-4 text-muted-foreground" />
                    )}
                </div>
                <Input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value)
                        setIsOpen(true)
                    }}
                    onFocus={() => {
                        if (query.length > 1) setIsOpen(true)
                    }}
                    placeholder={placeholder}
                    disabled={disabled}
                    className="pl-10 pr-4 h-10 bg-background"
                />
            </div>

            {/* Suggestions chips */}
            {suggestedLabels && suggestedLabels.length > 0 && !query && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                    <span className="text-[10px] text-muted-foreground/60 mr-1 self-center">
                        Suggested:
                    </span>
                    {suggestedLabels.map((s) => (
                        <button
                            key={s}
                            type="button"
                            onClick={() => handleSuggestedClick(s)}
                            className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors border border-primary/15"
                        >
                            {s}
                        </button>
                    ))}
                </div>
            )}

            {/* Dropdown results */}
            {isOpen && query.length > 1 && (
                <div className="absolute z-50 w-full mt-1 bg-popover border rounded-lg shadow-xl max-h-[260px] overflow-y-auto">
                    {isLoading ? (
                        <div className="p-3 space-y-2">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex items-center gap-2">
                                    <Skeleton className="h-4 w-4 rounded" />
                                    <Skeleton className="h-4 flex-1" />
                                </div>
                            ))}
                        </div>
                    ) : atoms.length > 0 ? (
                        <div className="py-1">
                            {atoms.map((atom) => (
                                <button
                                    key={atom.id}
                                    type="button"
                                    onClick={() => handleSelect(atom)}
                                    className="w-full px-3 py-2.5 text-left hover:bg-accent/50 transition-colors flex items-start gap-3 group/item"
                                >
                                    <div className="mt-0.5 w-6 h-6 rounded bg-primary/10 flex items-center justify-center flex-shrink-0 text-xs">
                                        {atom.emoji || '⚛'}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-medium truncate group-hover/item:text-primary transition-colors">
                                                {atom.label}
                                            </span>
                                            <span className="text-[9px] font-mono text-muted-foreground bg-muted px-1 rounded flex-shrink-0">
                                                {atom.id.slice(0, 8)}…
                                            </span>
                                        </div>
                                        {atom.description && atom.description !== 'No description' && (
                                            <p className="text-[10px] text-muted-foreground truncate mt-0.5">
                                                {atom.description}
                                            </p>
                                        )}
                                    </div>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="p-4 text-center space-y-2">
                            <p className="text-sm text-muted-foreground">
                                No atoms found for &quot;{query}&quot;
                            </p>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                asChild
                                className="gap-2"
                            >
                                <Link href="/create-atom" target="_blank">
                                    <Plus className="h-3 w-3" />
                                    Create &quot;{query}&quot;
                                    <ExternalLink className="h-3 w-3" />
                                </Link>
                            </Button>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
