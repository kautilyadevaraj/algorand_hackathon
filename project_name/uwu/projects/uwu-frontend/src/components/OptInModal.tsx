import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle } from 'lucide-react';

interface OptInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOptIn: () => void;
  developerName?: string;
}

const OptInModal: React.FC<OptInModalProps> = ({ isOpen, onClose, onOptIn, developerName }) => {
  const [isOptingIn, setIsOptingIn] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleOptInClick = () => {
    setIsOptingIn(true);
    setTimeout(() => {
      setIsOptingIn(false);
      setIsSuccess(true);
      setTimeout(() => {
        onOptIn();
        onClose();
        // Reset state for next time
        setTimeout(() => {
          setIsSuccess(false);
        }, 500)
      }, 1500);
    }, 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="bg-card border-border/60 text-foreground">
            <DialogHeader>
              <DialogTitle>Join the Network</DialogTitle>
              <DialogDescription>
                Opt-in to the TrustMeBro network to build your public reputation.
              </DialogDescription>
            </DialogHeader>

            {isSuccess ? (
              <div className="flex flex-col items-center justify-center space-y-4 py-8">
                <CheckCircle className="w-16 h-16 text-green-400" />
                <p className="text-lg font-medium">Successfully Opted-In!</p>
                <p className="text-sm text-muted-foreground">Redirecting to your dashboard...</p>
              </div>
            ) : (
              <>
                <div className="py-4 text-sm text-muted-foreground space-y-2">
                  <p>By opting in, a smart contract will be deployed for your address:</p>
                  <p className="font-mono text-xs text-foreground bg-secondary p-2 rounded-md">{developerName}</p>
                  <p>This allows others to send you "Positive" or "Negative" review tokens.</p>
                </div>
                <DialogFooter>
                  <Button variant="secondary" onClick={onClose} disabled={isOptingIn}>Cancel</Button>
                  <Button onClick={handleOptInClick} disabled={isOptingIn}>
                    {isOptingIn && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Confirm Opt-In
                  </Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default OptInModal; 