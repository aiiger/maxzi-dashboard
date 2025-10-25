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
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Only call endpoints that exist on the backend
      const [
        overviewData,
        locationsData,
        platformsData
      ] = await Promise.all([
        dashboardAPI.getOverview().catch(err => {
          console.warn('Overview API failed:', err);
          return null;
        }),
        dashboardAPI.getLocations().catch(err => {
          console.warn('Locations API failed:', err);
          return [];
        }),
        dashboardAPI.getPlatforms().catch(err => {
          console.warn('Platforms API failed:', err);
          return [];
        })
      ]);

      // Debug: Log what backend returns (with full structure)
      console.log('Backend Response - Overview:', JSON.stringify(overviewData, null, 2));
      console.log('Backend Response - Locations:', JSON.stringify(locationsData, null, 2));
      console.log('Backend Response - Platforms:', JSON.stringify(platformsData, null, 2));

      setOverview(overviewData);
      setLocations(locationsData);
      setPlatforms(platformsData);

      // Only set social media if backend returns it - NO MOCK DATA
      setSocialMedia(null);

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

        {/* KPI Cards Row - Show on Overview and Analytics views */}
        {(activeView === 'overview' || activeView === 'analytics') && overview && (
          <motion.div
            className="kpi-cards-grid"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <KPICard
              title="Total Revenue"
              value={`AED ${(overview.total_revenue || 0).toLocaleString()}`}
              change={overview.growth?.revenue || 'N/A'}
              trend="up"
              icon="💰"
              color="#8BC34A"
            />
            <KPICard
              title="Total Orders"
              value={(overview.total_orders || 0).toLocaleString()}
              change={overview.growth?.orders || 'N/A'}
              trend="up"
              icon="📦"
              color="#00CCBC"
            />
            <KPICard
              title="Average Order Value"
              value={`AED ${(overview.avg_aov || 0).toFixed(2)}`}
              change={overview.growth?.aov || 'N/A'}
              trend="down"
              icon="💵"
              color="#F97316"
            />
            <KPICard
              title="Active Platforms"
              value="4"
              change="Deliveroo, Talabat, SAPAAD, Noon"
              trend="neutral"
              icon="⚡"
              color="#7C3AED"
            />
          </motion.div>
        )}

        {/* OVERVIEW VIEW - Complete Dashboard */}
        {activeView === 'overview' && (
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
                {Array.isArray(platforms) && platforms.length > 0 ? (
                  platforms.map((platform, index) => (
                    <PlatformCard
                      key={index}
                      platform={platform}
                      delay={0.1 * index}
                    />
                  ))
                ) : (
                  <div style={{ padding: '40px', textAlign: 'center', color: '#888' }}>
                    <p>No platform data available</p>
                  </div>
                )}
              </div>
            </motion.div>

          </div>

          {/* Right Column */}
          <div className="right-column">

            {/* Location Map */}
            <LocationMap
              locations={locations}
              selectedLocation={selectedLocation}
              setSelectedLocation={setSelectedLocation}
            />

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
        )}

        {/* PLATFORMS VIEW - Platform Performance Analysis */}
        {activeView === 'platforms' && (
          <div className="main-content-grid">
            <div className="full-width-section">
              <motion.div
                className="platforms-section"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="section-title">🚀 Platform Performance Analysis</h2>
                <div className="platforms-grid">
                  {Array.isArray(platforms) && platforms.length > 0 ? (
                    platforms.map((platform, index) => (
                      <PlatformCard
                        key={index}
                        platform={platform}
                        delay={0.1 * index}
                      />
                    ))
                  ) : (
                    <div style={{ padding: '40px', textAlign: 'center', color: '#888' }}>
                      <p style={{ fontSize: '18px', marginBottom: '10px' }}>No platform data available</p>
                      <p style={{ fontSize: '14px' }}>Check backend connection at http://localhost:3004</p>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        )}

        {/* LOCATIONS VIEW - Location Performance */}
        {activeView === 'locations' && (
          <div className="main-content-grid">
            <div className="full-width-section">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="section-title">📍 Location Performance</h2>
                <LocationMap
                  locations={locations}
                  selectedLocation={selectedLocation}
                  setSelectedLocation={setSelectedLocation}
                />
              </motion.div>
            </div>
          </div>
        )}

        {/* ANALYTICS VIEW - Charts and Trends */}
        {activeView === 'analytics' && (
          <div className="main-content-grid">
            <div className="full-width-section">
              <motion.div
                className="glass-card chart-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="card-header">
                  <h3>📊 Revenue Trends (30 Days)</h3>
                  <button className="expand-btn">⛶</button>
                </div>
                <RevenueChart />
              </motion.div>
            </div>
          </div>
        )}

        {/* SOCIAL MEDIA VIEW - Social Performance */}
        {activeView === 'social' && (
          <div className="main-content-grid">
            <div className="full-width-section">
              <motion.div
                className="glass-card social-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h2>📱 Social Media Performance</h2>
                {!socialMedia ? (
                  <div style={{ padding: '40px', textAlign: 'center', color: '#888' }}>
                    <p style={{ fontSize: '18px', marginBottom: '10px' }}>No social media data available</p>
                    <p style={{ fontSize: '14px' }}>Connect Meta API to view Instagram and Facebook analytics</p>
                  </div>
                ) : (
                  <div className="social-grid">
                    <div className="social-metric instagram">
                      <div className="social-icon">📸</div>
                      <div className="social-stats">
                        <div className="social-value">{socialMedia?.instagram?.followers?.toLocaleString() || 'N/A'}</div>
                        <div className="social-label">Instagram Followers</div>
                        <div className="social-growth">{socialMedia?.instagram?.growth || 'N/A'}</div>
                      </div>
                    </div>
                    <div className="social-metric facebook">
                      <div className="social-icon">📘</div>
                      <div className="social-stats">
                        <div className="social-value">{socialMedia?.facebook?.followers?.toLocaleString() || 'N/A'}</div>
                        <div className="social-label">Facebook Followers</div>
                        <div className="social-growth">{socialMedia?.facebook?.growth || 'N/A'}</div>
                      </div>
                    </div>
                    <div className="social-metric linktree">
                      <div className="social-icon">🔗</div>
                      <div className="social-stats">
                        <div className="social-value">{socialMedia?.linktree?.ctr || 'N/A'}</div>
                        <div className="social-label">Linktree CTR</div>
                        <div className="social-growth">{socialMedia?.linktree?.growth || 'N/A'}</div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        )}

        {/* REPORTS VIEW - Quick Actions */}
        {activeView === 'reports' && (
          <div className="main-content-grid">
            <div className="full-width-section">
              <motion.div
                className="glass-card quick-actions-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h2>⚡ Quick Actions & Reports</h2>
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
        )}

      </div>

      {/* Floating AI Chatbot with Maxzi Mascot */}
      <FloatingChatbot />

    </div>
  );
}

export default App;
