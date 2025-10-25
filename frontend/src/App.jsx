/**
 * MAXZI Analytics Dashboard - Main App Component
 * Premium 2025 Design with Glassmorphism & Real-time Data
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
  const [aiInsights] = useState(null); // Reserved for future AI insights feature
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState('overview');
  const [selectedLocation, setSelectedLocation] = useState(null);

  // Helper function to get platform icons
  const getPlatformIcon = (platform) => {
    const icons = {
      deliveroo: '🚚',
      talabat: '🛵',
      sapaad: '🏪',
      noon: '🌙'
    };
    return icons[platform.toLowerCase()] || '📦';
  };

  // Helper function to aggregate location data by location name
  const aggregateLocationsByName = (locationData) => {
    const aggregated = {};

    locationData.forEach(item => {
      const locName = item.location;
      if (!aggregated[locName]) {
        aggregated[locName] = {
          location_name: locName,
          revenue: 0,
          orders: 0,
          platforms: []
        };
      }
      aggregated[locName].revenue += item.total_revenue;
      aggregated[locName].orders += item.total_orders;
      aggregated[locName].platforms.push(item.platform);
    });

    // Convert to array and calculate AOV
    return Object.values(aggregated).map(loc => ({
      ...loc,
      aov: loc.orders > 0 ? loc.revenue / loc.orders : 0,
      rating: 'N/A',
      type: 'branch'
    }));
  };

  // Load Dashboard Data
  useEffect(() => {
    loadDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

      // Extract data from backend response wrapper and transform
      const transformedOverview = overviewData?.data ? {
        total_revenue: overviewData.data.total_revenue,
        total_orders: overviewData.data.total_orders,
        avg_aov: overviewData.data.avg_order_value,
        growth: {
          revenue: 'N/A',
          orders: 'N/A',
          aov: 'N/A'
        }
      } : null;

      // Transform platforms data
      const platformColors = {
        deliveroo: '#00CCBC',
        talabat: '#FF5A00',
        sapaad: '#8BC34A',
        noon: '#FFC107'
      };

      const transformedPlatforms = platformsData?.data ? platformsData.data.map(p => ({
        name: p.platform.charAt(0).toUpperCase() + p.platform.slice(1),
        platform: p.platform,
        revenue: p.total_revenue,
        orders: p.total_orders,
        aov: p.avg_order_value,
        growth: 'N/A',
        icon: getPlatformIcon(p.platform),
        color: platformColors[p.platform.toLowerCase()] || '#6B7280'
      })) : [];

      // Aggregate locations data by location name
      const transformedLocations = locationsData?.data ? aggregateLocationsByName(locationsData.data) : [];

      console.log('Transformed Overview:', transformedOverview);
      console.log('Transformed Platforms:', transformedPlatforms);
      console.log('Transformed Locations:', transformedLocations);

      setOverview(transformedOverview);
      setLocations(transformedLocations);
      setPlatforms(transformedPlatforms);

      // Fetch Meta/Social Media data from backend
      try {
        const socialData = await dashboardAPI.getSocialMedia();
        console.log('Backend Response - Social Media:', JSON.stringify(socialData, null, 2));

        if (socialData?.data) {
          setSocialMedia({
            instagram: {
              followers: socialData.data.instagram?.followers || 0,
              growth: socialData.data.instagram?.growth || 'N/A'
            },
            facebook: {
              followers: socialData.data.facebook?.fans || 0,
              growth: socialData.data.facebook?.growth || 'N/A'
            },
            linktree: {
              ctr: 'N/A'
            }
          });
        } else {
          setSocialMedia(null);
        }
      } catch (err) {
        console.warn('Social Media API failed:', err);
        setSocialMedia(null);
      }

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

        {/* KPI Cards Row - Show only on Overview */}
        {activeView === 'overview' && overview && (
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

        {/* LOCATIONS VIEW - Location Performance by Platform */}
        {activeView === 'locations' && (
          <div className="main-content-grid">
            <div className="full-width-section">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="section-title">📍 Locations by Platform</h2>

                {/* Platform sections in 2-column grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  {['deliveroo', 'talabat', 'sapaad', 'noon'].map((platformName, idx) => {
                    const platformLocations = locations.filter(loc =>
                      loc.platforms && loc.platforms.includes(platformName)
                    );

                    if (platformLocations.length === 0) return null;

                    const platformConfig = {
                      deliveroo: { name: 'Deliveroo', icon: '🚚', color: '#00CCBC', gradient: 'linear-gradient(135deg, rgba(0, 204, 188, 0.1) 0%, rgba(0, 204, 188, 0.05) 100%)' },
                      talabat: { name: 'Talabat', icon: '🛵', color: '#FF5A00', gradient: 'linear-gradient(135deg, rgba(255, 90, 0, 0.1) 0%, rgba(255, 90, 0, 0.05) 100%)' },
                      sapaad: { name: 'SAPAAD (Dine-in)', icon: '🏪', color: '#8BC34A', gradient: 'linear-gradient(135deg, rgba(139, 195, 74, 0.1) 0%, rgba(139, 195, 74, 0.05) 100%)' },
                      noon: { name: 'Noon', icon: '🌙', color: '#FFC107', gradient: 'linear-gradient(135deg, rgba(255, 193, 7, 0.1) 0%, rgba(255, 193, 7, 0.05) 100%)' }
                    };

                    const config = platformConfig[platformName];

                    return (
                      <motion.div
                        key={platformName}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.1, duration: 0.5 }}
                        className="glass-card"
                        style={{
                          background: config.gradient,
                          border: `2px solid ${config.color}30`,
                          borderRadius: '16px',
                          padding: '20px',
                          position: 'relative',
                          overflow: 'hidden'
                        }}
                      >
                        {/* Platform Header */}
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginBottom: '20px',
                          paddingBottom: '15px',
                          borderBottom: `2px solid ${config.color}30`
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{
                              fontSize: '2rem',
                              background: `${config.color}20`,
                              padding: '8px 12px',
                              borderRadius: '12px',
                              lineHeight: 1
                            }}>
                              {config.icon}
                            </div>
                            <div>
                              <h3 style={{ color: config.color, fontSize: '1.4rem', margin: 0 }}>
                                {config.name}
                              </h3>
                              <p style={{ color: '#888', fontSize: '0.9rem', margin: '4px 0 0 0' }}>
                                {platformLocations.length} locations
                              </p>
                            </div>
                          </div>
                          <div style={{
                            background: `${config.color}15`,
                            color: config.color,
                            padding: '6px 12px',
                            borderRadius: '20px',
                            fontSize: '0.85rem',
                            fontWeight: 'bold'
                          }}>
                            AED {(platformLocations.reduce((sum, loc) => sum + (loc.revenue || 0), 0) / 1000).toFixed(0)}K
                          </div>
                        </div>

                        {/* Locations Grid */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '400px', overflowY: 'auto' }}>
                          {platformLocations.map((location, locIdx) => (
                            <motion.div
                              key={location.location_name}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.1 + locIdx * 0.05, duration: 0.3 }}
                              whileHover={{ scale: 1.02, x: 5 }}
                              style={{
                                background: 'rgba(255, 255, 255, 0.05)',
                                backdropFilter: 'blur(10px)',
                                borderRadius: '10px',
                                padding: '12px 15px',
                                border: `1px solid ${config.color}20`,
                                cursor: 'pointer',
                                transition: 'all 0.3s'
                              }}
                            >
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                                <span style={{ fontWeight: 'bold', fontSize: '0.95rem', flex: 1 }}>
                                  {location.location_name}
                                </span>
                                <span style={{
                                  background: `${config.color}20`,
                                  color: config.color,
                                  padding: '2px 8px',
                                  borderRadius: '12px',
                                  fontSize: '0.75rem',
                                  fontWeight: 'bold'
                                }}>
                                  {(location.orders || 0).toLocaleString()}
                                </span>
                              </div>
                              <div style={{ display: 'flex', gap: '15px', fontSize: '0.85rem' }}>
                                <div>
                                  <span style={{ color: '#888' }}>💰 </span>
                                  <span style={{ color: config.color, fontWeight: 'bold' }}>
                                    {((location.revenue || 0) / 1000).toFixed(1)}K
                                  </span>
                                </div>
                                <div>
                                  <span style={{ color: '#888' }}>📊 AOV </span>
                                  <span style={{ fontWeight: 'bold' }}>
                                    {(location.aov || 0).toFixed(0)}
                                  </span>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            </div>
          </div>
        )}

        {/* ANALYTICS VIEW - Charts and Trends */}
        {activeView === 'analytics' && (
          <div className="main-content-grid">
            <div className="full-width-section">
              <h2 className="section-title">📊 Analytics & Insights</h2>

              <motion.div
                className="glass-card chart-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                style={{ marginBottom: '20px' }}
              >
                <div className="card-header">
                  <h3>📈 30-Day Revenue Trend</h3>
                  <button className="expand-btn">⛶</button>
                </div>
                <RevenueChart />
              </motion.div>

              {/* Analytics Summary Stats */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                <motion.div
                  className="glass-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.5 }}
                  style={{ padding: '20px' }}
                >
                  <h4 style={{ marginBottom: '15px', color: '#8BC34A' }}>📊 Key Metrics</h4>
                  {overview && (
                    <div style={{ fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#888' }}>Total Revenue:</span>
                        <span style={{ fontWeight: 'bold' }}>AED {overview.total_revenue.toLocaleString()}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#888' }}>Total Orders:</span>
                        <span style={{ fontWeight: 'bold' }}>{overview.total_orders.toLocaleString()}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#888' }}>Average AOV:</span>
                        <span style={{ fontWeight: 'bold' }}>AED {overview.avg_aov.toFixed(2)}</span>
                      </div>
                    </div>
                  )}
                </motion.div>

                <motion.div
                  className="glass-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  style={{ padding: '20px' }}
                >
                  <h4 style={{ marginBottom: '15px', color: '#00CCBC' }}>🚚 Platform Breakdown</h4>
                  <div style={{ fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {platforms.slice(0, 4).map((p, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#888' }}>{p.name}:</span>
                        <span style={{ fontWeight: 'bold', color: p.color }}>
                          AED {((p.revenue || 0) / 1000).toFixed(0)}K
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>

                <motion.div
                  className="glass-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  style={{ padding: '20px' }}
                >
                  <h4 style={{ marginBottom: '15px', color: '#F97316' }}>📍 Top Locations</h4>
                  <div style={{ fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {locations.slice(0, 5).map((loc, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#888', fontSize: '0.85rem' }}>{loc.location_name.substring(0, 20)}...</span>
                        <span style={{ fontWeight: 'bold' }}>
                          AED {((loc.revenue || 0) / 1000).toFixed(0)}K
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
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
