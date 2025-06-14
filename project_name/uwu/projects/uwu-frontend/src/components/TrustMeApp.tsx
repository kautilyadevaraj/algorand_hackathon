import type React from 'react'
import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useWallet } from '@txnlab/use-wallet-react'
import HomePage from './HomePage'
import ResultsDisplay from './ResultsDisplay'
import Dashboard from './Dashboard'
import DeveloperOnboarding from './DeveloperOnboarding'
import WalletConnectModal from './WalletConnectModal'
import OptInModal from './OptInModal'
import { mockDeveloperData, type DeveloperData } from '@/data/mockData'
import { checkUserOptInStatus } from '@/utils/methods'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

type AppState = 'home' | 'results' | 'dashboard' | 'developer-onboarding'

interface AppData {
  currentDeveloper?: string
  developerData?: DeveloperData
  connectedWallet?: string
  isOptedIn: boolean
}

const TrustMeApp: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('home')
  const [appData, setAppData] = useState<AppData>({ isOptedIn: false })
  const [showWalletModal, setShowWalletModal] = useState(false)
  const [showOptInModal, setShowOptInModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const { activeAddress } = useWallet()

  // Search for a developer
  const handleSearch = async (query: string) => {
    setIsLoading(true)

    // Simulate API delay
    setTimeout(() => {
      const normalizedQuery = query.toLowerCase().trim()
      const developerData = mockDeveloperData[normalizedQuery]

      if (developerData) {
        setAppData((prev) => ({
          ...prev,
          currentDeveloper: normalizedQuery,
          developerData,
        }))
        setAppState('results')
      } else {
        toast.error('Developer not found', {
          description: 'Try searching for: trusted_dev.algo, risky_dev.algo, new_dev.algo, or unregistered_dev.algo',
        })
      }
      setIsLoading(false)
    }, 1000)
  }

  // Handle developer button click (wallet connection flow)
  const handleDeveloperClick = () => {
    if (!activeAddress) {
      // If wallet is not connected, show wallet modal
      toast.info('Please connect your wallet first', {
        description: 'You need to connect a wallet to access the developer dashboard',
      })
      setShowWalletModal(true)
      return
    }

    // If wallet is connected, go to developer onboarding
    proceedToDeveloperOnboarding()
  }

  // Handle connect wallet button click
  const handleConnectWallet = () => {
    setShowWalletModal(true)
  }

  // Proceed to developer onboarding after wallet connection
  const proceedToDeveloperOnboarding = async () => {
    if (!activeAddress) return

    setIsLoading(true)

    try {
      console.log('Checking opt-in status for connected wallet...')

      // Check if the user is actually opted in on the blockchain
      const isOptedIn = await checkUserOptInStatus(activeAddress)

      console.log(`Opt-in status result: ${isOptedIn}`)

      // For demo purposes, we'll still use mock developer data for the dashboard
      // In a real app, you'd fetch this data based on the wallet address
      const connectedDeveloper = 'trusted_dev.algo' // This would be derived from activeAddress
      const developerData = mockDeveloperData[connectedDeveloper]

      setAppData((prev) => ({
        ...prev,
        currentDeveloper: connectedDeveloper,
        developerData,
        isOptedIn: isOptedIn, // Use real blockchain data
      }))

      // Always show developer onboarding page first
      // The onboarding page will handle showing the appropriate UI based on opt-in status
      setAppState('developer-onboarding')

      if (isOptedIn) {
        toast.success('Wallet connected!', {
          description: 'Your wallet is already opted in to the TrustMeBro network',
        })
      } else {
        toast.info('Wallet connected!', {
          description: 'You can now opt-in to the TrustMeBro network',
        })
      }
    } catch (error) {
      console.error('Error checking opt-in status:', error)
      toast.error('Error checking wallet status', {
        description: 'Please try again',
      })

      // On error, assume not opted in and show onboarding
      setAppData((prev) => ({
        ...prev,
        currentDeveloper: 'unknown_dev.algo',
        developerData: mockDeveloperData['new_dev.algo'], // Use new dev as fallback
        isOptedIn: false,
      }))
      setAppState('developer-onboarding')
    } finally {
      setIsLoading(false)
    }
  }

  // Handle wallet selection
  const handleWalletSelect = (walletType: string) => {
    setShowWalletModal(false)
    setAppData((prev) => ({
      ...prev,
      connectedWallet: walletType,
    }))

    toast.success(`${walletType} connected successfully!`, {
      description: 'Checking your opt-in status...',
    })

    // Proceed to developer onboarding after wallet connection
    proceedToDeveloperOnboarding()
  }

  // Handle manual opt-in request from developer onboarding
  const handleOptInRequest = () => {
    setShowOptInModal(true)
  }

  // Handle opt-in completion
  const handleOptInComplete = () => {
    setAppData((prev) => ({
      ...prev,
      isOptedIn: true,
    }))
    setAppState('dashboard')
  }

  // Navigate back to home
  const handleBackToHome = () => {
    setAppState('home')
    setAppData({ isOptedIn: false })
  }

  // Navigate to dashboard (for already opted-in users)
  const handleGoToDashboard = () => {
    setAppState('dashboard')
  }

  // Loading overlay component
  const LoadingOverlay = () => (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-8 h-8 text-white/50 animate-spin mx-auto mb-2" />
        <p className="text-white/70 text-sm">Checking wallet status...</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-black text-foreground relative">
      {/* Loading Overlay */}
      {isLoading && <LoadingOverlay />}

      {/* Main Content */}
      <AnimatePresence mode="wait">
        {appState === 'home' && (
          <motion.div key="home" exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
            <HomePage onSearch={handleSearch} onDeveloperClick={handleDeveloperClick} onConnectWallet={handleConnectWallet} />
          </motion.div>
        )}

        {appState === 'results' && appData.currentDeveloper && appData.developerData && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <ResultsDisplay developerName={appData.currentDeveloper} data={appData.developerData} onBack={handleBackToHome} />
          </motion.div>
        )}

        {appState === 'developer-onboarding' && (
          <motion.div
            key="developer-onboarding"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <DeveloperOnboarding
              walletAddress={activeAddress || ''}
              isOptedIn={appData.isOptedIn}
              onOptIn={handleOptInRequest}
              onGoToDashboard={handleGoToDashboard}
              onBack={handleBackToHome}
            />
          </motion.div>
        )}

        {appState === 'dashboard' && appData.currentDeveloper && appData.developerData && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Dashboard developerName={appData.currentDeveloper} data={appData.developerData} onBack={handleBackToHome} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modals */}
      <WalletConnectModal isOpen={showWalletModal} onClose={() => setShowWalletModal(false)} onWalletSelect={handleWalletSelect} />

      <OptInModal
        isOpen={showOptInModal}
        onClose={() => setShowOptInModal(false)}
        onOptIn={handleOptInComplete}
        developerName={appData.currentDeveloper}
      />
    </div>
  )
}

export default TrustMeApp
