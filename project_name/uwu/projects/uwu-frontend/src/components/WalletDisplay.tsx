'use client'

import type React from 'react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Wallet, ChevronDown, Copy, ExternalLink, LogOut } from 'lucide-react'
import { useWallet, WalletId } from '@txnlab/use-wallet-react'
import { toast } from 'sonner'

interface WalletDisplayProps {
  onConnectWallet: () => void
}

const WalletDisplay: React.FC<WalletDisplayProps> = ({ onConnectWallet }) => {
  const { activeAddress, wallets } = useWallet()
  const [isOpen, setIsOpen] = useState(false)

  const activeWallet = wallets?.find((w) => w.isActive)
  const isKmd = activeWallet?.id === WalletId.KMD

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const copyAddress = async () => {
    if (activeAddress) {
      await navigator.clipboard.writeText(activeAddress)
      toast.success('Address copied to clipboard')
    }
  }

  const viewOnExplorer = () => {
    if (activeAddress) {
      // You can customize this URL based on your network
      const explorerUrl = `https://testnet.algoexplorer.io/address/${activeAddress}`
      window.open(explorerUrl, '_blank')
    }
  }

  const handleDisconnect = async () => {
    if (activeWallet) {
      await activeWallet.disconnect()
      setIsOpen(false)
    }
  }

  if (!activeAddress) {
    return (
      <Button
        onClick={onConnectWallet}
        variant="outline"
        size="sm"
        className="text-muted-foreground hover:text-white border-muted-foreground/30 hover:border-white/30 flex items-center gap-2 transition-all duration-200 hover:bg-white/5"
      >
        <Wallet className="w-4 h-4" />
        Connect Wallet
      </Button>
    )
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center gap-3 bg-secondary/20 hover:bg-secondary/30 transition-colors duration-200 rounded-lg px-3 py-2 border border-border/30 h-auto"
        >
          {/* Wallet Logo */}
          {!isKmd && activeWallet?.metadata?.icon ? (
            <img
              src={activeWallet.metadata.icon || '/placeholder.svg'}
              alt={`${activeWallet.metadata.name} logo`}
              className="w-6 h-6 rounded-full object-contain flex-shrink-0"
            />
          ) : (
            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
              <Wallet className="w-4 h-4 text-primary" />
            </div>
          )}

          {/* Wallet Info */}
          <div className="flex flex-col items-start min-w-0">
            <span className="text-xs text-muted-foreground font-medium leading-tight">
              {isKmd ? 'LocalNet' : activeWallet?.metadata?.name || 'Wallet'}
            </span>
            <span className="text-sm text-foreground font-mono leading-tight">{formatAddress(activeAddress)}</span>
          </div>

          <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <div className="px-2 py-1.5">
          <div className="flex items-center gap-2">
            {!isKmd && activeWallet?.metadata?.icon ? (
              <img
                src={activeWallet.metadata.icon || '/placeholder.svg'}
                alt={`${activeWallet.metadata.name} logo`}
                className="w-5 h-5 rounded-full object-contain"
              />
            ) : (
              <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                <Wallet className="w-3 h-3 text-primary" />
              </div>
            )}
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-medium">{isKmd ? 'LocalNet Wallet' : activeWallet?.metadata?.name || 'Wallet'}</span>
              <span className="text-xs text-muted-foreground font-mono">{formatAddress(activeAddress)}</span>
            </div>
          </div>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={copyAddress} className="cursor-pointer">
          <Copy className="w-4 h-4 mr-2" />
          Copy Address
        </DropdownMenuItem>

        <DropdownMenuItem onClick={viewOnExplorer} className="cursor-pointer">
          <ExternalLink className="w-4 h-4 mr-2" />
          View on Explorer
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={handleDisconnect} className="cursor-pointer text-red-400 focus:text-red-400 focus:bg-red-400/10">
          <LogOut className="w-4 h-4 mr-2" />
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default WalletDisplay
