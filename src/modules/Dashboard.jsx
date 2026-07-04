/* src/modules/Dashboard.jsx */
import React, { useContext } from 'react';
import { AppStateContext } from '../context/AppStateContext';
import { 
  Trophy, 
  Flame, 
  Sparkles, 
  FileText, 
  ArrowRight, 
  CheckCircle2, 
  Calendar,
  Code2
} from 'lucide-react';

const Dashboard = () => {
  const { 
    userProfile, 
    streak, 
    codingQuestions, 
    setActiveTab, 
    addNotification 
  } = useContext(AppStateContext);

  const solvedCount = codingQuestions.filter(q => q.solved).length;
  const totalCount = codingQuestions.length;
  const solvedPercentage = Math.round((solvedCount / totalCount) * 100);

  const mockRecommendations = [
    { id: 'rec-1', title: 'Merge Intervals', reason: 'Commonly asked by Amazon (Medium)', tab: 'coding', target: 'code-2' },
    { id: 'rec-2', title: 'Complete Verbal Quiz', reason: 'Boost your verbal ability score by 15%', tab: 'prep', target: 'verbal' },
    { id: 'rec-3', title: 'ATS Keyword Tuning', reason: 'Your resume lacks TypeScript. Add it to improve score.', tab: 'ats', target: null },
  ];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Welcome Banner */}
      <div 
        className="glass-panel" 
        style={{
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(168, 85, 247, 0.15))',
          padding: '28px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderLeft: '5px solid var(--primary)'
        }}
      >
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '8px' }}>
            Welcome back, {userProfile.name}! 👋
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '500px', lineHeight: 1.5 }}>
            You are currently on track for your target company **{userProfile.targetCompany}** as a **{userProfile.targetRole}**. Let's practice today!
          </p>
        </div>
        <div 
          onClick={() => {
            addNotification('Tip of the day', 'Solving mock interviews daily increases your placement chances by 45%.', 'info');
          }}
          className="flex-center" 
          style={{
            background: 'rgba(255,255,255,0.06)',
            borderRadius: '50%',
            padding: '12px',
            cursor: 'pointer',
            border: '1px solid var(--border-light)'
          }}
        >
          <Sparkles size={24} style={{ color: 'var(--secondary)' }} className="pulse-glow" />
        </div>
      </div>

      {/* Main Stats Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '20px'
      }}>
        {/* Streak Stat */}
        <div className="glass-panel glow-violet" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div className="flex-center" style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(168, 85, 247, 0.15)', color: 'var(--secondary)' }}>
            <Flame size={24} fill="var(--secondary)" />
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Daily Streak</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{streak} Days</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--accent)' }}>Active Study Week!</div>
          </div>
        </div>

        {/* Coding Progress */}
        <div className="glass-panel glow-indigo" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div className="flex-center" style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.15)', color: 'var(--primary)' }}>
            <Code2 size={24} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Coding Problems</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{solvedCount} / {totalCount}</div>
            {/* Progress bar */}
            <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', marginTop: '8px', overflow: 'hidden' }}>
              <div style={{ width: `${solvedPercentage}%`, height: '100%', background: 'var(--primary)', borderRadius: '3px' }}></div>
            </div>
          </div>
        </div>

        {/* Resume Score */}
        <div 
          onClick={() => setActiveTab('ats')}
          className="glass-panel glow-emerald" 
          style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer' }}
        >
          <div className="flex-center" style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)', color: 'var(--accent)' }}>
            <FileText size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Resume ATS Score</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{userProfile.resumeScore}%</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Click to optimize</div>
          </div>
        </div>

        {/* Placement Rate (Mocked) */}
        <div className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div className="flex-center" style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.15)', color: 'var(--warning)' }}>
            <Trophy size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Placement Readiness</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>Ready (92%)</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--accent)' }}>Top 5% in College</div>
          </div>
        </div>
      </div>

      {/* Grid for AI Recommendations & Timeline */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: '24px',
        alignItems: 'start'
      }}>
        {/* Left: AI recommendations */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={20} style={{ color: 'var(--secondary)' }} /> AI Career Recommendations
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {mockRecommendations.map(rec => (
              <div 
                key={rec.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '16px',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--border-light)',
                  borderRadius: '12px'
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{rec.title}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>{rec.reason}</div>
                </div>
                <button
                  onClick={() => setActiveTab(rec.tab)}
                  className="glass-btn btn-accent"
                  style={{ padding: '6px 12px', fontSize: '0.8rem', gap: '4px' }}
                >
                  Start <ArrowRight size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Upcoming Contests & Events */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calendar size={20} style={{ color: 'var(--primary)' }} /> Upcoming Contests
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <div className="flex-center" style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)' }}>
                <Code2 size={18} />
              </div>
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>Weekly Mock Contest</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>Today at 8:00 PM</div>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <div className="flex-center" style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(168, 85, 247, 0.1)', color: 'var(--secondary)' }}>
                <CheckCircle2 size={18} />
              </div>
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>Google OA Practice</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>July 6, 10:00 AM</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
