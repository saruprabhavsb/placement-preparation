/* src/modules/CompanyPrep.jsx */
import React, { useContext, useState } from 'react';
import { AppStateContext } from '../context/AppStateContext';
import { 
  Building2, 
  MapPin, 
  DollarSign, 
  CheckSquare, 
  FileQuestion,
  HelpCircle,
  TrendingUp,
  Bookmark
} from 'lucide-react';

const CompanyPrep = () => {
  const { companies, setActiveTab, toggleBookmark, bookmarks } = useContext(AppStateContext);
  const [selectedCompany, setSelectedCompany] = useState(companies[0]);

  return (
    <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: '25% 75%', gap: '20px', alignItems: 'start' }}>
      
      {/* Sidebar: Companies selection list */}
      <div className="glass-panel" style={{ padding: '16px' }}>
        <h3 style={{ fontSize: '1rem', color: 'var(--text-muted)', marginBottom: '12px' }}>Companies</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {companies.map((comp) => {
            const isSelected = selectedCompany.id === comp.id;
            return (
              <button
                key={comp.id}
                onClick={() => setSelectedCompany(comp)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  border: isSelected ? '1px solid var(--primary)' : '1px solid var(--border-light)',
                  borderRadius: '8px',
                  background: isSelected ? 'rgba(99,102,241,0.08)' : 'rgba(255,255,255,0.01)',
                  color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontSize: '0.9rem',
                  fontWeight: 600
                }}
              >
                <Building2 size={16} />
                {comp.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Area: Selection Details */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* Company Header */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '6px' }}>{selectedCompany.name}</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Target Role: <strong>{selectedCompany.role}</strong></p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <span className="badge easy" style={{ padding: '6px 12px' }}>Open Drive</span>
          </div>
        </div>

        {/* Salary & Location stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div className="glass-panel" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="flex-center" style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent)' }}>
              <DollarSign size={20} />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Estimated CTC Package</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>{selectedCompany.salary}</div>
            </div>
          </div>
          <div className="glass-panel" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="flex-center" style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)' }}>
              <MapPin size={20} />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Job Locations</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>{selectedCompany.location}</div>
            </div>
          </div>
        </div>

        {/* Eligibility & Hiring timeline */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '20px' }}>
          
          {/* Eligibility checklist */}
          <div className="glass-panel" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckSquare size={18} style={{ color: 'var(--primary)' }} /> Eligibility Criteria
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <div style={{ padding: '10px', background: 'rgba(255,255,255,0.02)', borderRadius: '6px' }}>
                <strong>Academic Score:</strong> {selectedCompany.eligibility}
              </div>
              <div style={{ padding: '10px', background: 'rgba(255,255,255,0.02)', borderRadius: '6px' }}>
                <strong>Degree:</strong> BE / B.Tech / ME / M.Tech / MCA / MSc
              </div>
              <div style={{ padding: '10px', background: 'rgba(255,255,255,0.02)', borderRadius: '6px' }}>
                <strong>Stream:</strong> Computer Science, IT, Electrical or allied branches preferred.
              </div>
            </div>
          </div>

          {/* Hiring Timeline Flowchart */}
          <div className="glass-panel" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <TrendingUp size={18} style={{ color: 'var(--secondary)' }} /> Interview Pipeline Flow
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {selectedCompany.hiringProcess.map((proc, index) => (
                <div 
                  key={index}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    position: 'relative',
                    paddingBottom: index < selectedCompany.hiringProcess.length - 1 ? '16px' : '0'
                  }}
                >
                  {/* Visual timeline connector line */}
                  {index < selectedCompany.hiringProcess.length - 1 && (
                    <div style={{
                      position: 'absolute', top: '24px', left: '12px', bottom: 0, width: '2px', background: 'var(--border-light)'
                    }} />
                  )}
                  
                  <div className="flex-center" style={{
                    width: '26px', height: '26px', borderRadius: '50%', background: 'var(--primary)', color: 'white', fontSize: '0.8rem', fontWeight: 'bold', zIndex: 1
                  }}>
                    {index + 1}
                  </div>
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{proc.step}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>{proc.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top asked coding questions */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileQuestion size={18} style={{ color: 'var(--accent)' }} /> High Frequency Coding Questions
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {selectedCompany.codingQuestions.map((qTitle, i) => (
              <div 
                key={i} 
                style={{ 
                  padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' 
                }}
              >
                <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{qTitle}</span>
                <button
                  onClick={() => setActiveTab('coding')}
                  className="glass-btn btn-accent"
                  style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                >
                  Solve
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Standard HR interview questions */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <HelpCircle size={18} style={{ color: 'var(--warning)' }} /> Common HR Questions
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {selectedCompany.hrQuestions.map((qText, i) => (
              <div 
                key={i} 
                style={{ 
                  padding: '12px 16px', background: 'rgba(0,0,0,0.15)', borderLeft: '3px solid var(--warning)', borderRadius: '4px', fontSize: '0.85rem', lineHeight: 1.4 
                }}
              >
                {qText}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default CompanyPrep;
