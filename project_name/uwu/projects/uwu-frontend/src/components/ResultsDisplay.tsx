import React, { useEffect, useState } from 'react';
import { motion, animate } from 'framer-motion';
import { ShieldCheck, ShieldX, ShieldAlert, CheckCircle, XCircle, HelpCircle } from 'lucide-react';
import { DeveloperData, calculateTrustScore, getTrustVerdict } from '@/data/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from './ui/button';

interface ResultsDisplayProps {
  developerName: string;
  data: DeveloperData;
  onBack: () => void;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ developerName, data, onBack }) => {
  const [animatedScore, setAnimatedScore] = useState(0);

  const trustScore = calculateTrustScore(data.positive, data.reviews);
  const verdict = getTrustVerdict(data.reviews, data.positive / data.reviews);

  // Animated counter
  useEffect(() => {
    if (trustScore === 0) {
      setAnimatedScore(0);
      return;
    }
    const controls = animate(0, trustScore, {
      duration: 1,
      onUpdate(value: number) {
        setAnimatedScore(Math.round(value));
      }
    });
    return () => controls.stop();
  }, [trustScore]);

  const getVerdictConfig = () => {
    switch (verdict) {
      case 'trusted':
        return { text: 'Trusted', icon: CheckCircle, color: 'text-green-400' };
      case 'not-trusted':
        return { text: 'Not Trusted', icon: XCircle, color: 'text-red-400' };
      default:
        return { text: 'Insufficient Data', icon: HelpCircle, color: 'text-yellow-400' };
    }
  };

  const verdictConfig = getVerdictConfig();
  const VerdictIcon = verdictConfig.icon;

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <Card className="bg-card border-border/60">
          <CardHeader>
            <Button variant="ghost" onClick={onBack} className="text-muted-foreground hover:text-white self-start px-0 mb-4">
              ← Back
            </Button>
            <div className="text-center space-y-2">
              <CardTitle className="text-2xl font-medium text-foreground">{developerName}</CardTitle>
              <div className={`flex items-center justify-center gap-2 text-lg ${verdictConfig.color}`}>
                <VerdictIcon className="w-5 h-5" />
                <span>{verdictConfig.text}</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="text-center space-y-8 pt-4">
            <div className="space-y-2">
              <div className="text-7xl font-semibold text-white">
                {animatedScore}<span className="text-4xl text-muted-foreground">%</span>
              </div>
              <p className="text-muted-foreground">Trust Score</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-2xl font-medium text-white">{data.positive}</p>
                <p className="text-sm text-muted-foreground">Positive Reviews</p>
              </div>
              <div>
                <p className="text-2xl font-medium text-white">{data.negative}</p>
                <p className="text-sm text-muted-foreground">Negative Reviews</p>
              </div>
            </div>

            {verdict === 'insufficient-data' && (
              <div className="bg-secondary/50 text-muted-foreground text-sm p-3 rounded-md">
                This developer needs {10 - data.reviews} more reviews for a definitive trust verdict.
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ResultsDisplay; 