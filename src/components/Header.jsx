/* src/components/Header.jsx */
import React, { useContext, useState } from 'react';
import { AppStateContext } from '../context/AppStateContext';
import { Bell, User, Edit3, X, Check } from 'lucide-react';

const Header = () => {
  const { 
    activeTab, 
    userProfile, 
    setUserProfile, 
    notifications, 
    setNotifications 
  } = useContext(AppStateContext);

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  
  // Profile edit states
  const [profileForm, setProfileForm] = useState({ ...userProfile });

  const getTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Dashboard Overview';
      case 'prep': return 'Placement Prep Modules';
      case 'company': return 'Company Preparation';
      case 'coding': return 'Online Coding Sandbox';
      case 'ats': return 'Resume ATS Evaluator';
      case 'interview': return 'AI Mock Interview Coach';
      case 'practice': return 'Practice Center & Exams';
      case 'analytics': return 'Performance Analytics';
      case 'admin': return 'System Administrator Console';
      default: return 'Placement Preparation';
    }
  };

  const handleProfileSave = (e) => {
    e.preventDefault();
    setUserProfile(profileForm);
    setShowProfileModal(false);
  };

  const clearNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <header
      className="glass-panel"
      style={{
        height: 'var(--header-height)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        marginBottom: '24px',
        borderRadius: 'var(--border-radius-md)',
        position: 'relative'
      }}
    >
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>
          {getTitle()}
        </h1>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Notifications Icon & Panel */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="flex-center"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid var(--border-light)',
              color: 'var(--text-primary)',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              cursor: 'pointer',
              position: 'relative',
              transition: 'background var(--transition-fast)'
            }}
          >
            <Bell size={20} />
            {notifications.length > 0 && (
              <span style={{
                position: 'absolute',
                top: '-2px',
                right: '-2px',
                background: 'var(--danger)',
                color: 'white',
                fontSize: '0.65rem',
                fontWeight: 'bold',
                padding: '2px 6px',
                borderRadius: '10px'
              }}>
                {notifications.length}
              </span>
            )}
          </button>

          {showNotifications && (
            <div
              className="glass-panel animate-fade-in"
              style={{
                position: 'absolute',
                top: '55px',
                right: 0,
                width: '320px',
                maxHeight: '400px',
                overflowY: 'auto',
                zIndex: 200,
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-light)', paddingBottom: '8px' }}>
                <span style={{ fontWeight: 600 }}>Notifications</span>
                {notifications.length > 0 && (
                  <button 
                    onClick={() => setNotifications([])} 
                    style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.8rem', cursor: 'pointer' }}
                  >
                    Clear all
                  </button>
                )}
              </div>
              {notifications.length === 0 ? (
                <div style={{ padding: '20px 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  No new notifications
                </div>
              ) : (
                notifications.map(item => (
                  <div 
                    key={item.id} 
                    style={{ 
                      padding: '10px', 
                      background: 'rgba(255,255,255,0.02)', 
                      borderRadius: '6px', 
                      borderLeft: `3px solid ${item.type === 'placement' ? 'var(--primary)' : item.type === 'contest' ? 'var(--secondary)' : 'var(--accent)'}`,
                      position: 'relative'
                    }}
                  >
                    <button 
                      onClick={() => clearNotification(item.id)}
                      style={{ position: 'absolute', top: '8px', right: '8px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                    >
                      <X size={12} />
                    </button>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, paddingRight: '12px' }}>{item.title}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>{item.message}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '6px' }}>{item.time}</div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* User Profile Card */}
        <div 
          onClick={() => setShowProfileModal(true)}
          className="glass-panel"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '6px 14px',
            cursor: 'pointer',
            border: '1px solid var(--border-light)',
            borderRadius: 'var(--border-radius-sm)',
            transition: 'border var(--transition-fast)'
          }}
        >
          <div className="flex-center" style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
            color: 'white'
          }}>
            <User size={16} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{userProfile.name}</span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Target: {userProfile.targetCompany}</span>
          </div>
          <Edit3 size={14} style={{ color: 'var(--text-muted)', marginLeft: '4px' }} />
        </div>
      </div>

      {/* Profile Edit Modal */}
      {showProfileModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 300
        }}>
          <div 
            className="glass-panel animate-fade-in"
            style={{
              width: '450px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px' }}>
              <h3 style={{ fontSize: '1.25rem' }}>Update Study Profile</h3>
              <button 
                onClick={() => setShowProfileModal(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleProfileSave} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Full Name</label>
                <input 
                  type="text" 
                  value={profileForm.name} 
                  onChange={e => setProfileForm({ ...profileForm, name: e.target.value })}
                  className="glass-input"
                  required
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Email</label>
                <input 
                  type="email" 
                  value={profileForm.email} 
                  onChange={e => setProfileForm({ ...profileForm, email: e.target.value })}
                  className="glass-input"
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Target Company</label>
                  <select 
                    value={profileForm.targetCompany}
                    onChange={e => setProfileForm({ ...profileForm, targetCompany: e.target.value })}
                    className="glass-input"
                    style={{ background: 'var(--bg-secondary)', cursor: 'pointer' }}
                  >
                    <option value="Google">Google</option>
                    <option value="Amazon">Amazon</option>
                    <option value="TCS">TCS Digital</option>
                    <option value="Infosys">Infosys</option>
                    <option value="Microsoft">Microsoft</option>
                  </select>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>College CGPA</label>
                  <input 
                    type="text" 
                    value={profileForm.cgpa} 
                    onChange={e => setProfileForm({ ...profileForm, cgpa: e.target.value })}
                    className="glass-input"
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Target Job Title</label>
                <input 
                  type="text" 
                  value={profileForm.targetRole} 
                  onChange={e => setProfileForm({ ...profileForm, targetRole: e.target.value })}
                  className="glass-input"
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
                <button 
                  type="button" 
                  onClick={() => setShowProfileModal(false)}
                  className="glass-btn"
                  style={{ padding: '8px 16px' }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="glass-btn btn-primary"
                  style={{ padding: '8px 16px' }}
                >
                  <Check size={16} /> Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
