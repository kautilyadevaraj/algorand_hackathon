import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface HomePageProps {
  onSearch: (query: string) => void;
  onDeveloperClick: () => void;
}

const randomNames = [
  'taufeeq.algo',
  'kautilya.algo',
  'anirudh.algo',
  'sagar.algo',
  '______',
];

const HomePage: React.FC<HomePageProps> = ({ onSearch, onDeveloperClick }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [placeholder, setPlaceholder] = useState('______');
  const [nameIndex, setNameIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (searchQuery) return;

    const type = () => {
      const currentName = randomNames[nameIndex];
      const currentLength = placeholder.length;

      if (isDeleting) {
        if (currentLength > 0) {
          setPlaceholder(currentName.slice(0, currentLength - 1));
        } else {
          setIsDeleting(false);
          setNameIndex((prev) => (prev + 1) % randomNames.length);
        }
      } else {
        if (currentLength < currentName.length) {
          setPlaceholder(currentName.slice(0, currentLength + 1));
        } else {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      }
    };

    const timeoutId = setTimeout(type, isDeleting ? 60 : 120);
    return () => clearTimeout(timeoutId);
  }, [placeholder, isDeleting, nameIndex, searchQuery, randomNames]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };

  return (
    <div className="min-h-screen bg-black text-white relative">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="absolute top-0 right-0 p-4 sm:p-6"
      >
        <Button
          onClick={onDeveloperClick}
          variant="ghost"
          className="text-muted-foreground hover:text-white transition-colors duration-200"
        >
          Are you a developer?
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </motion.header>

      {/* Main Content */}
      <div className="min-h-screen grid place-items-center px-4">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <form onSubmit={handleSubmit}>
            <div className="flex items-baseline text-3xl sm:text-4xl font-light justify-center">
              <span className="text-white/80 whitespace-nowrap">Can I trust&nbsp;</span>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={placeholder}
                  className="bg-transparent border-none outline-none p-0 m-0 absolute inset-0 w-full text-muted-foreground placeholder:text-muted-foreground focus:ring-0"
                  style={{
                    fontSize: 'inherit',
                    fontFamily: 'inherit',
                    fontWeight: 'inherit',
                    lineHeight: 'inherit',
                    letterSpacing: 'inherit',
                  }}
                  autoFocus
                />
                <span 
                  className="invisible whitespace-pre"
                  style={{
                    fontSize: 'inherit',
                    fontFamily: 'inherit',
                    fontWeight: 'inherit',
                    lineHeight: 'inherit',
                    letterSpacing: 'inherit',
                  }}
                >
                  {searchQuery || placeholder}
                </span>
              </div>
              <span className="text-white">?</span>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default HomePage; 