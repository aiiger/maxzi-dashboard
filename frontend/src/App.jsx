/**
 * MAXZI Analytics Dashboard - Main App Component
 * Premium 2025 Design with Glassmorphism & Real-time Data
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FloatingSidebar from './components/Sidebar/FloatingSidebar';
import KPICard from './components/KPICards/KPICard';
import PlatformCard from './components/PlatformCards/PlatformCard';
import AIPanel from './components/AIInsights/AIPanel';
import RevenueChart from './components/Charts/RevenueChart';
import LocationMap from './components/LocationMap/LocationMap';
import FloatingChatbot from './components/AIChat/FloatingChatbot';
import { dashboardAPI } from './services/api';
import './App.css';

function App() {
  // State Management
  const [overview, setOverview] = useState(null);
  const [locations, setLocations] = useState([]);
  const [platforms, setPlatforms] = useState([]);
  const [socialMedia, setSocialMedia] = useState(null);
  const [aiInsights, setAIInsights] = useState(null);
  const [realtimeData, setRealtimeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState('overview');
  const [selectedLocation, setSelectedLocation] = useState(null);

  // Load Dashboard Data
  useEffect(() => {
    loadDashboardData();
    
    // Real-time updates every 5 seconds
    const interval = setInterval(() => {
      dashboardAPI.getRealtime().then(data => setRealtimeData(data));
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      const [
        overviewData,
        locationsData,
        platformsData,
        socialData,
        aiData,
        realtimeData
      ] = await Promise.all([
        dashboardAPI.getOverview(),
        dashboardAPI.getLocations(),
        dashboardAPI.getPlatforms(),
        dashboardAPI.getSocialMedia(),
        dashboardAPI.getAIInsights(),
        dashboardAPI.getRealtime()
      ]);

      setOverview(overviewData);
      setLocations(locationsData);
      setPlatforms(platformsData);
      setSocialMedia(socialData);
      setAIInsights(aiData);
      setRealtimeData(realtimeData);
      
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="maxzi-logo-loader">
          <div className="logo-circle">M</div>
          <div className="loading-text">Loading MAXZI Analytics...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="maxzi-dashboard">
      {/* Floating Sidebar */}
      <FloatingSidebar 
        activeView={activeView}
        setActiveView={setActiveView}
      />

      {/* Main Content */}
      <div className="dashboard-content">
        
        {/* Header */}
        <motion.header 
          className="dashboard-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="header-left">
            <div className="brand-logo">
              <div className="logo-circle">M</div>
              <div className="brand-text">
                <h1>MAXZI</h1>
                <p className="tagline">The Good Food Shop</p>
              </div>
            </div>
          </div>

          <div className="header-center">
            <h2 className="dashboard-title">Analytics Command Center</h2>
            <p className="dashboard-subtitle">Real-time Performance Intelligence</p>
          </div>

          <div className="header-right">
            <div className="live-indicator">
              <span className="pulse-dot"></span>
              <span className="live-text">LIVE</span>
            </div>
            <div className="date-display">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'short', 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
              })}
            </div>
          </div>
        </motion.header>

        {/* AI Insights Banner */}
        {aiInsights && (
          <AIPanel insights={aiInsights} />
        )}

        {/* KPI Cards Row */}
        <motion.div
          id="kpi-section"
          className="kpi-cards-grid"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {overview && (
            <>
              <KPICard
                title="Total Revenue"
                value={`AED ${overview.total_revenue.toLocaleString()}`}
                change={overview.growth.revenue}
                trend="up"
                icon="💰"
                color="#8BC34A"
              />
              <KPICard
                title="Total Orders"
                value={overview.total_orders.toLocaleString()}
                change={overview.growth.orders}
                trend="up"
                icon="📦"
                color="#00CCBC"
              />
              <KPICard
                title="Average Order Value"
                value={`AED ${overview.avg_aov.toFixed(2)}`}
                change={overview.growth.aov}
                trend="down"
                icon="💵"
                color="#F97316"
              />
              {realtimeData && (
                <KPICard
                  title="Live Orders"
                  value={realtimeData.live_orders}
                  change="Real-time"
                  trend="neutral"
                  icon="⚡"
                  color="#7C3AED"
                  isLive={true}
                />
              )}
            </>
          )}
        </motion.div>

        {/* Main Content Grid */}
        <div className="main-content-grid">
          
          {/* Left Column */}
          <div className="left-column">
            
            {/* Revenue Trend Chart */}
            <motion.div
              id="charts-section"
              className="glass-card chart-card"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <div className="card-header">
                <h3>📊 Revenue Trends (30 Days)</h3>
                <button className="expand-btn">⛶</button>
              </div>
              <RevenueChart />
            </motion.div>

            {/* Platform Performance */}
            <motion.div
              id="platforms-section"
              className="platforms-section"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <h3 className="section-title">🚀 Platform Performance</h3>
              <div className="platforms-grid">
                {platforms.map((platform, index) => (
                  <PlatformCard 
                    key={index}
                    platform={platform}
                    delay={0.1 * index}
                  />
                ))}
              </div>
            </motion.div>

          </div>

          {/* Right Column */}
          <div className="right-column">

            {/* Location Map */}
            <div id="locations-section">
              <LocationMap
                locations={locations}
                selectedLocation={selectedLocation}
                setSelectedLocation={setSelectedLocation}
              />
            </div>

            {/* Social Media Performance */}
            {socialMedia && (
              <motion.div 
                className="glass-card social-card"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
              >
                <h3>📱 Social Media Performance</h3>
                <div className="social-grid">
                  <div className="social-metric instagram">
                    <div className="social-icon">📸</div>
                    <div className="social-stats">
                      <div className="social-value">{socialMedia.instagram.followers.toLocaleString()}</div>
                      <div className="social-label">Instagram Followers</div>
                      <div className="social-growth">{socialMedia.instagram.growth}</div>
                    </div>
                  </div>
                  <div className="social-metric facebook">
                    <div className="social-icon">📘</div>
                    <div className="social-stats">
                      <div className="social-value">{socialMedia.facebook.followers.toLocaleString()}</div>
                      <div className="social-label">Facebook Followers</div>
                      <div className="social-growth">{socialMedia.facebook.growth}</div>
                    </div>
                  </div>
                  <div className="social-metric linktree">
                    <div className="social-icon">🔗</div>
                    <div className="social-stats">
                      <div className="social-value">{socialMedia.linktree.ctr}</div>
                      <div className="social-label">Linktree CTR</div>
                      <div className="social-growth">Outstanding</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Quick Actions */}
            <motion.div 
              className="glass-card quick-actions-card"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.0, duration: 0.5 }}
            >
              <h3>⚡ Quick Actions</h3>
              <div className="quick-actions-grid">
                <button className="action-btn" onClick={() => window.open('/reports', '_blank')}>
                  <span>📊</span>
                  <span>Generate Report</span>
                </button>
                <button className="action-btn" onClick={() => alert('Email team feature coming soon!')}>
                  <span>📨</span>
                  <span>Email Team</span>
                </button>
                <button className="action-btn" onClick={loadDashboardData}>
                  <span>🔄</span>
                  <span>Refresh Data</span>
                </button>
                <button className="action-btn" onClick={() => setActiveView('settings')}>
                  <span>⚙️</span>
                  <span>Settings</span>
                </button>
              </div>
            </motion.div>

          </div>

        </div>

      </div>

      {/* Floating AI Chatbot with Maxzi Mascot */}
      <FloatingChatbot />

    </div>
  );
}

export default App;
