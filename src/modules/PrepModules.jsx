/* src/modules/PrepModules.jsx */
import React, { useContext, useState } from 'react';
import { AppStateContext } from '../context/AppStateContext';
import { 
  Award, 
  HelpCircle, 
  CheckCircle, 
  XCircle,
  HelpCircle as QuestionIcon,
  ChevronRight
} from 'lucide-react';

const PrepModules = () => {
  const { 
    aptitudeQuestions, 
    codingQuestions, 
    setActiveTab, 
    addNotification 
  } = useContext(AppStateContext);

  const [activeSubTab, setActiveSubTab] = useState('aptitude'); // aptitude, reasoning, verbal, coding
  const [selectedQuestion, setSelectedQuestion] = useState(aptitudeQuestions[0]);
  const [userAnswer, setUserAnswer] = useState('');
  const [showExplanation, setShowExplanation] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);
  const [quizScore, setQuizScore] = useState({ correct: 0, total: 0 });

  const handleVerify = () => {
    if (!userAnswer) {
      addNotification('Select an option', 'Please choose an option first.', 'warning');
      return;
    }
    setIsAnswered(true);
    setShowExplanation(true);
    const isCorrect = userAnswer === selectedQuestion.answer;
    
    setQuizScore(prev => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1
    }));

    if (isCorrect) {
      addNotification('Correct Answer!', 'Good job. Keep solving!', 'success');
    } else {
      addNotification('Incorrect Answer', 'Check the explanation to learn why.', 'error');
    }
  };

  const handleNextQuestion = (nextQ) => {
    setSelectedQuestion(nextQ);
    setUserAnswer('');
    setIsAnswered(false);
    setShowExplanation(false);
  };

  // Filter lists based on type
  const filterQuestions = (cat) => aptitudeQuestions.filter(q => q.category.toLowerCase() === cat.toLowerCase());

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Category selector row */}
      <div style={{ display: 'flex', gap: '12px' }}>
        {['Aptitude', 'Reasoning', 'Verbal', 'Coding Qs'].map((tabLabel) => {
          const tabId = tabLabel.toLowerCase().replace(' qs', '');
          const isActive = activeSubTab === tabId;
          return (
            <button
              key={tabId}
              onClick={() => {
                setActiveSubTab(tabId);
                if (tabId !== 'coding') {
                  const filtered = filterQuestions(tabId);
                  if (filtered.length > 0) handleNextQuestion(filtered[0]);
                }
              }}
              className="glass-btn"
              style={{
                background: isActive ? 'linear-gradient(135deg, var(--primary), var(--secondary))' : 'rgba(255, 255, 255, 0.03)',
                border: isActive ? 'none' : '1px solid var(--border-light)'
              }}
            >
              {tabLabel}
            </button>
          );
        })}
      </div>

      {activeSubTab === 'coding' ? (
        /* Coding Questions Quick-Links list */
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '16px' }}>DSA Problem List by Category</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {codingQuestions.map((q) => (
              <div 
                key={q.id}
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span className={`badge ${q.difficulty.toLowerCase()}`}>
                    {q.difficulty}
                  </span>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{q.title}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      Acceptance: {q.acceptance} | Category: {q.category}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('coding')}
                  className="glass-btn btn-primary"
                  style={{ padding: '6px 14px', fontSize: '0.8rem', gap: '4px' }}
                >
                  Solve in IDE <ChevronRight size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Quiz Workspace */
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px', alignItems: 'start' }}>
          {/* Left panel: List of questions in category */}
          <div className="glass-panel" style={{ padding: '20px', maxHeight: '500px', overflowY: 'auto' }}>
            <h3 style={{ fontSize: '1rem', color: 'var(--text-muted)', marginBottom: '12px' }}>Select Practice Question</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {filterQuestions(activeSubTab).map((q) => {
                const isSelected = selectedQuestion.id === q.id;
                return (
                  <button
                    key={q.id}
                    onClick={() => handleNextQuestion(q)}
                    style={{
                      padding: '12px',
                      borderRadius: '8px',
                      border: isSelected ? '1px solid var(--primary)' : '1px solid var(--border-light)',
                      background: isSelected ? 'rgba(99,102,241,0.08)' : 'rgba(255,255,255,0.01)',
                      color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)',
                      cursor: 'pointer',
                      textAlign: 'left',
                      fontSize: '0.85rem'
                    }}
                  >
                    <strong>Topic:</strong> {q.topic}
                    <div style={{ marginTop: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {q.question}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right panel: Active quiz window */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Score box */}
            <div className="glass-panel" style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Award size={18} style={{ color: 'var(--warning)' }} />
                <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Category Quiz Scoreboard</span>
              </div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                Solved: <strong style={{ color: 'var(--text-primary)' }}>{quizScore.correct} / {quizScore.total}</strong> correct
              </div>
            </div>

            {/* Question card */}
            <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                <QuestionIcon size={16} /> <span>Topic: {selectedQuestion.topic}</span>
              </div>

              <div style={{ fontSize: '1.1rem', fontWeight: 600, lineHeight: 1.5 }}>
                {selectedQuestion.question}
              </div>

              {/* Options */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {selectedQuestion.options.map((opt, index) => {
                  const isChecked = userAnswer === opt;
                  const isCorrectAnswer = opt === selectedQuestion.answer;
                  let optStyle = {
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '14px',
                    border: '1px solid var(--border-light)',
                    borderRadius: '8px',
                    cursor: isAnswered ? 'default' : 'pointer',
                    background: 'rgba(255,255,255,0.01)',
                    transition: 'all var(--transition-fast)'
                  };

                  if (isChecked) {
                    optStyle.borderColor = 'var(--primary)';
                    optStyle.background = 'rgba(99, 102, 241, 0.05)';
                  }
                  
                  if (isAnswered) {
                    if (isCorrectAnswer) {
                      optStyle.borderColor = 'var(--accent)';
                      optStyle.background = 'rgba(16, 185, 129, 0.1)';
                    } else if (isChecked) {
                      optStyle.borderColor = 'var(--danger)';
                      optStyle.background = 'rgba(239, 68, 68, 0.1)';
                    }
                  }

                  return (
                    <label key={index} style={optStyle}>
                      <input 
                        type="radio" 
                        name="quiz-opt" 
                        value={opt} 
                        checked={isChecked}
                        onChange={() => {
                          if (!isAnswered) setUserAnswer(opt);
                        }}
                        disabled={isAnswered}
                        style={{ accentColor: 'var(--primary)', cursor: isAnswered ? 'default' : 'pointer' }}
                      />
                      <span style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>{opt}</span>
                    </label>
                  );
                })}
              </div>

              {/* Action and verification buttons */}
              <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                <button 
                  onClick={handleVerify}
                  disabled={isAnswered}
                  className="glass-btn btn-primary"
                  style={{ flex: 1 }}
                >
                  Verify Answer
                </button>
              </div>

              {/* Explanations Proof card */}
              {showExplanation && (
                <div 
                  className="glass-panel animate-fade-in" 
                  style={{ 
                    padding: '16px', 
                    background: 'rgba(255,255,255,0.02)', 
                    borderLeft: `4px solid ${userAnswer === selectedQuestion.answer ? 'var(--accent)' : 'var(--danger)'}`,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, fontSize: '0.95rem' }}>
                    {userAnswer === selectedQuestion.answer ? (
                      <CheckCircle size={18} style={{ color: 'var(--accent)' }} />
                    ) : (
                      <XCircle size={18} style={{ color: 'var(--danger)' }} />
                    )}
                    <span>{userAnswer === selectedQuestion.answer ? 'Correct Verdict!' : 'Incorrect Verdict'}</span>
                  </div>
                  
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    <strong>Explanation:</strong> {selectedQuestion.explanation}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrepModules;
