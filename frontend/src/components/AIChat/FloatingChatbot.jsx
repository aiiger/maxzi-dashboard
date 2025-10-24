import React, { useState, useRef, useEffect } from 'react';
import './FloatingChatbot.css';
import { dashboardAPI } from '../../services/api';

const FloatingChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      text: "Hi! I'm Maxzi AI. I can help you track missing data, tell you which reports to upload, and answer questions about your analytics. Just ask!",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [position, setPosition] = useState({ x: window.innerWidth - 100, y: window.innerHeight - 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const messagesEndRef = useRef(null);
  const chatbotRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Dragging logic
  const handleMouseDown = (e) => {
    if (!isOpen) {
      setIsDragging(true);
      setDragOffset({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging]);

  // Quick command buttons
  const quickCommands = [
    { label: '📊 What\'s missing?', command: '/missing' },
    { label: '✅ Check status', command: '/status' },
    { label: '📄 Show reports', command: '/reports' },
    { label: '❓ Help', command: '/help' }
  ];

  const handleQuickCommand = (command) => {
    handleSendMessage(command);
  };

  const handleSendMessage = async (messageText = null) => {
    const text = messageText || input.trim();
    if (!text) return;

    // Add user message
    const userMessage = {
      type: 'user',
      text: text,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Process commands
      if (text.startsWith('/')) {
        const response = await processCommand(text);
        const botMessage = {
          type: 'bot',
          text: response,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botMessage]);
      } else {
        // AI response (for now, we'll use command processing)
        const response = await processNaturalLanguage(text);
        const botMessage = {
          type: 'bot',
          text: response,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botMessage]);
      }
    } catch (error) {
      const errorMessage = {
        type: 'bot',
        text: `Sorry, I encountered an error: ${error.message}. Please try again.`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const processCommand = async (command) => {
    const cmd = command.toLowerCase();

    if (cmd === '/status') {
      const status = await dashboardAPI.getDataStatus();
      return formatStatusResponse(status);
    } else if (cmd === '/missing') {
      const status = await dashboardAPI.getDataStatus();
      return formatMissingDataResponse(status);
    } else if (cmd === '/reports') {
      return formatReportsGuide();
    } else if (cmd === '/help') {
      return formatHelpMessage();
    } else if (cmd.startsWith('/platform ')) {
      const platform = cmd.replace('/platform ', '');
      const status = await dashboardAPI.getPlatformStatus(platform);
      return formatPlatformStatus(status);
    } else {
      return "Unknown command. Try /help to see available commands.";
    }
  };

  const processNaturalLanguage = async (text) => {
    const lower = text.toLowerCase();

    // Check for status-related questions
    if (lower.includes('missing') || lower.includes('what data') || lower.includes('outdated')) {
      const status = await dashboardAPI.getDataStatus();
      return formatMissingDataResponse(status);
    }

    // Check for platform-specific questions
    if (lower.includes('deliveroo')) {
      const status = await dashboardAPI.getPlatformStatus('deliveroo');
      return formatPlatformStatus(status);
    }
    if (lower.includes('talabat')) {
      const status = await dashboardAPI.getPlatformStatus('talabat');
      return formatPlatformStatus(status);
    }
    if (lower.includes('sapaad')) {
      const status = await dashboardAPI.getPlatformStatus('sapaad');
      return formatPlatformStatus(status);
    }
    if (lower.includes('noon')) {
      const status = await dashboardAPI.getPlatformStatus('noon');
      return formatPlatformStatus(status);
    }

    // Check for report-related questions
    if (lower.includes('report') || lower.includes('upload') || lower.includes('file')) {
      return formatReportsGuide();
    }

    // Check for status questions
    if (lower.includes('up to date') || lower.includes('current') || lower.includes('status')) {
      const status = await dashboardAPI.getDataStatus();
      return formatStatusResponse(status);
    }

    // Default helpful response
    return `I can help you with:\n\n✅ Check data status (/status)\n📊 Show missing data (/missing)\n📄 List report types (/reports)\n🔍 Check specific platform (/platform deliveroo)\n\nJust ask naturally or use a command!`;
  };

  const formatStatusResponse = (status) => {
    if (!status || !status.platforms) return "Unable to fetch status.";

    let response = `📅 DATA STATUS CHECK - ${status.check_date}\n\n`;

    Object.entries(status.platforms).forEach(([platform, data]) => {
      const emoji = data.status === 'current' ? '✅' : '⚠️';
      const statusText = data.status === 'current' ? 'CURRENT' : 'OUTDATED';

      response += `${emoji} ${platform.toUpperCase()}\n`;
      response += `   Last updated: ${data.last_updated}\n`;
      response += `   Days behind: ${data.days_behind}\n`;
      response += `   Status: ${statusText}\n\n`;
    });

    return response;
  };

  const formatMissingDataResponse = (status) => {
    if (!status || !status.platforms) return "Unable to fetch status.";

    let response = `⚠️ MISSING DATA REPORT - ${status.check_date}\n\n`;
    let hasOutdated = false;

    Object.entries(status.platforms).forEach(([platform, data]) => {
      if (data.status === 'outdated') {
        hasOutdated = true;
        response += `🔴 ${platform.toUpperCase()} (${data.days_behind} days behind)\n`;
        response += `   Last: ${data.last_updated}\n`;

        if (data.reports_needed?.financial?.length > 0) {
          response += `   📊 FINANCIAL REPORTS NEEDED:\n`;
          data.reports_needed.financial.forEach(report => {
            response += `     • ${report.report} (${report.priority})\n`;
            response += `       ${report.description}\n`;
            response += `       Format: ${report.file_format}\n`;
            if (report.date_range) {
              response += `       Missing: ${report.date_range}\n`;
            }
          });
        }

        if (data.reports_needed?.operational?.length > 0) {
          response += `   ⚙️ OPERATIONAL REPORTS:\n`;
          data.reports_needed.operational.forEach(report => {
            response += `     • ${report.report} (${report.priority})\n`;
          });
        }
        response += `\n`;
      }
    });

    if (!hasOutdated) {
      response = `✅ All your data is up to date!\n\nLast updates:\n`;
      Object.entries(status.platforms).forEach(([platform, data]) => {
        response += `• ${platform}: ${data.last_updated}\n`;
      });
    }

    return response;
  };

  const formatPlatformStatus = (response) => {
    if (!response || !response.data) return "Platform not found.";

    const { platform, data, check_date } = response;
    const emoji = data.status === 'current' ? '✅' : '⚠️';

    let message = `${emoji} ${platform.toUpperCase()} STATUS - ${check_date}\n\n`;
    message += `Last updated: ${data.last_updated}\n`;
    message += `Days behind: ${data.days_behind}\n`;
    message += `Total orders: ${data.total_orders.toLocaleString()}\n`;
    message += `Status: ${data.status.toUpperCase()}\n\n`;

    if (data.reports_needed?.financial?.length > 0) {
      message += `📊 FINANCIAL REPORTS NEEDED:\n`;
      data.reports_needed.financial.forEach(report => {
        message += `• ${report.report} (${report.priority})\n`;
        message += `  ${report.description}\n`;
        message += `  Format: ${report.file_format}\n`;
        if (report.date_range) {
          message += `  Missing: ${report.date_range}\n`;
        }
      });
    }

    return message;
  };

  const formatReportsGuide = () => {
    return `📄 REPORT TYPES GUIDE\n\n` +
      `🔴 HIGH PRIORITY (Financial - Daily):\n` +
      `• Deliveroo: order_history.csv\n` +
      `• Talabat: transaction_history.csv\n` +
      `• SAPAAD: location_sales.csv\n\n` +
      `🟡 MEDIUM PRIORITY (Operational - Weekly):\n` +
      `• Deliveroo: delivery_performance.csv\n` +
      `• SAPAAD: payment_methods (included in sales)\n\n` +
      `🟢 LOW PRIORITY (Operational - Monthly):\n` +
      `• Talabat: prep time, rejections, offline duration\n` +
      `• Noon: Monthly transaction summary\n\n` +
      `Need details on a specific platform? Ask:\n` +
      `"Where do I find Deliveroo reports?" or "/platform deliveroo"`;
  };

  const formatHelpMessage = () => {
    return `🤖 MAXZI AI COMMANDS\n\n` +
      `Quick Commands:\n` +
      `/status - Check all platforms\n` +
      `/missing - Show missing data\n` +
      `/reports - List report types\n` +
      `/platform {name} - Check specific platform\n\n` +
      `Or just ask naturally:\n` +
      `• "What data is missing?"\n` +
      `• "Is my Deliveroo data current?"\n` +
      `• "Which reports do I need?"\n` +
      `• "Where do I find Talabat reports?"\n\n` +
      `I'm here to help! 🚀`;
  };

  return (
    <>
      {/* Floating Mascot Icon */}
      <div
        ref={chatbotRef}
        className={`floating-chatbot-icon ${isOpen ? 'open' : ''} ${isDragging ? 'dragging' : ''}`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          cursor: isDragging ? 'grabbing' : 'grab'
        }}
        onMouseDown={handleMouseDown}
        onClick={() => !isDragging && setIsOpen(!isOpen)}
      >
        <img
          src="/maxzi-mascot.png"
          alt="Maxzi AI"
          className="mascot-image"
          onError={(e) => {
            // Fallback if image not found
            e.target.style.display = 'none';
            e.target.parentElement.innerHTML = '🤖';
          }}
        />
        {!isOpen && <div className="pulse-ring"></div>}
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div
          className="floating-chat-window"
          style={{
            left: `${Math.max(10, position.x - 350)}px`,
            top: `${Math.max(10, position.y - 500)}px`
          }}
        >
          <div className="chat-header">
            <div className="chat-header-content">
              <img src="/maxzi-mascot.png" alt="Maxzi" className="header-mascot" />
              <div>
                <h3>Maxzi AI Assistant</h3>
                <span className="status-dot"></span>
                <span className="status-text">Online</span>
              </div>
            </div>
            <button className="close-button" onClick={() => setIsOpen(false)}>✕</button>
          </div>

          <div className="chat-messages">
            {messages.map((message, index) => (
              <div key={index} className={`message ${message.type}`}>
                {message.type === 'bot' && (
                  <img src="/maxzi-mascot.png" alt="Maxzi" className="message-avatar" />
                )}
                <div className="message-content">
                  <div className="message-text">{message.text}</div>
                  <div className="message-time">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="message bot">
                <img src="/maxzi-mascot.png" alt="Maxzi" className="message-avatar" />
                <div className="message-content">
                  <div className="typing-indicator">
                    <span></span><span></span><span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="quick-commands">
            {quickCommands.map((cmd, index) => (
              <button
                key={index}
                className="quick-command-btn"
                onClick={() => handleQuickCommand(cmd.command)}
              >
                {cmd.label}
              </button>
            ))}
          </div>

          <div className="chat-input-container">
            <input
              type="text"
              className="chat-input"
              placeholder="Ask me anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              disabled={isLoading}
            />
            <button
              className="send-button"
              onClick={() => handleSendMessage()}
              disabled={isLoading || !input.trim()}
            >
              🚀
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingChatbot;
