/* src/modules/AdminPanel.jsx */
import React, { useContext, useState } from 'react';
import { AppStateContext } from '../context/AppStateContext';
import { 
  PlusCircle, 
  Settings, 
  Users, 
  Check, 
  AlertCircle,
  Database
} from 'lucide-react';

const AdminPanel = () => {
  const { codingQuestions, addCodingQuestion, addNotification } = useContext(AppStateContext);

  const [form, setForm] = useState({
    title: '',
    difficulty: 'Easy',
    category: 'Arrays',
    description: '',
    funcName: '',
    testInput: '',
    testExpected: ''
  });

  // Mock Student Users Database log
  const userDatabase = [
    { name: 'Aniket Sharma', email: 'aniket@college.edu', solved: 2, atsScore: 78, status: 'Active' },
    { name: 'Rahul Verma', email: 'rahul@college.edu', solved: 2, atsScore: 65, status: 'Active' },
    { name: 'Siddharth Misra', email: 'sid@college.edu', solved: 4, atsScore: 88, status: 'Active' }
  ];

  const [examSettings, setExamSettings] = useState({
    duration: 20,
    allowNegativeMarking: true,
    requireProctoring: false
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title || !form.description) {
      addNotification('Admin Form', 'Please provide a title and problem description.', 'warning');
      return;
    }

    const newQuestion = {
      title: form.title,
      difficulty: form.difficulty,
      category: form.category,
      description: form.description,
      funcName: form.funcName || 'solve',
      testCases: [
        { input: form.testInput || '[]', expected: form.testExpected || '[]' }
      ]
    };

    addCodingQuestion(newQuestion);
    setForm({
      title: '',
      difficulty: 'Easy',
      category: 'Arrays',
      description: '',
      funcName: '',
      testInput: '',
      testExpected: ''
    });
  };

  return (
    <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: '60% 40%', gap: '20px', alignItems: 'start' }}>
      
      {/* Left panel: Add DSA Problem CRUD form */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <PlusCircle size={20} style={{ color: 'var(--primary)' }} /> Create Coding Challenge
        </h3>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '12px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Problem Title</label>
              <input
                type="text"
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Invert Binary Tree"
                className="glass-input"
                required
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Difficulty</label>
              <select
                value={form.difficulty}
                onChange={e => setForm({ ...form, difficulty: e.target.value })}
                className="glass-input"
                style={{ background: 'var(--bg-secondary)', cursor: 'pointer' }}
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Category</label>
              <select
                value={form.category}
                onChange={e => setForm({ ...form, category: e.target.value })}
                className="glass-input"
                style={{ background: 'var(--bg-secondary)', cursor: 'pointer' }}
              >
                <option value="Arrays">Arrays</option>
                <option value="Strings">Strings</option>
                <option value="Design">Design</option>
                <option value="Trees">Trees</option>
                <option value="Dynamic Programming">DP</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Main JS Function Name</label>
              <input
                type="text"
                value={form.funcName}
                onChange={e => setForm({ ...form, funcName: e.target.value })}
                placeholder="e.g. invertTree"
                className="glass-input"
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Problem Description / Instructions</label>
            <textarea
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              placeholder="Provide clean instructions, constraints, and descriptions..."
              className="glass-input"
              style={{ minHeight: '100px', resize: 'vertical' }}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Test Case Input</label>
              <input
                type="text"
                value={form.testInput}
                onChange={e => setForm({ ...form, testInput: e.target.value })}
                placeholder="e.g. [4,2,7,1,3,6,9]"
                className="glass-input"
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Test Case Expected Output</label>
              <input
                type="text"
                value={form.testExpected}
                onChange={e => setForm({ ...form, testExpected: e.target.value })}
                placeholder="e.g. [4,7,2,9,6,3,1]"
                className="glass-input"
              />
            </div>
          </div>

          <button type="submit" className="glass-btn btn-primary" style={{ justifyContent: 'center', marginTop: '10px' }}>
            <PlusCircle size={16} /> Create Question & Publish
          </button>
        </form>
      </div>

      {/* Right panel: Exam settings & database table audit */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* Exam configuration controls */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Settings size={18} style={{ color: 'var(--secondary)' }} /> Placement Exam Config
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Mock Exam Timer (Mins)</span>
              <input
                type="number"
                value={examSettings.duration}
                onChange={e => setExamSettings({ ...examSettings, duration: parseInt(e.target.value, 10) || 20 })}
                className="glass-input"
                style={{ width: '70px', padding: '4px 8px', textAlign: 'center' }}
              />
            </div>

            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={examSettings.allowNegativeMarking}
                onChange={e => setExamSettings({ ...examSettings, allowNegativeMarking: e.target.checked })}
                style={{ accentColor: 'var(--primary)' }}
              />
              <span>Enable Negative Grading (-0.25)</span>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={examSettings.requireProctoring}
                onChange={e => setExamSettings({ ...examSettings, requireProctoring: e.target.checked })}
                style={{ accentColor: 'var(--primary)' }}
              />
              <span>Force Browser Tab Lockout Warning</span>
            </label>

            <button
              onClick={() => addNotification('Admin Panel', 'Placement exam configurations successfully saved.', 'success')}
              className="glass-btn btn-accent"
              style={{ justifyContent: 'center', fontSize: '0.8rem', padding: '6px 12px', marginTop: '4px' }}
            >
              Update Settings
            </button>
          </div>
        </div>

        {/* Database log metrics audit */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Database size={18} style={{ color: 'var(--accent)' }} /> Audit Students Registry
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {userDatabase.map((std, i) => (
              <div 
                key={i}
                style={{
                  padding: '10px',
                  background: 'rgba(255,255,255,0.01)',
                  border: '1px solid var(--border-light)',
                  borderRadius: '6px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '0.8rem'
                }}
              >
                <div>
                  <div style={{ fontWeight: 600 }}>{std.name}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '2px' }}>{std.email}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div>Solved: <strong>{std.solved}</strong> | ATS: <strong>{std.atsScore}%</strong></div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--accent)', fontWeight: 600 }}>{std.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminPanel;
