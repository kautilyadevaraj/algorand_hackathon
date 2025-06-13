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
  <Card className="bg-card border-border/50 shadow-sm transition-transform duration-200 hover:-translate-y-1">
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
      <Icon className={`w-5 h-5 ${color || 'text-muted-foreground'}`} />
    </CardHeader>
    <CardContent>
      <div className="text-3xl font-bold text-primary">
        {value}
        {unit && <span className="text-base font-normal text-muted-foreground ml-1">{unit}</span>}
      </div>
    </CardContent>
  </Card>
);

const Dashboard: React.FC<DashboardProps> = ({ developerName, data, onBack }) => {
  const trustScore = calculateTrustScore(data.positive, data.reviews);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-start p-4 sm:p-8 lg:p-12">
      <div className="w-full max-w-6xl space-y-8">
        {/* Header */}
        <header className="flex flex-wrap gap-4 justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-primary">Dashboard</h1>
            <p className="text-lg text-muted-foreground mt-1">{developerName}</p>
          </div>
          <Button variant="ghost" onClick={onBack} className="text-muted-foreground hover:text-primary transition-colors">
            <span className="mr-2">←</span> Back to Home
          </Button>
        </header>

        {/* Stats Grid */}
        <div className="grid gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          <StatCard icon={CheckCircle} label="Status" value="Opted-In" color="text-green-400" />
          <StatCard icon={Percent} label="Trust Score" value={trustScore} unit="%" />
          <StatCard icon={Award} label="Positive" value={data.positive} />
          <StatCard icon={XCircle} label="Negative" value={data.negative} color="text-red-400" />
          <StatCard icon={Users} label="Total Reviews" value={data.reviews} />
          <StatCard icon={Clock} label="Member Since" value="Jan 2024" />
        </div>

        {/* Recent Activity */}
        <Card className="bg-card border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">Recent Activity</CardTitle>
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
                      <p className="text-primary font-medium">{review.message}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        From {review.reviewer} • {review.date}
                      </p>
                    </div>
                  </div>
                  {index < (data.recentReviews?.length ?? 0) - 1 && <hr className="border-border/50" />}
                </React.Fragment>
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