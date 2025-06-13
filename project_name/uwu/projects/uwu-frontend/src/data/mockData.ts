export interface DeveloperData {
  reviews: number;
  positive: number;
  negative: number;
  isOptedIn: boolean;
  recentReviews?: Review[];
}

export interface Review {
  id: string;
  message: string;
  date: string;
  isPositive: boolean;
  reviewer: string;
}

export const wallets = [
  {
    name: 'Pera Wallet',
    icon: 'https://pellar.io/assets/wallets/pera.png'
  },
  {
    name: 'Defly Wallet',
    icon: 'https://pellar.io/assets/wallets/defly.png'
  },
  {
    name: 'Exodus Wallet',
    icon: 'https://pellar.io/assets/wallets/exodus.png'
  }
];

export const mockDeveloperData: { [key: string]: DeveloperData } = {
  'trusted_dev.algo': {
    reviews: 82,
    positive: 75,
    negative: 7,
    isOptedIn: true,
    recentReviews: [
      { id: '1', message: 'Excellent smart contract development, clean code!', date: '2024-01-15', isPositive: true, reviewer: 'user123.algo' },
      { id: '2', message: 'Fast delivery and great communication.', date: '2024-01-12', isPositive: true, reviewer: 'dev456.algo' },
      { id: '3', message: 'Professional approach to debugging.', date: '2024-01-10', isPositive: true, reviewer: 'client789.algo' },
      { id: '4', message: 'Could improve documentation.', date: '2024-01-08', isPositive: false, reviewer: 'reviewer101.algo' },
    ]
  },
  'risky_dev.algo': {
    reviews: 25,
    positive: 10,
    negative: 15,
    isOptedIn: true,
    recentReviews: [
      { id: '5', message: 'Code quality issues found.', date: '2024-01-14', isPositive: false, reviewer: 'auditor.algo' },
      { id: '6', message: 'Missed deadline by a week.', date: '2024-01-11', isPositive: false, reviewer: 'project_mgr.algo' },
      { id: '7', message: 'Good ideas but poor execution.', date: '2024-01-09', isPositive: false, reviewer: 'lead_dev.algo' },
    ]
  },
  'new_dev.algo': {
    reviews: 4,
    positive: 3,
    negative: 1,
    isOptedIn: true,
    recentReviews: [
      { id: '8', message: 'Shows promise as a new developer!', date: '2024-01-13', isPositive: true, reviewer: 'mentor.algo' },
      { id: '9', message: 'Quick learner and eager to improve.', date: '2024-01-11', isPositive: true, reviewer: 'senior_dev.algo' },
    ]
  },
  'unregistered_dev.algo': {
    reviews: 0,
    positive: 0,
    negative: 0,
    isOptedIn: false,
  }
};

export const typewriterTexts = [
  'Satoshi.algo',
  'Vitalik.eth', 
  'The Py-Teal Guy',
  'Reach Devs',
  'AlgoKit Masters',
  'Smart Contract Pro'
];

export function calculateTrustScore(positive: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((positive / total) * 100);
}

export function getTrustVerdict(reviews: number, positiveRatio: number): 'trusted' | 'not-trusted' | 'insufficient-data' {
  if (reviews < 10) return 'insufficient-data';
  return positiveRatio > 0.75 ? 'trusted' : 'not-trusted';
} 