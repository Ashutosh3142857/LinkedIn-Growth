import React, { useEffect, useState } from 'react'
import { useStore } from '../store/useStore'
import { 
  UsersIcon, 
  DocumentTextIcon, 
  MegaphoneIcon, 
  ChartBarIcon,
  ClockIcon,
  TrendingUpIcon,
  SparklesIcon,
  EyeIcon
} from '@heroicons/react/24/outline'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'

const mockGrowthData = [
  { date: 'Jan', followers: 8500, engagement: 3.2 },
  { date: 'Feb', followers: 9200, engagement: 3.8 },
  { date: 'Mar', followers: 10100, engagement: 4.1 },
  { date: 'Apr', followers: 11300, engagement: 4.5 },
  { date: 'May', followers: 12800, engagement: 5.2 },
  { date: 'Jun', followers: 14200, engagement: 5.8 },
  { date: 'Jul', followers: 15420, engagement: 6.3 },
]

const mockContentData = [
  { week: 'Week 1', posts: 15, engagement: 890 },
  { week: 'Week 2', posts: 18, engagement: 1200 },
  { week: 'Week 3', posts: 20, engagement: 1450 },
  { week: 'Week 4', posts: 17, engagement: 1320 },
]

export default function Dashboard() {
  const { stats } = useStore()
  const [automationStatus, setAutomationStatus] = useState({
    contentCreation: true,
    alumniEngagement: true,
    adOptimization: true,
    competitorTracking: true,
    viralAmplification: false
  })

  const MetricCard = ({ title, value, change, icon: Icon, color = 'blue' }: any) => (
    <div className="metric-card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change && (
            <p className={`text-sm flex items-center ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
              <TrendingUpIcon className="h-4 w-4 mr-1" />
              {change > 0 ? '+' : ''}{change}%
            </p>
          )}
        </div>
        <div className={`p-3 rounded-full bg-${color}-100`}>
          <Icon className={`h-6 w-6 text-${color}-600`} />
        </div>
      </div>
    </div>
  )

  const AutomationToggle = ({ name, enabled, onToggle }: any) => (
    <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
      <div>
        <h3 className="font-medium text-gray-900">{name}</h3>
        <p className="text-sm text-gray-500">
          {enabled ? 'Running automatically' : 'Paused'}
        </p>
      </div>
      <button
        onClick={onToggle}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          enabled ? 'bg-linkedin-600' : 'bg-gray-200'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            enabled ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">LinkedIn Growth Dashboard</h1>
          <p className="text-gray-600 mt-1">AI-powered automation for 100k followers</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
            🎯 On Track to 100k
          </div>
          <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
            💼 {stats.timeSaved}hrs saved this week
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Followers"
          value={stats.totalFollowers.toLocaleString()}
          change={stats.weeklyGrowth}
          icon={UsersIcon}
          color="blue"
        />
        <MetricCard
          title="Content Generated"
          value={stats.contentGenerated}
          change={12.5}
          icon={DocumentTextIcon}
          color="green"
        />
        <MetricCard
          title="Alumni Contacted"
          value={stats.alumniContacted.toLocaleString()}
          change={8.2}
          icon={UsersIcon}
          color="purple"
        />
        <MetricCard
          title="Active Ad Campaigns"
          value={stats.adCampaignsActive}
          change={-2.1}
          icon={MegaphoneIcon}
          color="yellow"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Follower Growth Chart */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Follower Growth</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={mockGrowthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="followers" 
                stroke="#0a66c2" 
                strokeWidth={3}
                dot={{ fill: '#0a66c2', strokeWidth: 2, r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Content Performance */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Content Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={mockContentData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="engagement" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Automation Controls */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Automation Controls</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AutomationToggle
            name="Content Creation"
            enabled={automationStatus.contentCreation}
            onToggle={() => setAutomationStatus(prev => ({ 
              ...prev, 
              contentCreation: !prev.contentCreation 
            }))}
          />
          <AutomationToggle
            name="Alumni Engagement"
            enabled={automationStatus.alumniEngagement}
            onToggle={() => setAutomationStatus(prev => ({ 
              ...prev, 
              alumniEngagement: !prev.alumniEngagement 
            }))}
          />
          <AutomationToggle
            name="Ad Optimization"
            enabled={automationStatus.adOptimization}
            onToggle={() => setAutomationStatus(prev => ({ 
              ...prev, 
              adOptimization: !prev.adOptimization 
            }))}
          />
          <AutomationToggle
            name="Competitor Tracking"
            enabled={automationStatus.competitorTracking}
            onToggle={() => setAutomationStatus(prev => ({ 
              ...prev, 
              competitorTracking: !prev.competitorTracking 
            }))}
          />
          <AutomationToggle
            name="Viral Amplification"
            enabled={automationStatus.viralAmplification}
            onToggle={() => setAutomationStatus(prev => ({ 
              ...prev, 
              viralAmplification: !prev.viralAmplification 
            }))}
          />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {[
            { icon: SparklesIcon, text: 'Generated 3 viral content variations', time: '5 minutes ago', color: 'purple' },
            { icon: UsersIcon, text: 'Connected with 12 new alumni contacts', time: '1 hour ago', color: 'blue' },
            { icon: MegaphoneIcon, text: 'Optimized ad campaign "Student Recruitment"', time: '2 hours ago', color: 'green' },
            { icon: EyeIcon, text: 'Detected competitor posting spike', time: '3 hours ago', color: 'yellow' },
            { icon: DocumentTextIcon, text: 'Scheduled 5 posts for next week', time: '4 hours ago', color: 'blue' },
          ].map((activity, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className={`p-2 rounded-full bg-${activity.color}-100`}>
                <activity.icon className={`h-4 w-4 text-${activity.color}-600`} />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">{activity.text}</p>
                <p className="text-xs text-gray-500">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}