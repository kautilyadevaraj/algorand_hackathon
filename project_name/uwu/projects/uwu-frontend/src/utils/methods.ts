import { AlgorandClient, algo } from '@algorandfoundation/algokit-utils'
import { secretKeyToMnemonic } from 'algosdk'
import { toast } from 'sonner'
import { TrustMeBroClient } from '@/contracts/TrustMeBro'
// // import { AlgodClient } from 'algosdk/dist/types/client/v2/algod/algod'
// // import algosdk from 'algosdk'
import { algos } from '@algorandfoundation/algokit-utils'
const algorand = AlgorandClient.testNet()
import { TransactionSigner } from 'algosdk'



/**
 * Creates a new random Algorand account.
 * In a production environment, ensure the mnemonic is securely stored and managed,
 * as it provides full control over the account.
 * Also, remember to fund this account with at least 0.1 Algo (100,000 microAlgos)
 * before it can participate in transactions.
 */
export const createRandomAccount = () => {
  const randomAccount = algorand.account.random()
  const mnemonic = secretKeyToMnemonic(randomAccount.account.sk)
  console.log('Random Account Address:', randomAccount.addr)
  console.log('Random Account Mnemonic (KEEP THIS SAFE!):', mnemonic)
  return randomAccount
}

export const createAsset = async () => {
  const localNetDispenser = await algorand.account.localNetDispenser()
  const randomAccount = algorand.account.random()
  await algorand.account.ensureFunded(randomAccount.addr, localNetDispenser, algo(1))
  // Basic example
  const result = await algorand.send.assetCreate({ sender: randomAccount.addr, total: 100n })

  console.log(result)

  // // Advanced example
  // const result2 = await algorand.send.assetCreate({
  //   sender: randomAccount.addr,
  //   total: 100n,
  //   decimals: 2,
  //   assetName: 'asset',
  //   unitName: 'unit',
  //   url: 'url',
  //   metadataHash: 'metadataHash',
  //   defaultFrozen: false,
  //   manager: 'MANAGERADDRESS',
  //   reserve: 'RESERVEADDRESS',
  //   freeze: 'FREEZEADDRESS',
  //   clawback: 'CLAWBACKADDRESS',
  //   lease: 'lease',
  //   note: 'note',
  //   // You wouldn't normally set this field
  //   firstValidRound: 1000n,
  //   validityWindow: 10,
  //   extraFee: (1000).microAlgo(),
  //   staticFee: (1000).microAlgo(),
  //   // Max fee doesn't make sense with extraFee AND staticFee
  //   //  already specified, but here for completeness
  //   maxFee: (3000).microAlgo(),
  //   // Signer only needed if you want to provide one,
  //   //  generally you'd register it with AlgorandClient
  //   //  against the sender and not need to pass it in
  //   maxRoundsToWaitForConfirmation: 5,
  //   suppressLog: true,
  // })

  // console.log(result2)
}

/**
 * Recovers an Algorand account from a 25-word mnemonic phrase.
 * This is useful for restoring access to an existing account.
 */
export const recoverAccountFromMnemonic = (mnemonic: string) => {
  try {
    const account = algorand.account.fromMnemonic(mnemonic)
    console.log('Recovered Account Address:', account.addr)
    return account
  } catch (error) {
    console.error('Error recovering account from mnemonic:', error)
    throw error
  }
}

export function userOptIn(sender: string, transactionSigner: TransactionSigner) {
  return async () => {
    const assetId: bigint = 123n;
    algorand.account.setSigner(sender, transactionSigner)

    try {
      toast.loading('Opting in to TrustMeBro network...', {
        id: 'opt-in-loading',
      })

      const newClient = new TrustMeBroClient({ appId: 741161696n, algorand, defaultSigner: transactionSigner })

      const mbrpay = await algorand.createTransaction.payment({
        sender,
        receiver: 'BMD6GKBZT5O3JAVRUO5M3R7XDDRIMI4U5J7OLBK47YQDFS2FFOKOTMPRUQ',
        amount: algos(0.1 + 0.1),
        extraFee: algos(0.001),
      })

      await newClient.send.userOptIn({ args: [mbrpay], sender: sender, assetReferences: [assetId] })


      toast.success(`Successfully opted in to TrustMeBro network!`, {
        id: 'opt-in-loading',
        description: `Account ${sender.slice(0, 6)}...${sender.slice(-4)} is now part of the network`,
      })

      return true
    } catch (error) {
      console.error('Error opting in:', error)

      toast.error('Failed to opt in to TrustMeBro network', {
        id: 'opt-in-loading',
        description: error instanceof Error ? error.message : 'Please try again',
      })

      return false
    }
  }
}

export async function checkUserOptInStatus(address: string): Promise<boolean> {
  const assetId: bigint = 123n

  try {
    console.log(`Checking opt-in status for address: ${address}`)
    console.log(`Asset ID: ${assetId}`)

    const accountInfo = await algorand.asset.getAccountInformation(address, assetId)

    console.log('Account asset information:', accountInfo)

    // For now, we'll assume the user is opted in if we get any response
    // You can modify this condition based on the actual response structure
    const isOptedIn = accountInfo !== null && accountInfo !== undefined

    console.log(`User opt-in status: ${isOptedIn}`)

    return isOptedIn
  } catch (error) {
    console.error('Error checking opt-in status:', error)

    // Handle specific wallet errors
    if (error instanceof Error) {
      const errorMessage = error.message.toLowerCase()

      if (
        errorMessage.includes('scheme does not have a registered handler') ||
        errorMessage.includes('perawallet-wc') ||
        errorMessage.includes('defly-wc')
      ) {
        toast.error('Wallet app not installed', {
          id: 'opt-in-loading',
          description: 'Please install the wallet app on your device or try a different wallet',
        })
      } else if (
        errorMessage.includes('user rejected') ||
        errorMessage.includes('user cancelled') ||
        errorMessage.includes('cancelled by user')
      ) {
        toast.info('Transaction cancelled', {
          id: 'opt-in-loading',
          description: 'You cancelled the opt-in transaction',
        })
      } else {
        toast.error('Failed to opt in to TrustMeBro network', {
          id: 'opt-in-loading',
          description: error.message || 'Please try again',
        })
      }
    } else {
      toast.error('Failed to opt in to TrustMeBro network', {
        id: 'opt-in-loading',
        description: 'An unexpected error occurred. Please try again',
      })
    }
    return false
  }
}
