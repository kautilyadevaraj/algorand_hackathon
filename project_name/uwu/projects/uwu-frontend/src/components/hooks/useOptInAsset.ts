'use client'

import { useCallback } from 'react'
import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import { toast } from 'sonner'
import { useWallet } from '@txnlab/use-wallet-react'

const algorand = AlgorandClient.testNet()
const ASSET_ID = 123n

export function useOptInAsset() {
  const { activeAddress: sender, signer: transactionSigner } = useWallet()

  const optIn = useCallback(async () => {
    if (!sender || !transactionSigner) {
      toast.error('Wallet not connected', { id: 'opt-in' })
      return false
    }

    // register the signer for this account
    algorand.account.setSigner(sender, transactionSigner)

    try {
      toast.loading('Opting in to TrustMeBro network…', { id: 'opt-in' })

      await algorand.send.assetOptIn({
        sender,
        assetId: ASSET_ID,
      })

      toast.success('Opt‑in successful!', {
        id: 'opt-in',
        description: `Account ${sender.slice(0, 6)}…${sender.slice(-4)} is now opted in.`,
      })

      return true
    } catch (err) {
      console.error('Opt‑in error:', err)
      const msg = err instanceof Error ? err.message : 'Please try again'
      toast.error('Opt‑in failed', { id: 'opt-in', description: msg })
      return false
    }
  }, [sender, transactionSigner])

  return {
    sender,
    isReady: !!sender && !!transactionSigner,
    optIn,
  }
}
