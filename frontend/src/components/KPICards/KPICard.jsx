/**
 * KPI Card Component
 * Displays key performance indicators with animations
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './KPICard.css';

const KPICard = ({ title, value, change, trend, icon, color, isLive = false }) => {
  const [displayValue, setDisplayValue] = useState(0);

  // Animate number counting
  useEffect(() => {
    if (typeof value === 'number') {
      let start = 0;
      const end = value;
      const duration = 1000;
      const increment = end / (duration / 16);

      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setDisplayValue(end);
          clearInterval(timer);
        } else {
          setDisplayValue(Math.floor(start));
        }
      }, 16);

      return () => clearInterval(timer);
    }
  }, [value]);

  const getTrendColor = () => {
    if (trend === 'up') return '#22C55E';
    if (trend === 'down') return '#EF4444';
    return '#6B7280';
  };

  const getTrendIcon = () => {
    if (trend === 'up') return '▲';
    if (trend === 'down') return '▼';
    return '●';
  };

  return (
    <motion.div 
      className="kpi-card"
      style={{ borderColor: `${color}40` }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ 
        y: -5,
        boxShadow: `0 12px 40px ${color}40`
      }}
      transition={{ duration: 0.3 }}
    >
      <div className="kpi-header">
        <span className="kpi-icon" style={{ color }}>{icon}</span>
        {isLive && <span className="live-badge">LIVE</span>}
      </div>

      <div className="kpi-content">
        <div className="kpi-value" style={{ color }}>
          {typeof value === 'number' ? displayValue.toLocaleString() : value}
        </div>
        <div className="kpi-title">{title}</div>
      </div>

      <div className="kpi-footer">
        <span 
          className="kpi-change" 
          style={{ color: getTrendColor() }}
        >
          {getTrendIcon()} {change}
        </span>
      </div>
    </motion.div>
  );
};

export default KPICard;
