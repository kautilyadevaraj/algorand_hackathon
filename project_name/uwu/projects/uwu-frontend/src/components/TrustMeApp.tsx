'use client'

import type React from 'react'
import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useWallet } from '@txnlab/use-wallet-react'
import HomePage from './HomePage'
import DeveloperProfile from './DeveloperProfile'
import Dashboard from './Dashboard'
import DeveloperOnboarding from './DeveloperOnboarding'
import WalletConnectModal from './WalletConnectModal'
import { mockDeveloperProfiles, type DeveloperProfile as DeveloperProfileType } from '@/data/mockData'
import { performOptIn, submitReview } from '@/utils/methods'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

type AppState = 'home' | 'profile' | 'dashboard' | 'developer-onboarding'

interface AppData {
  currentDeveloper?: string
  developerProfile?: DeveloperProfileType
  connectedWallet?: string
  isOptedIn: boolean
  userType?: 'developer' | 'user'
}

const TrustMeApp: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('home')
  const [appData, setAppData] = useState<AppData>({ isOptedIn: false })
  const [showWalletModal, setShowWalletModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const { activeAddress } = useWallet()

  // Search for a developer (user workflow)
  const handleSearch = async (query: string) => {
    setIsLoading(true)

    // Simulate API delay
    setTimeout(() => {
      const normalizedQuery = query.toLowerCase().trim()
      const developerProfile = mockDeveloperProfiles[normalizedQuery]

      if (developerProfile) {
        setAppData((prev) => ({
          ...prev,
          currentDeveloper: normalizedQuery,
          developerProfile,
          userType: 'user',
        }))
        setAppState('profile')
      } else {
        toast.error('Developer not found', {
          description: 'Try searching for: taufeeq.algo, kautilya.algo, trusted_dev.algo, or new_dev.algo',
        })
      }
      setIsLoading(false)
    }, 1000)
  }

  // Handle developer button click (developer workflow)
  const handleDeveloperClick = () => {
    if (!activeAddress) {
      toast.info('Please connect your wallet first', {
        description: 'You need to connect a wallet to access the developer dashboard',
      })
      setShowWalletModal(true)
      return
    }

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
      // For demo purposes, assume user is not opted in initially
      setAppData((prev) => ({
        ...prev,
        userType: 'developer',
        isOptedIn: false,
      }))

      setAppState('developer-onboarding')

      toast.info('Welcome to developer onboarding!', {
        description: 'Choose your username to get started',
      })
    } catch (error) {
      console.error('Error in developer onboarding:', error)
      toast.error('Error accessing developer features', {
        description: 'Please try again',
      })
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
      description: 'You can now access developer features',
    })

    proceedToDeveloperOnboarding()
  }

  // Handle developer opt-in with username
  const handleDeveloperOptIn = async (username: string) => {
    if (!activeAddress) return

    setIsLoading(true)

    try {
      const success = await performOptIn(activeAddress, username)

      if (success) {
        // Check if this is taufeeq.algo and use existing profile data
        let newProfile: DeveloperProfileType

        if (username === 'taufeeq.algo' && mockDeveloperProfiles['taufeeq.algo']) {
          // Use existing taufeeq.algo profile data
          newProfile = {
            ...mockDeveloperProfiles['taufeeq.algo'],
            address: activeAddress, // Update with connected wallet address
            isOptedIn: true,
          }
        } else {
          // Create a new profile for other usernames
          newProfile = {
            username,
            address: activeAddress,
            joinedDate: new Date().toISOString().split('T')[0],
            totalReviews: 0,
            positiveReviews: 0,
            negativeReviews: 0,
            trustScore: 0,
            isOptedIn: true,
            bio: 'New developer on the TrustMeBro platform',
            skills: [],
            projects: [],
            recentReviews: [],
          }
        }

        setAppData((prev) => ({
          ...prev,
          currentDeveloper: username,
          developerProfile: newProfile,
          isOptedIn: true,
        }))

        setAppState('dashboard')
      }
    } catch (error) {
      console.error('Opt-in failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle review submission (user workflow)
  const handleSubmitReview = async (isPositive: boolean, message: string) => {
    if (!appData.currentDeveloper) return

    setIsLoading(true)

    try {
      const reviewerAddress = activeAddress || 'anonymous_user'
      const success = await submitReview(appData.currentDeveloper, reviewerAddress, isPositive, message)

      if (success && appData.developerProfile) {
        // Update the profile with the new review
        const updatedProfile = {
          ...appData.developerProfile,
          totalReviews: appData.developerProfile.totalReviews + 1,
          positiveReviews: appData.developerProfile.positiveReviews + (isPositive ? 1 : 0),
          negativeReviews: appData.developerProfile.negativeReviews + (isPositive ? 0 : 1),
        }

        // Recalculate trust score
        updatedProfile.trustScore = Math.round((updatedProfile.positiveReviews / updatedProfile.totalReviews) * 100)

        setAppData((prev) => ({
          ...prev,
          developerProfile: updatedProfile,
        }))
      }
    } catch (error) {
      console.error('Review submission failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Navigate back to home
  const handleBackToHome = () => {
    setAppState('home')
    setAppData({ isOptedIn: false })
  }

  // Navigate to dashboard (for already opted-in developers)
  const handleGoToDashboard = () => {
    setAppState('dashboard')
  }

  // Loading overlay component
  const LoadingOverlay = () => (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-8 h-8 text-white/50 animate-spin mx-auto mb-2" />
        <p className="text-white/70 text-sm">Processing...</p>
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

        {appState === 'profile' && appData.currentDeveloper && appData.developerProfile && (
          <motion.div
            key="profile"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <DeveloperProfile profile={appData.developerProfile} onBack={handleBackToHome} onSubmitReview={handleSubmitReview} />
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
              onOptIn={handleDeveloperOptIn}
              onGoToDashboard={handleGoToDashboard}
              onBack={handleBackToHome}
            />
          </motion.div>
        )}

        {appState === 'dashboard' && appData.currentDeveloper && appData.developerProfile && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Dashboard developerName={appData.currentDeveloper} data={appData.developerProfile} onBack={handleBackToHome} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modals */}
      <WalletConnectModal isOpen={showWalletModal} onClose={() => setShowWalletModal(false)} onWalletSelect={handleWalletSelect} />
    </div>
  )
}

export default TrustMeApp
