'use client'

import type React from 'react'
import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Loader2, CheckCircle } from 'lucide-react'
import { useOptInAsset } from './hooks/useOptInAsset'

interface OptInModalProps {
  isOpen: boolean
  onClose: () => void
  onOptIn: () => void
  developerName?: string
}

const OptInModal: React.FC<OptInModalProps> = ({ isOpen, onClose, onOptIn, developerName }) => {
  const [isOptingIn, setIsOptingIn] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const { sender, isReady, optIn } = useOptInAsset()

  const handleOptInClick = async () => {
    if (!isReady) return

    setIsOptingIn(true)

    try {
      const success = await optIn()

      if (success) {
        setIsOptingIn(false)
        setIsSuccess(true)

        // Show success state for 1.5 seconds then proceed
        setTimeout(() => {
          onOptIn()
          onClose()
          // Reset state for next time
          setTimeout(() => {
            setIsSuccess(false)
          }, 500)
        }, 1500)
      } else {
        // If opt-in failed, reset the loading state
        setIsOptingIn(false)
      }
    } catch (error) {
      console.error('Opt-in failed:', error)
      setIsOptingIn(false)
    }
  }

  const handleClose = () => {
    if (!isOptingIn) {
      onClose()
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={handleClose}>
          <DialogContent className="bg-card border-border/60 text-foreground">
            <DialogHeader>
              <DialogTitle>Join the TrustMeBro Network</DialogTitle>
              <DialogDescription>Opt-in to the TrustMeBro network to build your public reputation as a developer.</DialogDescription>
            </DialogHeader>

            {isSuccess ? (
              <div className="flex flex-col items-center justify-center space-y-4 py-8">
                <CheckCircle className="w-16 h-16 text-green-400" />
                <p className="text-lg font-medium">Successfully Opted-In!</p>
                <p className="text-sm text-muted-foreground">Redirecting to your dashboard...</p>
              </div>
            ) : (
              <>
                <div className="py-4 text-sm text-muted-foreground space-y-2">
                  <p>By opting in, you'll be able to:</p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>Receive "Positive" and "Negative" review tokens</li>
                    <li>Build your reputation on the Algorand blockchain</li>
                    <li>Access your developer dashboard</li>
                  </ul>
                  <p className="font-mono text-xs text-foreground bg-secondary p-2 rounded-md mt-3">
                    Connected: {sender ? `${sender.slice(0, 8)}...${sender.slice(-6)}` : 'No wallet connected'}
                  </p>
                </div>
                <DialogFooter>
                  <Button variant="secondary" onClick={handleClose} disabled={isOptingIn}>
                    Cancel
                  </Button>
                  <Button onClick={handleOptInClick} disabled={isOptingIn || !isReady}>
                    {isOptingIn && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isOptingIn ? 'Opting In...' : 'Confirm Opt-In'}
                  </Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  )
}

export default OptInModal
