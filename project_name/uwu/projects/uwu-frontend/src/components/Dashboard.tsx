import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Clock, Users, Award, Percent, XCircle, PlusCircle, MinusCircle } from 'lucide-react';
import { DeveloperData, calculateTrustScore } from '@/data/mockData';

interface DashboardProps {
  developerName: string;
  data: DeveloperData;
  onBack: () => void;
}

const StatCard = ({ icon: Icon, label, value, color, unit }: any) => (
  <Card className="bg-secondary/50 border-none">
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
      <Icon className={`w-4 h-4 ${color || 'text-muted-foreground'}`} />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold text-white">
        {value}
        {unit && <span className="text-base text-muted-foreground ml-1">{unit}</span>}
      </div>
    </CardContent>
  </Card>
);

const Dashboard: React.FC<DashboardProps> = ({ developerName, data, onBack }) => {
  const trustScore = calculateTrustScore(data.positive, data.reviews);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-5xl space-y-8">
        {/* Header */}
        <header className="flex flex-wrap gap-4 justify-between items-center">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Dashboard</h1>
            <p className="text-muted-foreground">{developerName}</p>
          </div>
          <Button variant="ghost" onClick={onBack} className="text-muted-foreground hover:text-white">
            ← Back to Home
          </Button>
        </header>

        {/* Stats Grid */}
        <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          <StatCard icon={CheckCircle} label="Status" value="Opted-In" color="text-green-400" />
          <StatCard icon={Percent} label="Trust Score" value={trustScore} unit="%" />
          <StatCard icon={Award} label="Positive" value={data.positive} />
          <StatCard icon={XCircle} label="Negative" value={data.negative} color="text-red-400" />
          <StatCard icon={Users} label="Total Reviews" value={data.reviews} />
          <StatCard icon={Clock} label="Member Since" value="Jan 2024" />
        </div>

        {/* Recent Activity */}
        <Card className="bg-card border-border/60">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.recentReviews && data.recentReviews.length > 0 ? (
              data.recentReviews.map((review) => (
                <div key={review.id} className="flex items-start gap-4">
                  {review.isPositive ? (
                    <PlusCircle className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                  ) : (
                    <MinusCircle className="w-5 h-5 text-red-400 mt-1 flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <p className="text-foreground">{review.message}</p>
                    <p className="text-sm text-muted-foreground">
                      From {review.reviewer} • {review.date}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-center py-8">
                No recent activity to display.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard; 