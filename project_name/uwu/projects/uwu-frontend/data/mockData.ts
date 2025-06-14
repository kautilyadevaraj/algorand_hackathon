export interface Review {
  id: string
  reviewer: string
  reviewerAddress: string
  isPositive: boolean
  message: string
  date: string
  transactionId: string
}

export interface DeveloperProfile {
  username: string
  address: string
  joinedDate: string
  totalReviews: number
  positiveReviews: number
  negativeReviews: number
  trustScore: number
  isOptedIn: boolean
  bio?: string
  skills?: string[]
  projects?: string[]
  recentReviews: Review[]
}

export const mockDeveloperProfiles: Record<string, DeveloperProfile> = {
  'taufeeq.algo': {
    username: 'taufeeq.algo',
    address: 'TAUF7YLXM2NQJZK3VWXR8PLMN4QWERTYUIOP9ASDFGHJKLZXCVBNM',
    joinedDate: '2024-01-15',
    totalReviews: 47,
    positiveReviews: 42,
    negativeReviews: 5,
    trustScore: 89,
    isOptedIn: true,
    bio: 'Senior Full-stack developer specializing in Algorand dApps and smart contracts. Passionate about building decentralized solutions.',
    skills: ['Algorand', 'React', 'Python', 'Smart Contracts', 'DeFi', 'TypeScript', 'Node.js'],
    projects: ['AlgoSwap DEX', 'TrustMeBro Platform', 'AlgoNFT Marketplace', 'DeFi Lending Protocol'],
    recentReviews: [
      {
        id: '1',
        reviewer: 'alice.algo',
        reviewerAddress: 'ALICE123...',
        isPositive: true,
        message: 'Excellent work on the smart contract implementation. Very professional and delivered on time.',
        date: '2024-01-20',
        transactionId: 'TXN123ABC',
      },
      {
        id: '2',
        reviewer: 'bob.algo',
        reviewerAddress: 'BOB456...',
        isPositive: true,
        message: 'Great communication and technical skills. Highly recommended!',
        date: '2024-01-18',
        transactionId: 'TXN456DEF',
      },
      {
        id: '3',
        reviewer: 'charlie.algo',
        reviewerAddress: 'CHARLIE789...',
        isPositive: false,
        message: 'Project was delayed and communication could have been better.',
        date: '2024-01-15',
        transactionId: 'TXN789GHI',
      },
      {
        id: '4',
        reviewer: 'diana.algo',
        reviewerAddress: 'DIANA012...',
        isPositive: true,
        message: 'Outstanding developer! Built exactly what we needed with clean, efficient code.',
        date: '2024-01-12',
        transactionId: 'TXN012JKL',
      },
      {
        id: '5',
        reviewer: 'eve.algo',
        reviewerAddress: 'EVE345...',
        isPositive: true,
        message: 'Very knowledgeable about Algorand ecosystem. Great problem solver.',
        date: '2024-01-10',
        transactionId: 'TXN345MNO',
      },
    ],
  },
  'kautilya.algo': {
    username: 'kautilya.algo',
    address: 'KAUT7YLXM2NQJZK3VWXR8PLMN4QWERTYUIOP9ASDFGHJKLZXCVBNM',
    joinedDate: '2024-01-20',
    totalReviews: 23,
    positiveReviews: 20,
    negativeReviews: 3,
    trustScore: 87,
    isOptedIn: true,
    bio: 'Blockchain developer focused on DeFi and NFT solutions',
    skills: ['Algorand', 'JavaScript', 'Python', 'Smart Contracts'],
    projects: ['NFT Creator', 'Token Bridge'],
    recentReviews: [
      {
        id: '1',
        reviewer: 'frank.algo',
        reviewerAddress: 'FRANK678...',
        isPositive: true,
        message: 'Solid work on the NFT marketplace. Good attention to detail.',
        date: '2024-01-22',
        transactionId: 'TXN678PQR',
      },
    ],
  },
  'trusted_dev.algo': {
    username: 'trusted_dev.algo',
    address: 'TRUST123XLXM2NQJZK3VWXR8PLMN4QWERTYUIOP9ASDFGHJKLZXCVBNM',
    joinedDate: '2023-12-01',
    totalReviews: 89,
    positiveReviews: 81,
    negativeReviews: 8,
    trustScore: 91,
    isOptedIn: true,
    bio: 'Senior blockchain developer with 5+ years experience',
    skills: ['Algorand', 'Solidity', 'Rust', 'Go', 'DeFi'],
    projects: ['AlgoBank', 'DecentraSwap', 'NFT Creator'],
    recentReviews: [],
  },
  'new_dev.algo': {
    username: 'new_dev.algo',
    address: 'NEWDEV123XM2NQJZK3VWXR8PLMN4QWERTYUIOP9ASDFGHJKLZXCVBNM',
    joinedDate: '2024-01-25',
    totalReviews: 3,
    positiveReviews: 3,
    negativeReviews: 0,
    trustScore: 100,
    isOptedIn: true,
    bio: 'New to the ecosystem but eager to learn and contribute',
    skills: ['JavaScript', 'React', 'Learning Algorand'],
    projects: ['Portfolio Site'],
    recentReviews: [],
  },
}

export function getTrustVerdict(totalReviews: number, positiveRatio: number): 'trusted' | 'not-trusted' | 'insufficient-data' {
  if (totalReviews < 5) return 'insufficient-data'
  if (positiveRatio >= 0.8) return 'trusted'
  return 'not-trusted'
}

export function calculateTrustScore(positive: number, total: number): number {
  if (total === 0) return 0
  return Math.round((positive / total) * 100)
}
