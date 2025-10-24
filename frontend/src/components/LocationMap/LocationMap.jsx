/**
 * Location Map Component
 * Interactive location performance dashboard
 */

import React from 'react';
import { motion } from 'framer-motion';
import './LocationMap.css';

const LocationMap = ({ locations, selectedLocation, setSelectedLocation }) => {
  
  const getPerformanceColor = (location) => {
    const aov = location.aov || 0;
    if (aov > 120) return '#22C55E';
    if (aov > 110) return '#8BC34A';
    if (aov > 100) return '#F59E0B';
    return '#EF4444';
  };

  const getLocationIcon = (type) => {
    return type === 'franchise' ? '🤝' : '🏢';
  };

  const sortedLocations = [...locations].sort((a, b) => b.revenue - a.revenue);

  return (
    <motion.div 
      className="location-map-card glass-card"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.6, duration: 0.5 }}
    >
      <div className="card-header">
        <h3>📍 Location Performance</h3>
        <span className="location-count">{locations.length} Active</span>
      </div>

      <div className="locations-list">
        {sortedLocations.map((location, index) => (
          <motion.div
            key={location.location_id}
            className={`location-item ${selectedLocation === location.location_id ? 'selected' : ''}`}
            onClick={() => setSelectedLocation(location.location_id)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            whileHover={{ x: 5 }}
          >
            <div className="location-header">
              <div className="location-info">
                <span className="location-icon">
                  {getLocationIcon(location.location_type)}
                </span>
                <div className="location-name-wrapper">
                  <div className="location-name">{location.location_name}</div>
                  <div className="location-type">
                    {location.location_type === 'franchise' ? 'Franchise' : 'Restaurant'}
                  </div>
                </div>
              </div>
              <div 
                className="location-status"
                style={{ background: getPerformanceColor(location) }}
              ></div>
            </div>

            <div className="location-stats">
              <div className="stat-item">
                <span className="stat-label">Revenue</span>
                <span className="stat-value">
                  AED {(location.revenue / 1000).toFixed(1)}K
                </span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Orders</span>
                <span className="stat-value">{location.orders}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">AOV</span>
                <span 
                  className="stat-value"
                  style={{ color: getPerformanceColor(location) }}
                >
                  AED {location.aov?.toFixed(2)}
                </span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Rating</span>
                <span className="stat-value">{location.rating}⭐</span>
              </div>
            </div>

            {location.gmb_views && (
              <div className="location-gmb">
                <span className="gmb-stat">
                  👁️ {location.gmb_views.toLocaleString()} views
                </span>
                <span className="gmb-stat">
                  📞 {location.gmb_calls} calls
                </span>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      <div className="location-legend">
        <div className="legend-item">
          <div className="legend-dot" style={{ background: '#22C55E' }}></div>
          <span>Excellent (AOV &gt; 120)</span>
        </div>
        <div className="legend-item">
          <div className="legend-dot" style={{ background: '#8BC34A' }}></div>
          <span>Good (AOV 110-120)</span>
        </div>
        <div className="legend-item">
          <div className="legend-dot" style={{ background: '#F59E0B' }}></div>
          <span>Average (AOV 100-110)</span>
        </div>
        <div className="legend-item">
          <div className="legend-dot" style={{ background: '#EF4444' }}></div>
          <span>Needs Attention (&lt; 100)</span>
        </div>
      </div>
    </motion.div>
  );
};

export default LocationMap;
