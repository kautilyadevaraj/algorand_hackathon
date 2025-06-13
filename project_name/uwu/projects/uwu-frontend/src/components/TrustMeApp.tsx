import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import HomePage from './HomePage';
import ResultsDisplay from './ResultsDisplay';
import Dashboard from './Dashboard';
import WalletConnectModal from './WalletConnectModal';
import OptInModal from './OptInModal';
import { mockDeveloperData, DeveloperData } from '@/data/mockData';
import { Loader2 } from 'lucide-react';

type AppState = 'home' | 'results' | 'dashboard';

interface AppData {
  currentDeveloper?: string;
  developerData?: DeveloperData;
  connectedWallet?: string;
  isOptedIn: boolean;
}

const TrustMeApp: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('home');
  const [appData, setAppData] = useState<AppData>({ isOptedIn: false });
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [showOptInModal, setShowOptInModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Search for a developer
  const handleSearch = async (query: string) => {
    setIsLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      const normalizedQuery = query.toLowerCase().trim();
      const developerData = mockDeveloperData[normalizedQuery];
      
      if (developerData) {
        setAppData(prev => ({
          ...prev,
          currentDeveloper: normalizedQuery,
          developerData
        }));
        setAppState('results');
      } else {
        // Handle not found case - you could show a not found state
        alert('Developer not found. Try searching for: trusted_dev.algo, risky_dev.algo, new_dev.algo, or unregistered_dev.algo');
      }
      setIsLoading(false);
    }, 1000);
  };

  // Handle developer button click (wallet connection flow)
  const handleDeveloperClick = () => {
    setShowWalletModal(true);
  };

  // Handle wallet selection
  const handleWalletSelect = (walletType: string) => {
    setShowWalletModal(false);

    setAppData(prev => ({
      ...prev,
      connectedWallet: walletType
    }));
    
    // Simulate wallet connection and check opt-in status
    setTimeout(() => {
      const connectedDeveloper = 'trusted_dev.algo';
      const developerData = mockDeveloperData[connectedDeveloper];
      
      if (developerData && developerData.isOptedIn) {
        // Developer is already opted in, go to dashboard
        setAppData(prev => ({
          ...prev,
          currentDeveloper: connectedDeveloper,
          developerData,
          isOptedIn: true
        }));
        setAppState('dashboard');
      } else {
        // Developer needs to opt in
        setAppData(prev => ({
          ...prev,
          currentDeveloper: connectedDeveloper,
          developerData
        }));
        setShowOptInModal(true);
      }
    }, 1000);
  };

  // Handle opt-in completion
  const handleOptInComplete = () => {
    setAppData(prev => ({
      ...prev,
      isOptedIn: true
    }));
    setAppState('dashboard');
  };

  // Navigate back to home
  const handleBackToHome = () => {
    setAppState('home');
    setAppData({ isOptedIn: false });
  };

  // Loading overlay component
  const LoadingOverlay = () => (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-8 h-8 text-white/50 animate-spin" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-foreground relative">
      {/* Loading Overlay */}
      {isLoading && <LoadingOverlay />}

      {/* Main Content */}
      <AnimatePresence mode="wait">
        {appState === 'home' && (
          <motion.div
            key="home"
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <HomePage
              onSearch={handleSearch}
              onDeveloperClick={handleDeveloperClick}
            />
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
            <ResultsDisplay
              developerName={appData.currentDeveloper}
              data={appData.developerData}
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
            <Dashboard
              developerName={appData.currentDeveloper}
              data={appData.developerData}
              onBack={handleBackToHome}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modals */}
      <WalletConnectModal
        isOpen={showWalletModal}
        onClose={() => setShowWalletModal(false)}
        onWalletSelect={handleWalletSelect}
      />

      <OptInModal
        isOpen={showOptInModal}
        onClose={() => setShowOptInModal(false)}
        onOptIn={handleOptInComplete}
        developerName={appData.currentDeveloper}
      />
    </div>
  );
};

export default TrustMeApp; 