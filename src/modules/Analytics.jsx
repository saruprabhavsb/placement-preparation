/* src/modules/Analytics.jsx */
import React, { useContext } from 'react';
import { AppStateContext } from '../context/AppStateContext';
import { 
  LineChart, 
  BarChart, 
  Activity, 
  Flame, 
  TrendingUp, 
  Sparkles,
  Trophy
} from 'lucide-react';

const Analytics = () => {
  const { codingQuestions, streak } = useContext(AppStateContext);

  // Solved details
  const solvedCount = codingQuestions.filter(q => q.solved).length;
  const totalCount = codingQuestions.length;

  // Render a gorgeous GitHub-style contribution calendar grid
  // 5 rows, 24 columns (representing weeks/days grid)
  const heatmapGrid = [];
  const levels = [0, 0, 1, 0, 2, 0, 0, 3, 0, 0, 1, 4, 0, 1, 2, 0, 0, 0, 1, 0, 3, 4, 1, 0];
  
  for (let row = 0; row < 5; row++) {
    const cells = [];
    for (let col = 0; col < 24; col++) {
      // Create interesting mock activity patterns
      const index = (row * 24 + col) % levels.length;
      const level = levels[index];
      cells.push(level);
    }
    heatmapGrid.push(cells);
  }

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Overview Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
        
        <div className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div className="flex-center" style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)' }}>
            <Activity size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Daily Accuracy</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 700 }}>88.5%</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--accent)' }}>+2.4% this week</div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div className="flex-center" style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(168, 85, 247, 0.1)', color: 'var(--secondary)' }}>
            <TrendingUp size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Average Speed</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 700 }}>24 mins</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--accent)' }}>Top 8% Speed rating</div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div className="flex-center" style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent)' }}>
            <Trophy size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Placement Percentile</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 700 }}>96.8th</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--accent)' }}>High eligibility match</div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div className="flex-center" style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning)' }}>
            <Flame size={20} fill="var(--warning)" />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Study Streak</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 700 }}>{streak} Days</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Last active today</div>
          </div>
        </div>
      </div>

      {/* Grid of custom SVG Line graph & Heatmap */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '24px', alignItems: 'start' }}>
        
        {/* Left: Custom SVG Progress Chart */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TrendingUp size={18} style={{ color: 'var(--primary)' }} /> Solved Problems Timeline
          </h3>
          
          <div style={{ position: 'relative', width: '100%', height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg viewBox="0 0 500 180" width="100%" height="100%">
              {/* Grid Lines */}
              <line x1="40" y1="20" x2="480" y2="20" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
              <line x1="40" y1="70" x2="480" y2="70" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
              <line x1="40" y1="120" x2="480" y2="120" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
              <line x1="40" y1="160" x2="480" y2="160" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
              
              {/* Axis labels */}
              <text x="15" y="25" fill="var(--text-muted)" fontSize="8">15 Qs</text>
              <text x="15" y="75" fill="var(--text-muted)" fontSize="8">10 Qs</text>
              <text x="15" y="125" fill="var(--text-muted)" fontSize="8">5 Qs</text>
              <text x="15" y="165" fill="var(--text-muted)" fontSize="8">0 Qs</text>
              
              {/* Trend line paths */}
              <path
                d="M 40 160 L 110 140 L 180 110 L 250 90 L 320 80 L 390 60 L 460 30"
                fill="none"
                stroke="url(#indigo-grad)"
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              {/* Linear gradient definition */}
              <defs>
                <linearGradient id="indigo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="var(--primary)" />
                  <stop offset="100%" stopColor="var(--secondary)" />
                </linearGradient>
              </defs>

              {/* Data points */}
              <circle cx="40" cy="160" r="5" fill="var(--primary)" stroke="#0d1117" strokeWidth="2" />
              <circle cx="110" cy="140" r="5" fill="var(--primary)" stroke="#0d1117" strokeWidth="2" />
              <circle cx="180" cy="110" r="5" fill="var(--secondary)" stroke="#0d1117" strokeWidth="2" />
              <circle cx="250" cy="90" r="5" fill="var(--secondary)" stroke="#0d1117" strokeWidth="2" />
              <circle cx="320" cy="80" r="5" fill="var(--primary)" stroke="#0d1117" strokeWidth="2" />
              <circle cx="390" cy="60" r="5" fill="var(--secondary)" stroke="#0d1117" strokeWidth="2" />
              <circle cx="460" cy="30" r="5" fill="var(--accent)" stroke="#0d1117" strokeWidth="2" />

              {/* X Axis Date labels */}
              <text x="35" y="178" fill="var(--text-muted)" fontSize="8">Jun 29</text>
              <text x="105" y="178" fill="var(--text-muted)" fontSize="8">Jun 30</text>
              <text x="175" y="178" fill="var(--text-muted)" fontSize="8">Jul 01</text>
              <text x="245" y="178" fill="var(--text-muted)" fontSize="8">Jul 02</text>
              <text x="315" y="178" fill="var(--text-muted)" fontSize="8">Jul 03</text>
              <text x="385" y="178" fill="var(--text-muted)" fontSize="8">Jul 04</text>
              <text x="455" y="178" fill="var(--text-muted)" fontSize="8">Today</text>
            </svg>
          </div>
        </div>

        {/* Right: Accuracy Metrics by Topic */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '16px' }}>Accuracy by Topic</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
                <span>Arrays & Vectors</span>
                <strong>92%</strong>
              </div>
              <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: '92%', height: '100%', background: 'var(--primary)', borderRadius: '3px' }}></div>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
                <span>Strings Manipulation</span>
                <strong>78%</strong>
              </div>
              <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: '78%', height: '100%', background: 'var(--secondary)', borderRadius: '3px' }}></div>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
                <span>Dynamic Programming</span>
                <strong>60%</strong>
              </div>
              <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: '60%', height: '100%', background: 'var(--warning)', borderRadius: '3px' }}></div>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
                <span>Quantitative Aptitude</span>
                <strong>85%</strong>
              </div>
              <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: '85%', height: '100%', background: 'var(--accent)', borderRadius: '3px' }}></div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* GitHub style Contribution Heatmap */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '14px' }}>Submission Frequency (Last 120 Days)</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', overflowX: 'auto' }}>
          {heatmapGrid.map((rowCells, rIdx) => (
            <div key={rIdx} className="heatmap-grid" style={{ minWidth: '450px' }}>
              {rowCells.map((level, cIdx) => (
                <div key={cIdx} className={`heatmap-cell level-${level}`} title={`Submission intensity: level ${level}`} />
              ))}
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '6px', marginTop: '12px', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
          <span>Less</span>
          <div className="heatmap-cell level-0" style={{ width: '8px', height: '8px' }} />
          <div className="heatmap-cell level-1" style={{ width: '8px', height: '8px' }} />
          <div className="heatmap-cell level-2" style={{ width: '8px', height: '8px' }} />
          <div className="heatmap-cell level-3" style={{ width: '8px', height: '8px' }} />
          <div className="heatmap-cell level-4" style={{ width: '8px', height: '8px' }} />
          <span>More</span>
        </div>
      </div>

      {/* AI Performance Insights summary */}
      <div className="glass-panel" style={{ padding: '24px', display: 'flex', gap: '16px', borderLeft: '4px solid var(--secondary)' }}>
        <div className="flex-center" style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(168, 85, 247, 0.1)', color: 'var(--secondary)', flexShrink: 0 }}>
          <Sparkles size={20} className="pulse-glow" />
        </div>
        <div>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '6px' }}>AI Performance Insights</h4>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            Excellent work! Your accuracy in **Arrays & Vector** remains in the top 5th percentile of candidates. We noticed your **Dynamic Programming** accuracy is slightly lower (60%). We recommend practicing 'Edit Distance' to strengthen your grid transition formulation before targeting Amazon interviews.
          </p>
        </div>
      </div>

    </div>
  );
};

export default Analytics;
