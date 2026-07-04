/* src/components/Sidebar.jsx */
import React, { useContext } from 'react';
import { AppStateContext } from '../context/AppStateContext';
import { 
  LayoutDashboard, 
  BookOpen, 
  Building2, 
  Code, 
  FileText, 
  MessageSquareCode, 
  PenTool, 
  BarChart3, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  Flame
} from 'lucide-react';

const Sidebar = () => {
  const { 
    activeTab, 
    setActiveTab, 
    sidebarCollapsed, 
    setSidebarCollapsed, 
    streak 
  } = useContext(AppStateContext);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'prep', label: 'Prep Modules', icon: BookOpen },
    { id: 'company', label: 'Company Prep', icon: Building2 },
    { id: 'coding', label: 'Coding IDE', icon: Code },
    { id: 'ats', label: 'Resume ATS', icon: FileText },
    { id: 'interview', label: 'Mock Interview', icon: MessageSquareCode },
    { id: 'practice', label: 'Practice & Mock', icon: PenTool },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'admin', label: 'Admin Panel', icon: Settings },
  ];

  return (
    <div 
      className={`glass-panel ${sidebarCollapsed ? 'collapsed' : ''}`}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        width: sidebarCollapsed ? 'var(--sidebar-collapsed-width)' : 'var(--sidebar-width)',
        height: '100vh',
        zIndex: 100,
        borderRadius: 0,
        borderRight: '1px solid var(--border-light)',
        borderTop: 'none',
        borderBottom: 'none',
        borderLeft: 'none',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width var(--transition-normal)',
        overflow: 'hidden'
      }}
    >
      {/* Sidebar Header / Logo */}
      <div 
        style={{
          height: 'var(--header-height)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: sidebarCollapsed ? 'center' : 'space-between',
          padding: '0 20px',
          borderBottom: '1px solid var(--border-light)'
        }}
      >
        {!sidebarCollapsed && (
          <h2 style={{ 
            fontSize: '1.25rem', 
            fontWeight: 800, 
            background: 'linear-gradient(to right, var(--primary), var(--secondary))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '0.05em'
          }}>
            PREP.AI
          </h2>
        )}
        <button 
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="flex-center"
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid var(--border-light)',
            color: 'var(--text-primary)',
            borderRadius: '4px',
            width: '28px',
            height: '28px',
            cursor: 'pointer',
            transition: 'background var(--transition-fast)'
          }}
        >
          {sidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Navigation Items */}
      <nav style={{ flex: 1, padding: '20px 10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                gap: '12px',
                padding: '12px',
                border: 'none',
                borderRadius: '8px',
                background: isActive 
                  ? 'linear-gradient(to right, rgba(99, 102, 241, 0.15), rgba(168, 85, 247, 0.15))' 
                  : 'transparent',
                color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                borderLeft: isActive ? '3px solid var(--primary)' : '3px solid transparent',
                cursor: 'pointer',
                textAlign: 'left',
                width: '100%',
                transition: 'all var(--transition-fast)'
              }}
              className={isActive ? 'pulse-glow' : ''}
            >
              <Icon size={20} style={{ color: isActive ? 'var(--primary)' : 'inherit' }} />
              {!sidebarCollapsed && (
                <span style={{ fontSize: '0.9rem', fontWeight: isActive ? 600 : 400 }}>
                  {item.label}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Streak Fire Section */}
      <div 
        style={{
          padding: '20px 15px',
          borderTop: '1px solid var(--border-light)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '10px'
        }}
      >
        <div 
          className="flex-center" 
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: 'rgba(245, 158, 11, 0.15)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            color: 'var(--warning)',
            boxShadow: '0 0 10px rgba(245, 158, 11, 0.2)'
          }}
        >
          <Flame size={22} fill="var(--warning)" className="pulse-glow" />
        </div>
        {!sidebarCollapsed && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>STUDY STREAK</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {streak} Days Active!
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
