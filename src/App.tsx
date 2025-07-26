import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import ContentCreation from './pages/ContentCreation'
import AlumniEngagement from './pages/AlumniEngagement'
import AdOptimization from './pages/AdOptimization'
import CompetitorTracking from './pages/CompetitorTracking'
import ViralAmplification from './pages/ViralAmplification'
import Settings from './pages/Settings'
import Analytics from './pages/Analytics'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/content-creation" element={<ContentCreation />} />
        <Route path="/alumni-engagement" element={<AlumniEngagement />} />
        <Route path="/ad-optimization" element={<AdOptimization />} />
        <Route path="/competitor-tracking" element={<CompetitorTracking />} />
        <Route path="/viral-amplification" element={<ViralAmplification />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Layout>
  )
}

export default App