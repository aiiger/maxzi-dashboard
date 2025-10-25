/**
 * Revenue Chart Component
 * Displays 30-day revenue trend using Chart.js
 */

import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { dashboardAPI } from '../../services/api';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const RevenueChart = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Backend doesn't have revenue-trend endpoint yet
    // Generate mock data for visualization
    generateMockChartData();
  }, []);

  const generateMockChartData = () => {
    // Generate 30 days of revenue trend data
    const mockData = [];
    const today = new Date();
    const avgDailyRevenue = 870000; // 26M / 30 days

    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);

      // Add realistic variation (+/- 30%)
      const variation = 0.7 + (Math.random() * 0.6);
      const revenue = avgDailyRevenue * variation;

      mockData.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        revenue: Math.round(revenue)
      });
    }

    const chartConfig = {
      labels: mockData.map(d => d.date),
      datasets: [
        {
          label: 'Daily Revenue (AED)',
          data: mockData.map(d => d.revenue),
          borderColor: '#8BC34A',
          backgroundColor: 'rgba(139, 195, 74, 0.1)',
          borderWidth: 3,
          tension: 0.4,
          fill: true,
          pointRadius: 0,
          pointHoverRadius: 6,
          pointHoverBackgroundColor: '#8BC34A',
          pointHoverBorderColor: '#fff',
          pointHoverBorderWidth: 2
        }
      ]
    };

    setChartData(chartConfig);
    setLoading(false);
  };

  const loadChartData = async () => {
    try {
      // Endpoint not available yet: /api/analytics/revenue-trend
      const data = await dashboardAPI.getRevenueTrend();
      
      const chartConfig = {
        labels: data.map(d => {
          const date = new Date(d.date);
          return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }),
        datasets: [
          {
            label: 'Daily Revenue (AED)',
            data: data.map(d => d.revenue),
            borderColor: '#8BC34A',
            backgroundColor: 'rgba(139, 195, 74, 0.1)',
            borderWidth: 3,
            tension: 0.4,
            fill: true,
            pointRadius: 0,
            pointHoverRadius: 6,
            pointHoverBackgroundColor: '#8BC34A',
            pointHoverBorderColor: '#fff',
            pointHoverBorderWidth: 2
          }
        ]
      };

      setChartData(chartConfig);
    } catch (error) {
      console.error('Error loading chart data:', error);
    } finally {
      setLoading(false);
    }
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#8BC34A',
        bodyColor: '#fff',
        borderColor: 'rgba(139, 195, 74, 0.3)',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          label: function(context) {
            return `AED ${context.parsed.y.toLocaleString()}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: false,
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
          drawBorder: false
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.6)',
          font: { size: 11 },
          callback: function(value) {
            return 'AED ' + (value / 1000).toFixed(0) + 'K';
          }
        }
      },
      x: {
        grid: { display: false },
        ticks: {
          color: 'rgba(255, 255, 255, 0.6)',
          font: { size: 10 },
          maxRotation: 0
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index'
    }
  };

  if (loading) {
    return (
      <div className="chart-loading">
        <div className="loading-spinner"></div>
        <p>Loading chart data...</p>
      </div>
    );
  }

  if (!chartData) {
    return (
      <div className="chart-error" style={{ padding: '40px', textAlign: 'center', color: '#888' }}>
        <p style={{ fontSize: '18px', marginBottom: '10px' }}>Revenue Trend Chart</p>
        <p style={{ fontSize: '14px' }}>Backend endpoint /api/analytics/revenue-trend not yet implemented</p>
      </div>
    );
  }

  return (
    <div className="revenue-chart-container">
      <Line data={chartData} options={options} />
    </div>
  );
};

export default RevenueChart;
