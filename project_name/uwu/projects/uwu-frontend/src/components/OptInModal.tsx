'use client'

import type React from 'react'
import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Loader2, CheckCircle } from 'lucide-react'
import { useWallet } from '@txnlab/use-wallet-react'
import { userOptIn } from '@/utils/methods'
import { toast } from 'sonner'

interface OptInModalProps {
  isOpen: boolean
  onClose: () => void
  onOptIn: () => void
  developerName?: string
}

const OptInModal: React.FC<OptInModalProps> = ({ isOpen, onClose, onOptIn, developerName }) => {
  const [isOptingIn, setIsOptingIn] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const { activeAddress, transactionSigner } = useWallet()

  const handleOptInClick = async () => {
    if (!activeAddress || !transactionSigner) {
      toast.error('Wallet not properly connected', {
        description: 'Please reconnect your wallet and try again',
      })
      return
    }

    setIsOptingIn(true)

    try {
      // Call the actual opt-in function
      const optInFunction = userOptIn(activeAddress, transactionSigner)
      const success = await optInFunction()

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

      // Handle specific wallet errors
      if (error instanceof Error) {
        const errorMessage = error.message.toLowerCase()

        if (
          errorMessage.includes('scheme does not have a registered handler') ||
          errorMessage.includes('perawallet-wc') ||
          errorMessage.includes('defly-wc')
        ) {
          toast.error('Wallet app not found', {
            description: 'Please install the Pera Wallet or Defly app on your device, or try using a different wallet',
          })
        } else if (
          errorMessage.includes('user rejected') ||
          errorMessage.includes('user cancelled') ||
          errorMessage.includes('cancelled by user')
        ) {
          toast.info('Transaction cancelled', {
            description: 'You cancelled the opt-in transaction',
          })
        } else {
          toast.error('Opt-in failed', {
            description: error.message || 'Please try again',
          })
        }
      }
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
                    Connected: {activeAddress ? `${activeAddress.slice(0, 8)}...${activeAddress.slice(-6)}` : 'No wallet connected'}
                  </p>
                </div>
                <DialogFooter>
                  <Button variant="secondary" onClick={handleClose} disabled={isOptingIn}>
                    Cancel
                  </Button>
                  <Button onClick={handleOptInClick} disabled={isOptingIn || !activeAddress || !transactionSigner}>
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
