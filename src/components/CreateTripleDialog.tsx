'use client'

import React, { useState, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import {
    Plus,
    Loader2,
    ArrowRight,
    Info,
    AlertCircle,
    Wallet,
    Sparkles,
    Zap,
    CheckCircle2,
} from 'lucide-react'
import { useCreateTriple, useTripleCost } from '@/hooks/useCreateTriple'
import { AtomPicker } from '@/components/AtomPicker'
import { SearchedAtom } from '@/hooks/useAtomSearch'

// Common predicate suggestions for discoverability
const SUGGESTED_PREDICATES = ['is', 'has', 'is a', 'works for', 'created by', 'part of', 'related to']

interface CreateTripleDialogProps {
    subjectId: string
    subjectLabel?: string
}

export function CreateTripleDialog({ subjectId, subjectLabel }: CreateTripleDialogProps) {
    const [open, setOpen] = useState(false)
    const createTripleMutation = useCreateTriple()
    const { data: costData, isLoading: isCostLoading, error: costError } = useTripleCost()

    // Atom picker state (managed outside react-hook-form since they're custom components)
    const [subjectAtom, setSubjectAtom] = useState<SearchedAtom | null>(
        subjectId
            ? { id: subjectId, label: subjectLabel || 'Current Atom', description: '' }
            : null
    )
    const [predicateAtom, setPredicateAtom] = useState<SearchedAtom | null>(null)
    const [objectAtom, setObjectAtom] = useState<SearchedAtom | null>(null)
    const [initialDeposit, setInitialDeposit] = useState('0')

    const isFormComplete = !!subjectAtom && !!predicateAtom && !!objectAtom
    const estimatedTotal = costData
        ? (parseFloat(costData.formatted) + parseFloat(initialDeposit || '0')).toFixed(6)
        : null

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!isFormComplete) return

        try {
            await createTripleMutation.mutateAsync({
                subjectId: subjectAtom!.id as `0x${string}`,
                predicateId: predicateAtom!.id as `0x${string}`,
                objectId: objectAtom!.id as `0x${string}`,
                initialDeposit: initialDeposit && parseFloat(initialDeposit) > 0
                    ? initialDeposit
                    : undefined,
            })
            setOpen(false)
            // Reset non-subject fields
            setPredicateAtom(null)
            setObjectAtom(null)
            setInitialDeposit('0')
        } catch {
            // Error handled in the mutation's onError
        }
    }

    const handleOpenChange = (isOpen: boolean) => {
        setOpen(isOpen)
        if (isOpen) {
            // Re-initialize subject when opening
            setSubjectAtom({
                id: subjectId,
                label: subjectLabel || 'Current Atom',
                description: '',
            })
        }
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button size="sm" className="gap-2">
                    <Plus className="h-4 w-4" /> Create Triple
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[520px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        <Zap className="h-5 w-5 text-primary" />
                        Create Relationship
                    </DialogTitle>
                    <DialogDescription className="text-xs leading-relaxed">
                        Define a verifiable claim by connecting three atoms:
                        <span className="font-medium text-foreground/80"> Subject → Predicate → Object</span>.
                        Search and select existing atoms or create new ones.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-5 pt-2">
                    {/* Triple visual preview */}
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/30 border text-xs font-medium">
                        <span className={subjectAtom ? 'text-primary' : 'text-muted-foreground'}>
                            {subjectAtom?.label || 'Subject'}
                        </span>
                        <ArrowRight className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                        <span className={predicateAtom ? 'text-primary' : 'text-muted-foreground'}>
                            {predicateAtom?.label || 'Predicate'}
                        </span>
                        <ArrowRight className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                        <span className={objectAtom ? 'text-primary' : 'text-muted-foreground'}>
                            {objectAtom?.label || 'Object'}
                        </span>
                        {isFormComplete && (
                            <CheckCircle2 className="h-3.5 w-3.5 text-green-500 ml-auto flex-shrink-0" />
                        )}
                    </div>

                    {/* Subject Atom Picker (pre-filled) */}
                    <AtomPicker
                        label="Subject (this atom)"
                        value={subjectAtom}
                        onChange={setSubjectAtom}
                        placeholder="Search for subject atom…"
                        disabled={true}
                        prefilledAtom={{
                            id: subjectId,
                            label: subjectLabel || 'Current Atom',
                            description: '',
                        }}
                    />

                    {/* Predicate Atom Picker */}
                    <AtomPicker
                        label="Predicate (relationship type)"
                        value={predicateAtom}
                        onChange={setPredicateAtom}
                        placeholder='Search for a verb (e.g. "is a", "has", "works for")…'
                        suggestedLabels={SUGGESTED_PREDICATES}
                    />

                    {/* Object Atom Picker */}
                    <AtomPicker
                        label="Object (target atom)"
                        value={objectAtom}
                        onChange={setObjectAtom}
                        placeholder="Search for the target atom…"
                    />

                    <Separator className="my-2" />

                    {/* Initial deposit */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-foreground">
                            Initial Deposit (optional)
                        </label>
                        <div className="relative">
                            <Input
                                type="number"
                                step="0.001"
                                min="0"
                                value={initialDeposit}
                                onChange={(e) => setInitialDeposit(e.target.value)}
                                placeholder="0.00"
                                className="pr-14 h-10 bg-background"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-mono">
                                ETH
                            </span>
                        </div>
                        <p className="text-[10px] text-muted-foreground">
                            Optional stake to endorse this triple on creation. You can always add more later.
                        </p>
                    </div>

                    {/* Cost estimation */}
                    <div className="rounded-lg border bg-muted/20 p-4 space-y-3">
                        <div className="flex items-center gap-2 text-xs font-semibold">
                            <Wallet className="h-3.5 w-3.5 text-primary" />
                            Cost Estimate
                        </div>

                        {isCostLoading ? (
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-2/3" />
                            </div>
                        ) : costError ? (
                            <div className="flex items-center gap-2 text-xs text-destructive">
                                <AlertCircle className="h-3.5 w-3.5" />
                                <span>Could not fetch cost. Connect wallet and ensure you&apos;re on the correct network.</span>
                            </div>
                        ) : costData ? (
                            <div className="space-y-2 text-xs">
                                <div className="flex justify-between items-center">
                                    <span className="text-muted-foreground">Protocol fee (triple creation)</span>
                                    <span className="font-mono font-medium">{parseFloat(costData.formatted).toFixed(6)} ETH</span>
                                </div>
                                {parseFloat(initialDeposit || '0') > 0 && (
                                    <div className="flex justify-between items-center">
                                        <span className="text-muted-foreground">Initial deposit</span>
                                        <span className="font-mono font-medium">
                                            {parseFloat(initialDeposit).toFixed(6)} ETH
                                        </span>
                                    </div>
                                )}
                                <Separator />
                                <div className="flex justify-between items-center font-bold text-sm">
                                    <span>Total</span>
                                    <span className="font-mono text-primary">
                                        {estimatedTotal} ETH
                                    </span>
                                </div>
                                <p className="text-[10px] text-muted-foreground italic flex items-center gap-1">
                                    <Info className="h-3 w-3" />
                                    + gas fees (estimated by your wallet)
                                </p>
                            </div>
                        ) : (
                            <p className="text-xs text-muted-foreground">
                                Connect your wallet to see cost estimate.
                            </p>
                        )}
                    </div>

                    {/* Submit */}
                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                            disabled={createTripleMutation.isPending}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={
                                !isFormComplete ||
                                createTripleMutation.isPending ||
                                isCostLoading ||
                                !!costError
                            }
                            className="gap-2 min-w-[140px]"
                        >
                            {createTripleMutation.isPending ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Creating…
                                </>
                            ) : (
                                <>
                                    <Sparkles className="h-4 w-4" />
                                    Create Triple
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
