'use client'

import type React from 'react'
import { useState, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useWallet, type Wallet, WalletId } from '@txnlab/use-wallet-react'
import { Loader2 } from 'lucide-react'
import Account from './Account'
import { toast } from 'sonner'

interface WalletConnectModalProps {
  isOpen: boolean
  onClose: () => void
  onWalletSelect: (walletType: string) => void
}

const WalletConnectModal: React.FC<WalletConnectModalProps> = ({ isOpen, onClose, onWalletSelect }) => {
  const { wallets, activeAddress } = useWallet()
  const [connectingWallet, setConnectingWallet] = useState<string | null>(null)

  const isKmd = (wallet: Wallet) => wallet.id === WalletId.KMD

  // Clear connecting state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setConnectingWallet(null)
    }
  }, [isOpen])

  const handleWalletConnect = async (wallet: Wallet) => {
    try {
      setConnectingWallet(wallet.id)

      // Connect to the wallet - this will show the wallet's own QR code modal
      await wallet.connect()

      // If we get here, connection was successful
      onWalletSelect(isKmd(wallet) ? 'LocalNet Wallet' : wallet.metadata.name)
      onClose()
    } catch (error) {
      // Handle specific wallet connection errors
      if (error instanceof Error) {
        const errorMessage = error.message.toLowerCase()

        // These are expected errors when user closes the wallet modal
        if (
          errorMessage.includes('connect modal is closed by user') ||
          errorMessage.includes('user rejected') ||
          errorMessage.includes('user cancelled') ||
          errorMessage.includes('user denied') ||
          errorMessage.includes('cancelled by user')
        ) {
          // User cancelled - this is normal behavior, don't show error
          console.log('User cancelled wallet connection')
        } else if (
          errorMessage.includes('scheme does not have a registered handler') ||
          errorMessage.includes('perawallet-wc') ||
          errorMessage.includes('defly-wc')
        ) {
          // Wallet app not installed
          toast.error('Wallet app not found', {
            description: `Please install ${wallet.metadata.name} on your device or try using the browser extension`,
          })
        } else {
          // Actual connection error
          console.error('Wallet connection failed:', error)
          toast.error('Connection failed', {
            description: `Failed to connect to ${wallet.metadata.name}. Please try again.`,
          })
        }
      }
    } finally {
      setConnectingWallet(null)
    }
  }

  const handleLogout = async () => {
    try {
      if (wallets) {
        const activeWallet = wallets.find((w) => w.isActive)
        if (activeWallet) {
          await activeWallet.disconnect()
        } else {
          localStorage.removeItem('@txnlab/use-wallet:v3')
          window.location.reload()
        }
      }
    } catch (error) {
      console.error('Logout failed:', error)
    }
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="bg-card border-border/60 text-foreground sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Connect Wallet</DialogTitle>
              <DialogDescription>Select your preferred wallet to continue.</DialogDescription>
            </DialogHeader>
            <div className="space-y-3 pt-4">
              {activeAddress && (
                <>
                  <Account />
                  <div className="border-t my-4" />
                </>
              )}
              {!activeAddress &&
                wallets?.map((wallet) => (
                  <Button
                    key={wallet.id}
                    variant="secondary"
                    className="w-full justify-start py-6 text-base flex items-center"
                    onClick={() => handleWalletConnect(wallet)}
                    disabled={connectingWallet === wallet.id}
                  >
                    {connectingWallet === wallet.id ? (
                      <Loader2 className="w-5 h-5 animate-spin mr-4" />
                    ) : (
                      !isKmd(wallet) && (
                        <img
                          alt={`wallet_icon_${wallet.id}`}
                          src={wallet.metadata.icon || '/placeholder.svg'}
                          style={{
                            objectFit: 'contain',
                            width: '30px',
                            height: 'auto',
                            marginRight: '16px',
                          }}
                        />
                      )
                    )}
                    <span>{isKmd(wallet) ? 'LocalNet Wallet' : wallet.metadata.name}</span>
                  </Button>
                ))}
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
              {activeAddress && (
                <Button variant="destructive" onClick={handleLogout}>
                  Logout
                </Button>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  )
}

export default WalletConnectModal
