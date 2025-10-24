/**
 * Floating Sidebar Navigation Component
 * Glassmorphism design with smooth animations
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './FloatingSidebar.css';

const FloatingSidebar = ({ activeView, setActiveView }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const menuItems = [
    { id: 'overview', icon: '🏠', label: 'Overview' },
    { id: 'platforms', icon: '🚚', label: 'Platforms' },
    { id: 'locations', icon: '📍', label: 'Locations' },
    { id: 'social', icon: '📱', label: 'Social Media' },
    { id: 'analytics', icon: '📊', label: 'Analytics' },
    { id: 'reports', icon: '📄', label: 'Reports' }
  ];

  return (
    <motion.div 
      className={`floating-sidebar ${isExpanded ? 'expanded' : ''}`}
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <div className="logo-circle">M</div>
          {isExpanded && (
            <motion.div 
              className="logo-text"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              MAXZI
            </motion.div>
          )}
        </div>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item, index) => (
          <motion.button
            key={item.id}
            className={`nav-item ${activeView === item.id ? 'active' : ''}`}
            onClick={() => setActiveView(item.id)}
            whileHover={{ x: 5 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <span className="nav-icon">{item.icon}</span>
            {isExpanded && (
              <motion.span 
                className="nav-label"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {item.label}
              </motion.span>
            )}
          </motion.button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="settings-btn">
          <span>⚙️</span>
          {isExpanded && <span>Settings</span>}
        </button>
      </div>
    </motion.div>
  );
};

export default FloatingSidebar;
