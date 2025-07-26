import React, { useState } from 'react'
import { PlusIcon, SparklesIcon, CalendarIcon } from '@heroicons/react/24/outline'
import { useStore } from '../store/useStore'
import toast from 'react-hot-toast'

export default function ContentCreation() {
  const { posts, contentTopics, addPost } = useStore()
  const [isGenerating, setIsGenerating] = useState(false)
  const [formData, setFormData] = useState({
    topic: '',
    audience: 'Students',
    tone: 'Professional',
    customTopic: ''
  })

  const generateContent = async () => {
    setIsGenerating(true)
    try {
      // Simulate AI content generation
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const generatedPosts = [
        {
          content: `🎓 Ready to transform your career prospects? Here's how LinkedIn can be your secret weapon:\n\n✅ Optimize your profile with keywords\n✅ Share industry insights weekly\n✅ Engage with alumni posts\n✅ Build meaningful connections\n\nWhat's your LinkedIn success story? Share below! 👇\n\n#LinkedInTips #CareerGrowth #StudentSuccess`,
          status: 'draft' as const,
          topic: formData.topic || formData.customTopic,
          audience: formData.audience,
          tone: formData.tone
        },
        {
          content: `💡 Pro tip for students: Your LinkedIn headline is prime real estate!\n\nInstead of: "Student at University"\nTry: "Marketing Student | Future Brand Strategist | Passionate about Digital Innovation"\n\nMake every word count! 🚀\n\n#LinkedInProfile #CareerAdvice #PersonalBranding`,
          status: 'draft' as const,
          topic: formData.topic || formData.customTopic,
          audience: formData.audience,
          tone: formData.tone
        }
      ]
      
      generatedPosts.forEach(post => addPost(post))
      toast.success('Generated 2 new content variations!')
    } catch (error) {
      toast.error('Failed to generate content')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Content Creation</h1>
          <p className="text-gray-600 mt-1">AI-powered LinkedIn content generation</p>
        </div>
        <div className="text-sm text-gray-500">
          Goal: 15-20 posts/week
        </div>
      </div>

      {/* Content Generation Form */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Generate New Content</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Topic</label>
            <select 
              className="input-field"
              value={formData.topic}
              onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
            >
              <option value="">Select a topic...</option>
              {contentTopics.map(topic => (
                <option key={topic} value={topic}>{topic}</option>
              ))}
              <option value="custom">Custom Topic</option>
            </select>
          </div>
          
          {formData.topic === 'custom' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Custom Topic</label>
              <input
                type="text"
                className="input-field"
                placeholder="Enter custom topic..."
                value={formData.customTopic}
                onChange={(e) => setFormData({ ...formData, customTopic: e.target.value })}
              />
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Target Audience</label>
            <select 
              className="input-field"
              value={formData.audience}
              onChange={(e) => setFormData({ ...formData, audience: e.target.value })}
            >
              <option>Students</option>
              <option>Alumni</option>
              <option>Professionals</option>
              <option>Recruiters</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tone</label>
            <select 
              className="input-field"
              value={formData.tone}
              onChange={(e) => setFormData({ ...formData, tone: e.target.value })}
            >
              <option>Professional</option>
              <option>Casual</option>
              <option>Inspirational</option>
              <option>Educational</option>
            </select>
          </div>
        </div>
        
        <button
          onClick={generateContent}
          disabled={isGenerating || (!formData.topic && !formData.customTopic)}
          className="btn-primary w-full flex items-center justify-center"
        >
          {isGenerating ? (
            <>
              <div className="loading-spinner w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
              Generating Content...
            </>
          ) : (
            <>
              <SparklesIcon className="h-5 w-5 mr-2" />
              Generate Content Variations
            </>
          )}
        </button>
      </div>

      {/* Generated Posts */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Generated Posts ({posts.length})</h3>
        {posts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No posts generated yet. Use the form above to create your first AI-powered content!
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <div key={post.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className={`status-badge ${
                      post.status === 'published' ? 'status-active' :
                      post.status === 'scheduled' ? 'status-pending' : 'status-inactive'
                    }`}>
                      {post.status}
                    </span>
                    <span className="text-sm text-gray-500">
                      {post.topic} • {post.audience} • {post.tone}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <button className="btn-secondary text-sm">
                      <CalendarIcon className="h-4 w-4 mr-1" />
                      Schedule
                    </button>
                    <button className="btn-primary text-sm">Publish</button>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 mb-3">
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{post.content}</p>
                </div>
                {post.engagement && (
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>👍 {post.engagement.likes}</span>
                    <span>💬 {post.engagement.comments}</span>
                    <span>🔄 {post.engagement.shares}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}