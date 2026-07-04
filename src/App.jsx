/* src/App.jsx */
import React, { useContext, useEffect, useState } from 'react';
import { AppStateProvider, AppStateContext } from './context/AppStateContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';

// Feature Modules
import Dashboard from './modules/Dashboard';
import PrepModules from './modules/PrepModules';
import CompanyPrep from './modules/CompanyPrep';
import CodingPlatform from './modules/CodingPlatform';
import ResumeATS from './modules/ResumeATS';
import MockInterview from './modules/MockInterview';
import PracticeSection from './modules/PracticeSection';
import Analytics from './modules/Analytics';
import AdminPanel from './modules/AdminPanel';

import { X } from 'lucide-react';

const AppContent = () => {
  const { activeTab, sidebarCollapsed, notifications, setNotifications } = useContext(AppStateContext);
  const [backendConnected, setBackendConnected] = useState(false);

  const renderActiveModule = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'prep': return <PrepModules />;
      case 'company': return <CompanyPrep />;
      case 'coding': return <CodingPlatform />;
      case 'ats': return <ResumeATS />;
      case 'interview': return <MockInterview />;
      case 'practice': return <PracticeSection />;
      case 'analytics': return <Analytics />;
      case 'admin': return <AdminPanel />;
      default: return <Dashboard />;
    }
  };

  useEffect(() => {
    const backendUrl = 'http://127.0.0.1:4000/api/ping';
    const checkBackend = async () => {
      try {
        const response = await fetch(backendUrl);
        if (!response.ok) throw new Error('Backend unreachable');
        setBackendConnected(true);
        setNotifications(prev => [
          { id: 'backend-ok', type: 'success', title: 'Backend Connected', message: 'The backend service is available on port 4000.', time: 'Just now' },
          ...prev.filter(n => n.id !== 'backend-fail' && n.id !== 'backend-ok')
        ]);
      } catch (error) {
        setBackendConnected(false);
        setNotifications(prev => [
          { id: 'backend-fail', type: 'error', title: 'Backend Unavailable', message: 'The app could not reach http://127.0.0.1:4000.', time: 'Just now' },
          ...prev.filter(n => n.id !== 'backend-ok' && n.id !== 'backend-fail')
        ]);
      }
    };

    checkBackend();
  }, [setNotifications]);

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="app-container">
      {/* Sidebar navigation */}
      <Sidebar />

      {/* Main viewport */}
      <main className={`main-content ${sidebarCollapsed ? 'collapsed' : ''}`}>
        {/* Header toolbar */}
        <Header />

        <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '8px 0' }}>
          <span
            style={{
              fontSize: '0.8rem',
              color: backendConnected ? 'var(--success)' : 'var(--danger)',
              fontWeight: 600,
              opacity: 0.85
            }}
          >
            {backendConnected ? 'Backend connected' : 'Backend connection pending...'}
          </span>
        </div>

        {/* Dynamic content view */}
        <div style={{ flex: 1 }}>
          {renderActiveModule()}
        </div>
      </main>

      {/* Real-time Toast Notifications overlay */}
      <div 
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 400,
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          maxWidth: '350px',
          pointerEvents: 'none'
        }}
      >
        {notifications.slice(0, 3).map((not) => (
          <div
            key={not.id}
            className="glass-panel animate-fade-in"
            style={{
              padding: '12px 16px',
              background: 'rgba(15, 23, 42, 0.9)',
              borderLeft: `4px solid ${
                not.type === 'success' ? 'var(--accent)' : 
                not.type === 'error' ? 'var(--danger)' : 
                not.type === 'warning' ? 'var(--warning)' : 
                'var(--primary)'
              }`,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '12px',
              pointerEvents: 'auto',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)'
            }}
          >
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>{not.title}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>{not.message}</div>
            </div>
            <button
              onClick={() => removeNotification(not.id)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: '4px'
              }}
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

function App() {
  return (
    <AppStateProvider>
      <AppContent />
    </AppStateProvider>
  );
}

export default App;
