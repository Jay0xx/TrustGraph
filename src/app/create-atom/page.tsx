'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useRouter } from 'next/navigation'
import { useAccount } from 'wagmi'
import { Button } from '@/components/ui/button'
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
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useCreateAtom } from '@/hooks/useCreateAtom'
import { toast } from 'react-hot-toast'
import { Loader2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

const formSchema = z.object({
    label: z.string().min(3, {
        message: 'Label must be at least 3 characters.',
    }),
    description: z.string().optional(),
})

export default function CreateAtomPage() {
    const router = useRouter()
    const { isConnected } = useAccount()
    const createAtomMutation = useCreateAtom()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            label: '',
            description: '',
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (!isConnected) {
            toast.error('Please connect your wallet first.')
            return
        }

        try {
            // Note: useCreateAtom current implementation only takes a string (label)
            // We will pass the label for now. If metadata is supported, we'd pass an object.
            const result = await createAtomMutation.mutateAsync(values.label)

            // The result usually contains the transaction hash or the new atom data
            // For now we'll assume success since the hook handles toast and redirection can happen here
            console.log('Atom creation result:', result)

            // In a real scenario, we might want to wait for the tx to be indexed to get the ID
            // But for the MVP, we'll just show success and maybe redirect to home or points
            router.push('/')
        } catch (error) {
            console.error('Failed to create atom:', error)
        }
    }

    return (
        <div className="container max-w-2xl mx-auto py-10 px-4">
            <Button asChild variant="ghost" className="mb-6 -ml-2">
                <Link href="/">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Search
                </Link>
            </Button>

            <Card className="border-2">
                <CardHeader>
                    <CardTitle className="text-2xl">Create New Atom</CardTitle>
                    <CardDescription>
                        Atoms are the building blocks of the TrustGraph. They can represent anything from people to concepts.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {!isConnected ? (
                        <div className="text-center py-10 space-y-4">
                            <p className="text-muted-foreground">You need to connect your wallet to create an atom.</p>
                            {/* Wallet connection is usually in Navbar, so just a reminder here */}
                        </div>
                    ) : (
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                <FormField
                                    control={form.control}
                                    name="label"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Label</FormLabel>
                                            <FormControl>
                                                <Input placeholder="e.g. Ethereum, Vitalik Buterin, Trustworthy" {...field} />
                                            </FormControl>
                                            <FormDescription>
                                                This is the display name of your atom.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Description (Optional)</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Provide some context about this atom..."
                                                    className="resize-none"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={createAtomMutation.isPending}
                                >
                                    {createAtomMutation.isPending ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Creating...
                                        </>
                                    ) : (
                                        'Create Atom'
                                    )}
                                </Button>
                            </form>
                        </Form>
                    )}
                </CardContent>
            </Card>

            <div className="mt-8 p-4 bg-primary/5 rounded-lg border border-primary/10">
                <h4 className="font-semibold text-sm mb-1 text-primary">Atom Creation Fee</h4>
                <p className="text-xs text-muted-foreground">
                    Creating an atom requires a small transaction on the testnet. You will be prompted to sign in your wallet.
                </p>
            </div>
        </div>
    )
}
