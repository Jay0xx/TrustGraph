'use client'

import * as React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { Toaster } from 'react-hot-toast'
import { config } from '@/lib/wagmi'
import { TooltipProvider } from '@/components/ui/tooltip'
import { IntuitionProvider } from '@/context/IntuitionContext'
import { useAccount, useSwitchChain } from 'wagmi'
import { intuitionTestnet } from '@/lib/chains'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

import '@rainbow-me/rainbowkit/styles.css'

function ChainGuard({ children }: { children: React.ReactNode }) {
    const { isConnected, chainId } = useAccount()
    const { switchChain, isPending } = useSwitchChain()

    const isWrongChain = isConnected && chainId !== intuitionTestnet.id

    if (isWrongChain) {
        return (
            <>
                <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] w-full max-w-md px-4 pointer-events-none">
                    <Alert variant="destructive" className="shadow-2xl border-2 pointer-events-auto">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle className="font-bold">Wrong Network</AlertTitle>
                        <AlertDescription className="space-y-3">
                            <p>TrustGraph Beta only supports the <strong>Intuition Testnet</strong> (Chain ID 13579).</p>
                            <Button
                                size="sm"
                                variant="outline"
                                className="w-full bg-background text-destructive hover:bg-destructive/10 border-destructive/20"
                                onClick={() => switchChain({ chainId: intuitionTestnet.id })}
                                disabled={isPending}
                            >
                                {isPending ? (
                                    <RefreshCw className="mr-2 h-3 w-3 animate-spin" />
                                ) : (
                                    <AlertCircle className="mr-2 h-3 w-3" />
                                )}
                                Switch to Intuition Testnet
                            </Button>
                        </AlertDescription>
                    </Alert>
                </div>
                {children}
            </>
        )
    }

    return <>{children}</>
}

const queryClient = new QueryClient()

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <NextThemesProvider
                    attribute="class"
                    defaultTheme="dark"
                    enableSystem
                    disableTransitionOnChange
                >
                    <RainbowKitProvider theme={darkTheme()}>
                        <IntuitionProvider>
                            <TooltipProvider>
                                <ChainGuard>
                                    {children}
                                </ChainGuard>
                            </TooltipProvider>
                            <Toaster position="bottom-right" />
                        </IntuitionProvider>
                    </RainbowKitProvider>
                </NextThemesProvider>
            </QueryClientProvider>
        </WagmiProvider>
    )
}
