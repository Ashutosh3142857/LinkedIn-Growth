import { create } from 'zustand'

export interface ContentPost {
  id: string
  content: string
  status: 'draft' | 'scheduled' | 'published'
  scheduledDate?: string
  topic: string
  audience: string
  tone: string
  engagement?: {
    likes: number
    comments: number
    shares: number
  }
}

export interface AlumniContact {
  id: string
  name: string
  university: string
  graduationYear: number
  status: 'pending' | 'connected' | 'following' | 'engaged'
  lastContact?: string
  connectionSent?: boolean
  followPagePitchSent?: boolean
  storySubmissionSent?: boolean
}

export interface CompetitorData {
  id: string
  name: string
  followerCount: number
  postFrequency: number
  engagementRate: number
  lastUpdate: string
  recentPosts: Array<{
    content: string
    engagement: number
    date: string
  }>
}

export interface AdCampaign {
  id: string
  name: string
  budget: number
  cpa: number
  status: 'active' | 'paused' | 'completed'
  headlines: string[]
  targetAudience: string
  performance: {
    impressions: number
    clicks: number
    conversions: number
  }
}

export interface AutomationStats {
  totalFollowers: number
  weeklyGrowth: number
  contentGenerated: number
  alumniContacted: number
  adCampaignsActive: number
  timeSaved: number
}

interface Store {
  // Content Creation
  posts: ContentPost[]
  contentTopics: string[]
  
  // Alumni Engagement
  alumni: AlumniContact[]
  
  // Competitor Tracking
  competitors: CompetitorData[]
  
  // Ad Optimization
  adCampaigns: AdCampaign[]
  
  // Analytics
  stats: AutomationStats
  
  // UI State
  isLoading: boolean
  
  // Actions
  addPost: (post: Omit<ContentPost, 'id'>) => void
  updatePost: (id: string, updates: Partial<ContentPost>) => void
  addAlumni: (alumni: Omit<AlumniContact, 'id'>) => void
  updateAlumni: (id: string, updates: Partial<AlumniContact>) => void
  addCompetitor: (competitor: Omit<CompetitorData, 'id'>) => void
  updateCompetitor: (id: string, updates: Partial<CompetitorData>) => void
  addAdCampaign: (campaign: Omit<AdCampaign, 'id'>) => void
  updateAdCampaign: (id: string, updates: Partial<AdCampaign>) => void
  updateStats: (stats: Partial<AutomationStats>) => void
  setLoading: (loading: boolean) => void
}

export const useStore = create<Store>((set) => ({
  posts: [],
  contentTopics: ['Student Life', 'Career Advice', 'Campus Events', 'Industry Insights', 'Academic Success'],
  alumni: [],
  competitors: [],
  adCampaigns: [],
  stats: {
    totalFollowers: 15420,
    weeklyGrowth: 8.5,
    contentGenerated: 127,
    alumniContacted: 2340,
    adCampaignsActive: 5,
    timeSaved: 28,
  },
  isLoading: false,
  
  addPost: (post) =>
    set((state) => ({
      posts: [...state.posts, { ...post, id: crypto.randomUUID() }],
    })),
    
  updatePost: (id, updates) =>
    set((state) => ({
      posts: state.posts.map((post) =>
        post.id === id ? { ...post, ...updates } : post
      ),
    })),
    
  addAlumni: (alumni) =>
    set((state) => ({
      alumni: [...state.alumni, { ...alumni, id: crypto.randomUUID() }],
    })),
    
  updateAlumni: (id, updates) =>
    set((state) => ({
      alumni: state.alumni.map((contact) =>
        contact.id === id ? { ...contact, ...updates } : contact
      ),
    })),
    
  addCompetitor: (competitor) =>
    set((state) => ({
      competitors: [...state.competitors, { ...competitor, id: crypto.randomUUID() }],
    })),
    
  updateCompetitor: (id, updates) =>
    set((state) => ({
      competitors: state.competitors.map((comp) =>
        comp.id === id ? { ...comp, ...updates } : comp
      ),
    })),
    
  addAdCampaign: (campaign) =>
    set((state) => ({
      adCampaigns: [...state.adCampaigns, { ...campaign, id: crypto.randomUUID() }],
    })),
    
  updateAdCampaign: (id, updates) =>
    set((state) => ({
      adCampaigns: state.adCampaigns.map((campaign) =>
        campaign.id === id ? { ...campaign, ...updates } : campaign
      ),
    })),
    
  updateStats: (stats) =>
    set((state) => ({
      stats: { ...state.stats, ...stats },
    })),
    
  setLoading: (loading) =>
    set(() => ({ isLoading: loading })),
}))