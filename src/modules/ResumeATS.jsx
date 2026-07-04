/* src/modules/ResumeATS.jsx */
import React, { useContext, useState } from 'react';
import { AppStateContext } from '../context/AppStateContext';
import { 
  FileCheck, 
  Search, 
  AlertTriangle, 
  Sparkles, 
  Download, 
  RefreshCw,
  CheckCircle,
  FileText
} from 'lucide-react';

const ResumeATS = () => {
  const { resumeData, updateResumeData, addNotification } = useContext(AppStateContext);

  const [resumeText, setResumeText] = useState(resumeData.text);
  const [targetJob, setTargetJob] = useState(resumeData.targetJob);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Common keywords to scan
  const keywordLibrary = ['React', 'Node.js', 'Python', 'SQL', 'Git', 'TypeScript', 'Redux', 'Unit Testing', 'Kubernetes', 'Docker', 'AWS'];

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    addNotification('ATS Analyzer', 'Running deep keyword check and grammar validation...', 'info');

    setTimeout(() => {
      // Analyze text for keywords
      const found = [];
      const missing = [];
      
      keywordLibrary.forEach(kw => {
        const regex = new RegExp(`\\b${kw.replace('.', '\\.')}\\b`, 'i');
        if (regex.test(resumeText)) {
          found.push(kw);
        } else {
          missing.push(kw);
        }
      });

      // Simple score formulation
      const baseScore = 40;
      const keywordScore = Math.round((found.length / keywordLibrary.length) * 50);
      const lengthPenalty = resumeText.split(/\s+/).length > 300 ? 0 : -5;
      const finalScore = Math.min(100, Math.max(0, baseScore + keywordScore + lengthPenalty));

      // Grammar check simulation
      const grammar = [];
      if (resumeText.includes('  ')) {
        grammar.push('Found 1 duplicate spacing error');
      }
      if (!/\b(created|managed|designed|optimized|led|built)\b/i.test(resumeText)) {
        grammar.push('Add stronger action verbs (e.g. optimized, built, managed)');
      }
      if (resumeText.length < 150) {
        grammar.push('Resume text is too brief; expand on project descriptions');
      }

      updateResumeData(resumeText, targetJob, finalScore, found, missing, grammar);
      setIsAnalyzing(false);
    }, 1500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: '55% 45%', gap: '20px', alignItems: 'start' }}>
      
      {/* Left panel: Paste area & Target job */}
      <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h3 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FileText size={20} style={{ color: 'var(--primary)' }} /> Paste Resume Text
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Target Job Description / Title</label>
          <input 
            type="text" 
            value={targetJob} 
            onChange={(e) => setTargetJob(e.target.value)}
            placeholder="e.g. Fullstack React & Node Developer"
            className="glass-input"
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
          <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Resume Content</label>
          <textarea
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            placeholder="Paste your plain text resume here to analyze matches..."
            className="glass-input"
            style={{ minHeight: '280px', fontFamily: 'var(--font-body)', fontSize: '0.9rem', lineHeight: 1.5, resize: 'vertical' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="glass-btn btn-primary"
            style={{ flex: 1, justifyContent: 'center' }}
          >
            {isAnalyzing ? (
              <>
                <RefreshCw size={16} className="pulse-glow" style={{ animation: 'spin 2s linear infinite' }} /> Analyzing Resume...
              </>
            ) : (
              <>
                <RefreshCw size={16} /> Analyze ATS Score
              </>
            )}
          </button>
        </div>
      </div>

      {/* Right panel: ATS Score metrics & recommendations */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* ATS Score card */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: '8px' }}>ATS Match Rating</h3>
            <div style={{ fontSize: '3rem', fontWeight: 800, color: resumeData.score >= 80 ? 'var(--accent)' : resumeData.score >= 60 ? 'var(--warning)' : 'var(--danger)' }}>
              {resumeData.score}%
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              {resumeData.score >= 80 ? 'Excellent Match!' : resumeData.score >= 60 ? 'Good Match, but can improve' : 'Needs Optimization'}
            </div>
          </div>
          
          {/* Custom SVG gauge chart */}
          <svg width="100" height="100" viewBox="0 0 36 36">
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="rgba(255,255,255,0.05)"
              strokeWidth="2.5"
            />
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke={resumeData.score >= 80 ? 'var(--accent)' : resumeData.score >= 60 ? 'var(--warning)' : 'var(--danger)'}
              strokeWidth="2.5"
              strokeDasharray={`${resumeData.score}, 100`}
            />
          </svg>
        </div>

        {/* Keyword density checks */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Search size={16} style={{ color: 'var(--primary)' }} /> Keyword Compatibility
          </h3>
          
          <div style={{ marginBottom: '14px' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--accent)', fontWeight: 600, marginBottom: '6px' }}>Matched Keywords ({resumeData.foundSkills.length})</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {resumeData.foundSkills.map((kw, i) => (
                <span key={i} className="badge easy" style={{ fontSize: '0.7rem', padding: '4px 8px' }}>
                  ✓ {kw}
                </span>
              ))}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--warning)', fontWeight: 600, marginBottom: '6px' }}>Missing Target Keywords ({resumeData.missingSkills.length})</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {resumeData.missingSkills.length === 0 ? (
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>None! You match all targets.</div>
              ) : (
                resumeData.missingSkills.map((kw, i) => (
                  <span key={i} className="badge hard" style={{ fontSize: '0.7rem', padding: '4px 8px' }}>
                    + Add {kw}
                  </span>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Grammar & style warnings */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={16} style={{ color: 'var(--danger)' }} /> Formatting & Style Alerts
          </h3>
          
          {resumeData.grammarErrors.length === 0 ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent)', fontSize: '0.85rem' }}>
              <CheckCircle size={16} /> Zero warnings found. Structure is solid!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {resumeData.grammarErrors.map((err, i) => (
                <div key={i} style={{ display: 'flex', gap: '8px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  <AlertTriangle size={14} style={{ color: 'var(--warning)', flexShrink: 0, marginTop: '2px' }} />
                  <span>{err}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* AI Rewrite Exporter */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={16} style={{ color: 'var(--secondary)' }} /> AI Bullet Rewrites
          </h3>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4, display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ padding: '10px', background: 'rgba(255,255,255,0.01)', borderRadius: '6px', borderLeft: '3px solid var(--secondary)' }}>
              <strong>Weak:</strong> "Worked on database development stuff."
              <br />
              <strong style={{ color: 'var(--accent)' }}>AI Boost:</strong> "Engineered custom PostgreSQL indexing models to reduce query latency by 32%."
            </div>
            <button
              onClick={handlePrint}
              className="glass-btn btn-accent"
              style={{ justifyContent: 'center', fontSize: '0.8rem', padding: '6px 12px' }}
            >
              <Download size={14} /> Export ATS-Compliant PDF
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ResumeATS;
