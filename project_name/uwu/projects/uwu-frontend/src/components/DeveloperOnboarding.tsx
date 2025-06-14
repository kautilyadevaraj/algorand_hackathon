'use client'

import type React from 'react'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft, CheckCircle, Shield, Users, TrendingUp, Wallet, User } from 'lucide-react'

interface DeveloperOnboardingProps {
  walletAddress: string
  isOptedIn: boolean
  onOptIn: (username: string) => void
  onGoToDashboard: () => void
  onBack: () => void
}

const DeveloperOnboarding: React.FC<DeveloperOnboardingProps> = ({ walletAddress, isOptedIn, onOptIn, onGoToDashboard, onBack }) => {
  const [username, setUsername] = useState('')
  const [isValidUsername, setIsValidUsername] = useState(false)

  const formatAddress = (address: string) => {
    return `${address.slice(0, 8)}...${address.slice(-6)}`
  }

  const handleUsernameChange = (value: string) => {
    setUsername(value)
    // Simple validation: must end with .algo and be at least 5 characters
    const isValid = value.endsWith('.algo') && value.length >= 5 && value.length <= 20
    setIsValidUsername(isValid)
  }

  const handleOptIn = () => {
    if (isValidUsername) {
      onOptIn(username)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <Button variant="ghost" onClick={onBack} className="text-muted-foreground hover:text-white mb-6 px-0">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <Card className="bg-card border-border/60">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-medium text-foreground mb-2">Welcome to TrustMeBro Developer Network</CardTitle>
            <div className="flex items-center justify-center gap-2 mb-4">
              <Wallet className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground font-mono">{formatAddress(walletAddress)}</span>
              {isOptedIn && (
                <Badge variant="secondary" className="text-green-400">
                  Opted In
                </Badge>
              )}
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Benefits Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-foreground">What you get as a developer:</h3>
              <div className="grid gap-4">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">Build Trust & Reputation</p>
                    <p className="text-sm text-muted-foreground">
                      Receive positive and negative review tokens that build your on-chain reputation
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">Community Recognition</p>
                    <p className="text-sm text-muted-foreground">
                      Get recognized by the Algorand developer community for your contributions
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <TrendingUp className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">Track Your Progress</p>
                    <p className="text-sm text-muted-foreground">Monitor your reputation score and see how others perceive your work</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Section */}
            <div className="border-t pt-6">
              {isOptedIn ? (
                <div className="text-center space-y-4">
                  <div className="flex items-center justify-center gap-2 text-green-400">
                    <CheckCircle className="w-6 h-6" />
                    <span className="text-lg font-medium">You're already part of the network!</span>
                  </div>
                  <p className="text-muted-foreground">
                    Your wallet is opted in to the TrustMeBro network. You can access your developer dashboard to manage your reputation.
                  </p>
                  <Button onClick={onGoToDashboard} className="w-full" size="lg">
                    Go to Dashboard
                  </Button>
                </div>
              ) : (
                <div className="text-center space-y-4">
                  <h3 className="text-lg font-medium text-foreground">Choose Your Username</h3>
                  <p className="text-muted-foreground">
                    Choose a unique username that others will use to find and review your work on the platform.
                  </p>

                  <div className="space-y-2 text-left max-w-md mx-auto">
                    <Label htmlFor="username" className="text-sm font-medium">
                      Username
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="username"
                        type="text"
                        placeholder="yourname.algo"
                        value={username}
                        onChange={(e) => handleUsernameChange(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    {username && !isValidUsername && (
                      <p className="text-sm text-red-400">Username must end with .algo and be 5-20 characters long</p>
                    )}
                    {isValidUsername && <p className="text-sm text-green-400">Great! This username looks good</p>}
                  </div>

                  <div className="bg-secondary/20 border border-border/30 rounded-lg p-4">
                    <p className="text-sm text-muted-foreground">
                      <strong>Note:</strong> Opting in requires a small transaction fee and will create an asset opt-in transaction on the
                      Algorand blockchain.
                    </p>
                  </div>

                  <Button onClick={handleOptIn} className="w-full" size="lg" disabled={!isValidUsername}>
                    Opt-In to TrustMeBro Network
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

export default DeveloperOnboarding
