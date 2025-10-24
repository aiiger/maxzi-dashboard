/**
 * AI Insights Panel Component
 * Displays AI-generated predictions and recommendations
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './AIPanel.css';

const AIPanel = ({ insights }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getPriorityColor = (priority) => {
    const colors = {
      critical: '#EF4444',
      high: '#F97316',
      medium: '#F59E0B',
      low: '#8BC34A'
    };
    return colors[priority] || '#6B7280';
  };

  return (
    <motion.div 
      className="ai-panel"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
    >
      <div 
        className="ai-panel-header"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="ai-header-left">
          <span className="ai-icon">🤖</span>
          <div className="ai-header-text">
            <h3>AI Business Intelligence</h3>
            <p>{insights.summary}</p>
          </div>
        </div>
        <button className="ai-toggle">
          {isExpanded ? '▼' : '▶'}
        </button>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div 
            className="ai-panel-content"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Predictions */}
            <div className="ai-section">
              <h4>🔮 Predictive Analytics</h4>
              <div className="predictions-grid">
                {insights.predictions.map((prediction, index) => (
                  <motion.div 
                    key={index}
                    className="prediction-card"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <span className="pred-icon">{prediction.icon}</span>
                    <div className="pred-content">
                      <p className="pred-text">{prediction.text}</p>
                      <div className="confidence-bar">
                        <div 
                          className="confidence-fill"
                          style={{ width: `${prediction.confidence}%` }}
                        ></div>
                      </div>
                      <span className="confidence-label">
                        {prediction.confidence}% confidence
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div className="ai-section">
              <h4>💡 Strategic Recommendations</h4>
              <div className="recommendations-list">
                {insights.recommendations.map((rec, index) => (
                  <motion.div 
                    key={index}
                    className={`recommendation-card priority-${rec.priority}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + (index * 0.1) }}
                  >
                    <div className="rec-header">
                      <span 
                        className="priority-badge"
                        style={{ background: getPriorityColor(rec.priority) }}
                      >
                        {rec.priority.toUpperCase()}
                      </span>
                      <span className="rec-timeline">{rec.timeline}</span>
                    </div>
                    <h5>{rec.title}</h5>
                    <p>{rec.description}</p>
                    <div className="rec-footer">
                      <span className="impact-badge">
                        📈 {rec.impact}
                      </span>
                      <button className="action-btn-small">
                        Take Action →
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Active Alerts */}
            {insights.alerts && insights.alerts.length > 0 && (
              <div className="ai-section">
                <h4>🚨 Active Alerts</h4>
                <div className="alerts-list">
                  {insights.alerts.map((alert, index) => (
                    <div 
                      key={index}
                      className={`alert-item ${alert.type}`}
                    >
                      <span className="alert-platform">{alert.platform}</span>
                      <span className="alert-message">{alert.message}</span>
                      <span className="alert-time">
                        {new Date(alert.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AIPanel;
