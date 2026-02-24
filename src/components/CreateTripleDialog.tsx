'use client'

import React, { useState } from 'react'
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
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Plus, Search, Loader2 } from 'lucide-react'
import { useCreateTriple } from '@/hooks/useCreateTriple'
import { useSearchAtoms } from '@/hooks/useSearchAtoms'
import { useDebounce } from '@/hooks/useDebounce'

const formSchema = z.object({
    predicateId: z.string().regex(/^0x[a-fA-F0-9]{40,64}$/, {
        message: 'Must be a valid hex ID (0x...)',
    }),
    objectId: z.string().regex(/^0x[a-fA-F0-9]{40,64}$/, {
        message: 'Must be a valid hex ID (0x...)',
    }),
})

interface CreateTripleDialogProps {
    subjectId: string
    subjectLabel?: string
}

export function CreateTripleDialog({ subjectId, subjectLabel }: CreateTripleDialogProps) {
    const [open, setOpen] = useState(false)
    const createTripleMutation = useCreateTriple()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            predicateId: '',
            objectId: '',
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            await createTripleMutation.mutateAsync({
                subjectId: subjectId as `0x${string}`,
                predicateId: values.predicateId as `0x${string}`,
                objectId: values.objectId as `0x${string}`,
            })
            setOpen(false)
            form.reset()
        } catch (error) {
            console.error('Failed to create triple:', error)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm" className="gap-2">
                    <Plus className="h-4 w-4" /> Create Triple
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create Relationship</DialogTitle>
                    <DialogDescription>
                        Define a relationship starting from <strong>{subjectLabel || 'this atom'}</strong>.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                        <div className="text-sm font-medium mb-2">
                            Subject: <span className="text-muted-foreground">{subjectLabel || subjectId}</span>
                        </div>
                        <FormField
                            control={form.control}
                            name="predicateId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Predicate Atom ID</FormLabel>
                                    <FormControl>
                                        <Input placeholder="0x..." {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        The "verb" or relationship type (e.g. "is a", "works for").
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="objectId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Object Atom ID</FormLabel>
                                    <FormControl>
                                        <Input placeholder="0x..." {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        The target atom of this relationship.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button type="submit" disabled={createTripleMutation.isPending}>
                                {createTripleMutation.isPending ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Creating...
                                    </>
                                ) : (
                                    'Create Triple'
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
