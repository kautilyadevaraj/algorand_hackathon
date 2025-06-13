/* eslint-disable @typescript-eslint/no-unused-vars */
import AppCalls from '@/components/AppCalls'
import ConnectWallet from '@/components/ConnectWallet'
import Transact from '@/components/Transact'
import { Button } from '@/components/ui/button'
import { createAsset, createRandomAccount, recoverAccountFromMnemonic } from '@/utils/methods'
import { useWallet } from '@txnlab/use-wallet-react'
import { secretKeyToMnemonic } from 'algosdk'
import { useState } from 'react'

export const HomePage = () => {
  const [openWalletModal, setOpenWalletModal] = useState<boolean>(false)
  const [openDemoModal, setOpenDemoModal] = useState<boolean>(false)
  const [appCallsDemoModal, setAppCallsDemoModal] = useState<boolean>(false)
  const [accountInfo, setAccountInfo] = useState<{ address: string; mnemonic?: string } | null>(null) // State to display account info

  const { activeAddress } = useWallet()

  const toggleWalletModal = () => {
    setOpenWalletModal(!openWalletModal)
  }

  const toggleDemoModal = () => {
    setOpenDemoModal(!openDemoModal)
  }

  const toggleAppCallsModal = () => {
    setAppCallsDemoModal(!appCallsDemoModal)
  }
  const handleCreateRandomAccount = () => {
    try {
      const newAccount = createRandomAccount()
      const mnemonic = secretKeyToMnemonic(newAccount.account.sk) // Corrected mnemonic access
      setAccountInfo({ address: String(newAccount.addr), mnemonic: mnemonic }) // Explicitly convert to string
      alert(`New Account Created!\nAddress: ${newAccount.addr}\nMnemonic: ${mnemonic}`)
    } catch (error) {
      console.error('Error creating random account:', error)
      alert('Failed to create random account.')
    }
  }

  const handleRecoverAccount = () => {
    const mnemonicInput = prompt('Enter your 25-word mnemonic to recover account:')
    if (mnemonicInput) {
      try {
        const recoveredAccount = recoverAccountFromMnemonic(mnemonicInput)
        setAccountInfo({ address: String(recoveredAccount.addr) }) // Explicitly convert to string
        alert(`Account Recovered!\nAddress: ${recoveredAccount.addr}`)
      } catch (error) {
        console.error('Error recovering account:', error)
        alert('Failed to recover account. Please check your mnemonic.')
      }
    }
  }

  return (
    <div className="hero min-h-screen bg-teal-400">
      <div className="hero-content text-center rounded-lg p-6 max-w-md bg-white mx-auto">
        <div className="max-w-md">
          <h1 className="text-4xl">
            Welcome to <div className="font-bold">AlgoKit 🙂</div>
          </h1>
          <p className="py-6">
            This starter has been generated using official AlgoKit React template. Refer to the resource below for next steps.
          </p>

          <div className="grid">
            <a
              data-test-id="getting-started"
              className="btn btn-primary m-2"
              target="_blank"
              href="https://github.com/algorandfoundation/algokit-cli"
            >
              Getting started
            </a>

            <div className="divider" />
            <button data-test-id="connect-wallet" className="btn m-2" onClick={toggleWalletModal}>
              Wallet Connection
            </button>

            {/* New buttons for standalone account management */}
            <button className="btn m-2" onClick={handleCreateRandomAccount}>
              Create New Standalone Account
            </button>
            <button className="btn m-2" onClick={handleRecoverAccount}>
              Recover Account from Mnemonic
            </button>

            {activeAddress && (
              <button data-test-id="transactions-demo" className="btn m-2" onClick={toggleDemoModal}>
                Transactions Demo
              </button>
            )}

            {activeAddress && (
              <button data-test-id="appcalls-demo" className="btn m-2" onClick={toggleAppCallsModal}>
                Contract Interactions Demo
              </button>
            )}
          </div>

          {accountInfo && (
            <div className="mt-4 p-4 border rounded-lg bg-gray-100 text-left">
              <h2 className="text-lg font-bold">Account Details:</h2>
              <p>
                <strong>Address:</strong> {accountInfo.address}
              </p>
              {accountInfo.mnemonic && (
                <p>
                  <strong>Mnemonic:</strong> {accountInfo.mnemonic}
                </p>
              )}
              <p className="text-sm text-red-600 mt-2">
                Remember to fund this account with at least 0.1 Algo (100,000 microAlgos) before it can participate in transactions.
              </p>
            </div>
          )}

          <ConnectWallet openModal={openWalletModal} closeModal={toggleWalletModal} />

          <div>
            <Button onClick={() => createAsset()}>Click Me</Button>
          </div>

          <Transact openModal={openDemoModal} setModalState={setOpenDemoModal} />
          <AppCalls openModal={appCallsDemoModal} setModalState={setAppCallsDemoModal} />
        </div>
      </div>
    </div>
  )
}
