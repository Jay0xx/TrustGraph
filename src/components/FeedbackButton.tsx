'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { MessageSquarePlus } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FeedbackButtonProps {
    className?: string
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
}

export function FeedbackButton({ className, variant = "outline" }: FeedbackButtonProps) {
    return (
        <Button asChild variant={variant} className={cn("gap-2", className)}>
            <a
                href="https://docs.google.com/forms/d/e/1FAIpQLSf7mtgMIpaF5PFAmstxpFoL9Fh5HB6ETD7cwnzl-kiowzI5WQ/viewform"
                target="_blank"
                rel="noopener noreferrer"
            >
                <MessageSquarePlus className="h-4 w-4" />
                Report Bug / Feedback
            </a>
        </Button>
    )
}
