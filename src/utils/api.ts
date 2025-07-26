import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor for adding auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Content Creation API
export const contentAPI = {
  generateContent: async (data: {
    topic: string
    audience: string
    tone: string
    competitorData?: string
  }) => {
    const response = await api.post('/content/generate', data)
    return response.data
  },
  
  schedulePost: async (data: {
    content: string
    scheduledDate: string
    platforms: string[]
  }) => {
    const response = await api.post('/content/schedule', data)
    return response.data
  },
  
  getPosts: async () => {
    const response = await api.get('/content/posts')
    return response.data
  },
  
  updatePost: async (postId: string, data: any) => {
    const response = await api.put(`/content/posts/${postId}`, data)
    return response.data
  }
}

// Alumni Engagement API
export const alumniAPI = {
  importAlumni: async (data: {
    source: 'csv' | 'sheets' | 'crm'
    sourceData: any
  }) => {
    const response = await api.post('/alumni/import', data)
    return response.data
  },
  
  startEngagementCampaign: async (data: {
    alumniIds: string[]
    campaignType: 'connection' | 'follow' | 'story'
  }) => {
    const response = await api.post('/alumni/campaign/start', data)
    return response.data
  },
  
  getAlumni: async () => {
    const response = await api.get('/alumni')
    return response.data
  },
  
  updateAlumniStatus: async (alumniId: string, status: string) => {
    const response = await api.put(`/alumni/${alumniId}/status`, { status })
    return response.data
  },
  
  getCampaignStats: async () => {
    const response = await api.get('/alumni/stats')
    return response.data
  }
}

// Ad Optimization API
export const adAPI = {
  createCampaign: async (data: {
    name: string
    budget: number
    targetAudience: string
    headlines: string[]
  }) => {
    const response = await api.post('/ads/campaign', data)
    return response.data
  },
  
  optimizeCampaign: async (campaignId: string) => {
    const response = await api.post(`/ads/campaign/${campaignId}/optimize`)
    return response.data
  },
  
  getCampaigns: async () => {
    const response = await api.get('/ads/campaigns')
    return response.data
  },
  
  generateHeadlines: async (data: {
    topPerformingPosts: string[]
    targetAudience: string
  }) => {
    const response = await api.post('/ads/headlines/generate', data)
    return response.data
  },
  
  pauseLowPerformingAds: async () => {
    const response = await api.post('/ads/optimize/pause-low-performing')
    return response.data
  }
}

// Competitor Tracking API
export const competitorAPI = {
  addCompetitor: async (data: {
    name: string
    linkedinUrl: string
  }) => {
    const response = await api.post('/competitors', data)
    return response.data
  },
  
  getCompetitors: async () => {
    const response = await api.get('/competitors')
    return response.data
  },
  
  updateCompetitorData: async (competitorId: string) => {
    const response = await api.post(`/competitors/${competitorId}/update`)
    return response.data
  },
  
  getCompetitorInsights: async () => {
    const response = await api.get('/competitors/insights')
    return response.data
  },
  
  startMonitoring: async (competitorIds: string[]) => {
    const response = await api.post('/competitors/monitor', { competitorIds })
    return response.data
  }
}

// Viral Content API
export const viralAPI = {
  getViralCandidates: async () => {
    const response = await api.get('/viral/candidates')
    return response.data
  },
  
  amplifyContent: async (postId: string, amplificationType: string) => {
    const response = await api.post(`/viral/amplify/${postId}`, { type: amplificationType })
    return response.data
  },
  
  repurposeContent: async (postId: string, format: string) => {
    const response = await api.post(`/viral/repurpose/${postId}`, { format })
    return response.data
  }
}

// Analytics API
export const analyticsAPI = {
  getDashboardStats: async () => {
    const response = await api.get('/analytics/dashboard')
    return response.data
  },
  
  getGrowthMetrics: async (timeRange: string) => {
    const response = await api.get(`/analytics/growth?range=${timeRange}`)
    return response.data
  },
  
  getEngagementAnalytics: async () => {
    const response = await api.get('/analytics/engagement')
    return response.data
  },
  
  generateReport: async (reportType: string, dateRange: { start: string; end: string }) => {
    const response = await api.post('/analytics/report', { reportType, dateRange })
    return response.data
  }
}

// Automation Workflows API
export const workflowAPI = {
  getWorkflows: async () => {
    const response = await api.get('/workflows')
    return response.data
  },
  
  startWorkflow: async (workflowId: string, config: any) => {
    const response = await api.post(`/workflows/${workflowId}/start`, config)
    return response.data
  },
  
  stopWorkflow: async (workflowId: string) => {
    const response = await api.post(`/workflows/${workflowId}/stop`)
    return response.data
  },
  
  getWorkflowStatus: async (workflowId: string) => {
    const response = await api.get(`/workflows/${workflowId}/status`)
    return response.data
  }
}

export default api