/**
 * Platform Card Component
 * Displays delivery platform performance with expand/collapse
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './PlatformCard.css';

const PlatformCard = ({ platform, delay = 0 }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getPerformanceStatus = () => {
    const growth = parseFloat(platform.growth);
    if (growth > 20) return { label: '🚀 SURGING', color: '#22C55E' };
    if (growth > 0) return { label: '📈 GROWING', color: '#8BC34A' };
    if (growth < -10) return { label: '⚠️ DECLINING', color: '#EF4444' };
    return { label: '➡️ STABLE', color: '#6B7280' };
  };

  const status = getPerformanceStatus();

  return (
    <motion.div 
      className={`platform-card ${isExpanded ? 'expanded' : ''}`}
      style={{ borderLeftColor: platform.color }}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="platform-header">
        <div className="platform-icon" style={{
          background: `${platform.color}20`,
          color: platform.color
        }}>
          {platform.icon}
        </div>

        <div className="platform-info">
          <h4>{platform.name}</h4>
          <span
            className="platform-status"
            style={{ color: status.color }}
          >
            {status.label}
          </span>
        </div>

        {platform.rating && (
          <div className="platform-rating">
            {platform.rating}⭐
          </div>
        )}
      </div>

      <div className="platform-metrics">
        <div className="platform-metric">
          <div className="metric-label">Revenue</div>
          <div className="metric-value" style={{ color: platform.color }}>
            AED {((platform.revenue || 0) / 1000).toFixed(1)}K
          </div>
        </div>

        <div className="platform-metric">
          <div className="metric-label">Orders</div>
          <div className="metric-value">
            {(platform.orders || 0).toLocaleString()}
          </div>
        </div>

        <div className="platform-metric">
          <div className="metric-label">AOV</div>
          <div className="metric-value">
            AED {(platform.aov || 0).toFixed(2)}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div 
            className="platform-expanded"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="expanded-stats">
              {platform.market_share && (
                <div className="stat-row">
                  <span>Market Share</span>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${platform.market_share}%`,
                        background: platform.color
                      }}
                    ></div>
                  </div>
                  <span>{platform.market_share.toFixed(1)}%</span>
                </div>
              )}

              <div className="stat-row">
                <span>Growth Rate</span>
                <span className="growth-badge" style={{
                  background: `${status.color}20`,
                  color: status.color
                }}>
                  {platform.growth || 'N/A'}
                </span>
              </div>

              <div className="stat-row">
                <span>Total Revenue</span>
                <span style={{ fontWeight: 'bold', color: platform.color }}>
                  AED {(platform.revenue || 0).toLocaleString()}
                </span>
              </div>

              <div className="stat-row">
                <span>Total Orders</span>
                <span style={{ fontWeight: 'bold' }}>
                  {(platform.orders || 0).toLocaleString()}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default PlatformCard;
