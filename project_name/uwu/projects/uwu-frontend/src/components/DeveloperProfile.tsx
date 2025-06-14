'use client'

import type React from 'react'
import { useState } from 'react'
import { motion, animate } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  HelpCircle,
  ThumbsUp,
  ThumbsDown,
  User,
  Calendar,
  Award,
  MessageSquare,
  TrendingUp,
  Star,
} from 'lucide-react'
import { type DeveloperProfile as DeveloperProfileType, getTrustVerdict } from '@/data/mockData'
import { useEffect } from 'react'

interface DeveloperProfileProps {
  profile: DeveloperProfileType
  onBack: () => void
  onSubmitReview: (isPositive: boolean, message: string) => void
}

const DeveloperProfile: React.FC<DeveloperProfileProps> = ({ profile, onBack, onSubmitReview }) => {
  const [animatedScore, setAnimatedScore] = useState(0)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [reviewMessage, setReviewMessage] = useState('')
  const [selectedReviewType, setSelectedReviewType] = useState<boolean | null>(null)

  const verdict = getTrustVerdict(profile.totalReviews, profile.positiveReviews / profile.totalReviews)

  // Animated counter
  useEffect(() => {
    if (profile.trustScore === 0) {
      setAnimatedScore(0)
      return
    }
    const controls = animate(0, profile.trustScore, {
      duration: 1,
      onUpdate(value: number) {
        setAnimatedScore(Math.round(value))
      },
    })
    return () => controls.stop()
  }, [profile.trustScore])

  const getVerdictConfig = () => {
    switch (verdict) {
      case 'trusted':
        return {
          text: 'Trusted Developer',
          icon: CheckCircle,
          color: 'text-green-400',
          bgColor: 'bg-green-400/10',
          borderColor: 'border-green-400/20',
        }
      case 'not-trusted':
        return {
          text: 'Needs More Reviews',
          icon: XCircle,
          color: 'text-red-400',
          bgColor: 'bg-red-400/10',
          borderColor: 'border-red-400/20',
        }
      default:
        return {
          text: 'New Developer',
          icon: HelpCircle,
          color: 'text-yellow-400',
          bgColor: 'bg-yellow-400/10',
          borderColor: 'border-yellow-400/20',
        }
    }
  }

  const verdictConfig = getVerdictConfig()
  const VerdictIcon = verdictConfig.icon

  const handleSubmitReview = () => {
    if (selectedReviewType !== null && reviewMessage.trim()) {
      onSubmitReview(selectedReviewType, reviewMessage.trim())
      setReviewMessage('')
      setSelectedReviewType(null)
      setShowReviewForm(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Button variant="ghost" onClick={onBack} className="text-muted-foreground hover:text-white mb-6 px-0">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Search
          </Button>

          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">{profile.username}</h1>
                <p className="text-muted-foreground font-mono text-sm">
                  {profile.address.slice(0, 8)}...{profile.address.slice(-8)}
                </p>
              </div>
            </div>

            <div
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${verdictConfig.bgColor} ${verdictConfig.borderColor} border`}
            >
              <VerdictIcon className={`w-5 h-5 ${verdictConfig.color}`} />
              <span className={`font-medium ${verdictConfig.color}`}>{verdictConfig.text}</span>
            </div>
          </div>

          {/* Trust Score Section */}
          <Card className="bg-card border-border/60 mb-6">
            <CardContent className="text-center py-8">
              <div className="space-y-4">
                <div className="text-6xl font-bold text-white">
                  {animatedScore}
                  <span className="text-3xl text-muted-foreground">%</span>
                </div>
                <p className="text-muted-foreground text-lg">Trust Score</p>

                <div className="grid grid-cols-3 gap-6 mt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{profile.totalReviews}</div>
                    <div className="text-sm text-muted-foreground">Total Reviews</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">{profile.positiveReviews}</div>
                    <div className="text-sm text-muted-foreground">Positive</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-400">{profile.negativeReviews}</div>
                    <div className="text-sm text-muted-foreground">Negative</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Developer Info */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <Card className="bg-card border-border/60">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  About
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  Joined {new Date(profile.joinedDate).toLocaleDateString()}
                </div>
                {profile.bio && <p className="text-sm">{profile.bio}</p>}
                {profile.skills && profile.skills.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2">Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {profile.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-card border-border/60">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Projects
                </CardTitle>
              </CardHeader>
              <CardContent>
                {profile.projects && profile.projects.length > 0 ? (
                  <div className="space-y-2">
                    {profile.projects.map((project, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-yellow-400" />
                        <span className="text-sm">{project}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No projects listed yet</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Review Section */}
          <Card className="bg-card border-border/60 mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Leave a Review
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              {!showReviewForm ? (
                <div className="text-center py-6">
                  <p className="text-muted-foreground mb-4">Have you worked with {profile.username}? Share your experience!</p>
                  <Button onClick={() => setShowReviewForm(true)}>Write a Review</Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex gap-4 justify-center">
                    <Button
                      variant={selectedReviewType === true ? 'default' : 'outline'}
                      onClick={() => setSelectedReviewType(true)}
                      className="flex items-center gap-2"
                    >
                      <ThumbsUp className="w-4 h-4" />
                      Positive
                    </Button>
                    <Button
                      variant={selectedReviewType === false ? 'destructive' : 'outline'}
                      onClick={() => setSelectedReviewType(false)}
                      className="flex items-center gap-2"
                    >
                      <ThumbsDown className="w-4 h-4" />
                      Negative
                    </Button>
                  </div>

                  <Textarea
                    placeholder="Share your experience working with this developer..."
                    value={reviewMessage}
                    onChange={(e) => setReviewMessage(e.target.value)}
                    className="min-h-[100px]"
                  />

                  <div className="flex gap-2 justify-end">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowReviewForm(false)
                        setSelectedReviewType(null)
                        setReviewMessage('')
                      }}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleSubmitReview} disabled={selectedReviewType === null || !reviewMessage.trim()}>
                      Submit Review
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Reviews */}
          {profile.recentReviews && profile.recentReviews.length > 0 && (
            <Card className="bg-card border-border/60">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Recent Reviews
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {profile.recentReviews.map((review) => (
                  <div key={review.id} className="border-l-2 border-border pl-4 py-2">
                    <div className="flex items-start gap-3">
                      {review.isPositive ? (
                        <ThumbsUp className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                      ) : (
                        <ThumbsDown className="w-5 h-5 text-red-400 mt-1 flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <p className="text-sm">{review.message}</p>
                        <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                          <span>by {review.reviewer}</span>
                          <span>•</span>
                          <span>{review.date}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default DeveloperProfile
