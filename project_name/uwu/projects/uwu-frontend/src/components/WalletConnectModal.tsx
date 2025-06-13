import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Wallet, CreditCard, Package } from 'lucide-react';

const wallets = [
  { name: 'Pera Wallet', icon: Wallet },
  { name: 'Defly Wallet', icon: CreditCard },
  { name: 'Exodus Wallet', icon: Package },
];

interface WalletConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onWalletSelect: (walletType: string) => void;
}

const WalletConnectModal: React.FC<WalletConnectModalProps> = ({ isOpen, onClose, onWalletSelect }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="bg-card border-border/60 text-foreground sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Connect Wallet</DialogTitle>
              <DialogDescription>
                Select your preferred wallet to continue.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 pt-4">
              {wallets.map((wallet) => {
                const Icon = wallet.icon;
                return (
                  <Button
                    key={wallet.name}
                    variant="secondary"
                    className="w-full justify-start py-6 text-base"
                    onClick={() => onWalletSelect(wallet.name)}
                  >
                    <Icon className="w-5 h-5 mr-4 text-muted-foreground" />
                    {wallet.name}
                  </Button>
                );
              })}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default WalletConnectModal; 