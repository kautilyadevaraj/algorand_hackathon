'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  CheckCircle,
  Clock,
  Users,
  Award,
  Percent,
  XCircle,
  PlusCircle,
  MinusCircle,
  User,
  TrendingUp,
  Star,
  Calendar,
  MessageSquare,
} from 'lucide-react'
import type { DeveloperProfile } from '@/data/mockData'

interface DashboardProps {
  developerName: string
  data: DeveloperProfile
  onBack: () => void
}

const StatCard = ({ icon: Icon, label, value, color, unit, description }: any) => (
  <Card className="bg-card border-border/50 shadow-sm transition-all duration-200 hover:shadow-lg hover:border-border">
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
      <Icon className={`w-5 h-5 ${color || 'text-muted-foreground'}`} />
    </CardHeader>
    <CardContent>
      <div className="text-3xl font-bold text-primary">
        {value}
        {unit && <span className="text-base font-normal text-muted-foreground ml-1">{unit}</span>}
      </div>
      {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
    </CardContent>
  </Card>
)

const Dashboard: React.FC<DashboardProps> = ({ developerName, data, onBack }) => {
  return (
    <div className="min-h-screen bg-black text-foreground p-4 sm:p-8 lg:p-12">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <header className="flex flex-wrap gap-4 justify-between items-start">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white">Developer Dashboard</h1>
                <p className="text-lg text-muted-foreground">{developerName}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-green-400">
                <CheckCircle className="w-3 h-3 mr-1" />
                Opted In
              </Badge>
              <Badge variant="outline">
                <Calendar className="w-3 h-3 mr-1" />
                Member since {new Date(data.joinedDate).toLocaleDateString()}
              </Badge>
            </div>
          </div>
          <Button variant="ghost" onClick={onBack} className="text-muted-foreground hover:text-white transition-colors">
            ← Back to Home
          </Button>
        </header>

        {/* Stats Grid */}
        <div className="grid gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          <StatCard
            icon={Percent}
            label="Trust Score"
            value={data.trustScore}
            unit="%"
            color="text-blue-400"
            description="Based on reviews"
          />
          <StatCard icon={Users} label="Total Reviews" value={data.totalReviews} color="text-purple-400" description="All time" />
          <StatCard icon={Award} label="Positive" value={data.positiveReviews} color="text-green-400" description="Great work!" />
          <StatCard icon={XCircle} label="Negative" value={data.negativeReviews} color="text-red-400" description="Room to improve" />
          <StatCard icon={Star} label="Projects" value={data.projects?.length || 0} color="text-yellow-400" description="Completed" />
          <StatCard icon={TrendingUp} label="Skills" value={data.skills?.length || 0} color="text-cyan-400" description="Technologies" />
        </div>

        {/* Profile Overview */}
        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 bg-card border-border/50 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl font-semibold flex items-center gap-2">
                <User className="w-5 h-5" />
                Profile Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium text-foreground mb-2">Bio</h3>
                <p className="text-muted-foreground">
                  {data.bio || 'No bio added yet. Add a bio to help others understand your expertise.'}
                </p>
              </div>

              {data.skills && data.skills.length > 0 && (
                <div>
                  <h3 className="font-medium text-foreground mb-2">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {data.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {data.projects && data.projects.length > 0 && (
                <div>
                  <h3 className="font-medium text-foreground mb-2">Featured Projects</h3>
                  <div className="space-y-2">
                    {data.projects.map((project, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-yellow-400" />
                        <span className="text-sm">{project}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-card border-border/50 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl font-semibold flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Quick Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center p-4 bg-secondary/20 rounded-lg">
                <div className="text-2xl font-bold text-green-400">
                  {data.totalReviews > 0 ? Math.round((data.positiveReviews / data.totalReviews) * 100) : 0}%
                </div>
                <div className="text-sm text-muted-foreground">Positive Rating</div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Reputation Level</span>
                  <span className="font-medium">
                    {data.trustScore >= 90
                      ? 'Expert'
                      : data.trustScore >= 75
                        ? 'Advanced'
                        : data.trustScore >= 50
                          ? 'Intermediate'
                          : 'Beginner'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Reviews Needed</span>
                  <span className="font-medium">{Math.max(0, 10 - data.totalReviews)} for verified status</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="bg-card border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-semibold flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Recent Reviews
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-2">
            {data.recentReviews && data.recentReviews.length > 0 ? (
              data.recentReviews.map((review, index) => (
                <React.Fragment key={review.id}>
                  <div className="flex items-start gap-4 py-2">
                    {review.isPositive ? (
                      <PlusCircle className="w-6 h-6 text-green-400 mt-1 flex-shrink-0" />
                    ) : (
                      <MinusCircle className="w-6 h-6 text-red-400 mt-1 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <p className="text-foreground font-medium">{review.message}</p>
                      <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                        <span>From {review.reviewer}</span>
                        <span>•</span>
                        <span>{review.date}</span>
                        <span>•</span>
                        <span className="font-mono text-xs">{review.transactionId}</span>
                      </div>
                    </div>
                  </div>
                  {index < (data.recentReviews?.length ?? 0) - 1 && <hr className="border-border/50" />}
                </React.Fragment>
              ))
            ) : (
              <div className="text-center py-8">
                <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No reviews yet</p>
                <p className="text-sm text-muted-foreground mt-1">Share your profile with clients to start receiving reviews</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Dashboard
