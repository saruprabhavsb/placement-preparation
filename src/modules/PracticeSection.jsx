/* src/modules/PracticeSection.jsx */
import React, { useContext, useState, useEffect } from 'react';
import { AppStateContext } from '../context/AppStateContext';
import { 
  Timer, 
  Bookmark, 
  FileText, 
  HelpCircle, 
  ChevronRight,
  TrendingUp,
  Save
} from 'lucide-react';

const PracticeSection = () => {
  const { 
    bookmarks, 
    toggleBookmark, 
    notes, 
    saveNote, 
    codingQuestions, 
    aptitudeQuestions, 
    addNotification 
  } = useContext(AppStateContext);

  const [subTab, setSubTab] = useState('tests'); // tests, bookmarks, notes, cards
  const [testState, setTestState] = useState('select'); // select, running, complete
  const [timerLeft, setTimerLeft] = useState(120); // 2 minutes (120s) for demonstration
  const [activeQuestionIdx, setActiveQuestionIdx] = useState(0);
  const [testAnswers, setTestAnswers] = useState({});
  const [finalScore, setFinalScore] = useState(0);

  // Revision Flashcards dataset
  const flashcards = [
    { q: "What is the time complexity of building a heap from scratch?", a: "O(N) using Floyd's heap construction algorithm." },
    { q: "What is the difference between primary keys and unique keys in SQL?", a: "Primary Key uniquely identifies a row and cannot contain NULL values. Unique Key allows one NULL value." },
    { q: "What is memory thrashing in Operating Systems?", a: "Thrashing occurs when the virtual memory is saturated, causing the system to spend more time swapping pages than executing instructions." }
  ];
  const [flippedCardIdx, setFlippedCardIdx] = useState(null);

  // Mock Test Questions
  const mockTestQs = [
    { id: 'mq-1', q: "Which data structure is best suited for implementing Breadth First Search (BFS)?", opts: ["Stack", "Queue", "Priority Queue", "Linked List"], ans: "Queue" },
    { id: 'mq-2', q: "If 15 men can build a wall in 20 days, how many days will 12 men take?", opts: ["25 days", "22 days", "24 days", "30 days"], ans: "25 days" },
    { id: 'mq-3', q: "What is the space complexity of an in-place sorting algorithm?", opts: ["O(1)", "O(log N)", "O(N)", "O(N^2)"], ans: "O(1)" }
  ];

  // Active quiz timer count
  useEffect(() => {
    let interval = null;
    if (testState === 'running') {
      interval = setInterval(() => {
        setTimerLeft(t => {
          if (t <= 1) {
            handleCompleteTest();
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [testState]);

  const handleStartTest = () => {
    setTimerLeft(120);
    setActiveQuestionIdx(0);
    setTestAnswers({});
    setTestState('running');
    addNotification('Mock Test Started', 'You have 2 minutes to complete the test.', 'info');
  };

  const handleCompleteTest = () => {
    let score = 0;
    mockTestQs.forEach(q => {
      if (testAnswers[q.id] === q.ans) {
        score += 1;
      }
    });
    setFinalScore(score);
    setTestState('complete');
    addNotification('Test Submitted', `You scored ${score} / ${mockTestQs.length}`, 'success');
  };

  // Filter Bookmarks
  const bookmarkedCodes = codingQuestions.filter(q => bookmarks.includes(q.id));
  const bookmarkedApts = aptitudeQuestions.filter(q => bookmarks.includes(q.id));

  // Edit notes
  const [editingNoteId, setEditingNoteId] = useState('code-1');
  const [noteContent, setNoteContent] = useState(notes['code-1'] || '');

  const handleSaveNote = () => {
    saveNote(editingNoteId, noteContent);
    addNotification('Notes Saved', 'Diagnostic notes updated successfully.', 'success');
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Sub tabs selection */}
      <div style={{ display: 'flex', gap: '12px' }}>
        {[
          { id: 'tests', label: 'Timed Mock Exams' },
          { id: 'bookmarks', label: 'Bookmarks Log' },
          { id: 'notes', label: 'Revision Notes' },
          { id: 'cards', label: 'Flipping Flashcards' }
        ].map((tab) => {
          const isActive = subTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSubTab(tab.id)}
              className="glass-btn"
              style={{
                background: isActive ? 'linear-gradient(135deg, var(--primary), var(--secondary))' : 'rgba(255,255,255,0.03)',
                border: isActive ? 'none' : '1px solid var(--border-light)'
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {subTab === 'tests' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {testState === 'select' && (
            <div className="glass-panel" style={{ padding: '32px', textAlign: 'center' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '8px' }}>Timed Practice Mock Exam</h3>
              <p style={{ color: 'var(--text-secondary)', maxWidth: '550px', margin: '0 auto 24px auto', lineHeight: 1.5 }}>
                Test your skills in this rapid 3-question MCQ quiz. You will have 2 minutes. Results are graded instantly upon completion.
              </p>
              <button onClick={handleStartTest} className="glass-btn btn-primary" style={{ padding: '12px 32px' }}>
                Start Mock Test
              </button>
            </div>
          )}

          {testState === 'running' && (
            <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Header: Timer */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Question {activeQuestionIdx + 1} of {mockTestQs.length}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--warning)', fontWeight: 600 }}>
                  <Timer size={18} />
                  <span>
                    {Math.floor(timerLeft / 60)}:{(timerLeft % 60).toString().padStart(2, '0')}
                  </span>
                </div>
              </div>

              {/* Active Question */}
              <div>
                <div style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '16px' }}>
                  {mockTestQs[activeQuestionIdx].q}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {mockTestQs[activeQuestionIdx].opts.map((opt, i) => {
                    const qId = mockTestQs[activeQuestionIdx].id;
                    const isChecked = testAnswers[qId] === opt;
                    return (
                      <label 
                        key={i}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '14px',
                          borderRadius: '8px',
                          border: isChecked ? '1px solid var(--primary)' : '1px solid var(--border-light)',
                          background: isChecked ? 'rgba(99,102,241,0.05)' : 'rgba(255,255,255,0.01)',
                          cursor: 'pointer'
                        }}
                      >
                        <input
                          type="radio"
                          name={`mock-q-${qId}`}
                          checked={isChecked}
                          onChange={() => setTestAnswers({ ...testAnswers, [qId]: opt })}
                          style={{ accentColor: 'var(--primary)' }}
                        />
                        <span style={{ fontSize: '0.9rem' }}>{opt}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Nav actions */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                <button
                  disabled={activeQuestionIdx === 0}
                  onClick={() => setActiveQuestionIdx(prev => prev - 1)}
                  className="glass-btn"
                >
                  Previous
                </button>
                {activeQuestionIdx < mockTestQs.length - 1 ? (
                  <button
                    onClick={() => setActiveQuestionIdx(prev => prev + 1)}
                    className="glass-btn btn-primary"
                  >
                    Next Question
                  </button>
                ) : (
                  <button
                    onClick={handleCompleteTest}
                    className="glass-btn btn-accent"
                  >
                    Submit Test
                  </button>
                )}
              </div>
            </div>
          )}

          {testState === 'complete' && (
            <div className="glass-panel animate-fade-in" style={{ padding: '28px', textAlign: 'center' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '8px' }}>Test Completed!</h3>
              <div style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--primary)', margin: '14px 0' }}>
                {finalScore} / {mockTestQs.length}
              </div>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>
                Accuracy Rate: {Math.round((finalScore / mockTestQs.length) * 100)}% | Grade: {finalScore === 3 ? 'Outstanding A' : 'Pass B'}
              </p>
              <button onClick={() => setTestState('select')} className="glass-btn">
                Close & Return
              </button>
            </div>
          )}
        </div>
      )}

      {subTab === 'bookmarks' && (
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Bookmark size={20} style={{ color: 'var(--primary)' }} /> Bookmarked Questions
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {bookmarkedCodes.map(q => (
              <div key={q.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-light)', borderRadius: '8px' }}>
                <div>
                  <span className="badge easy" style={{ marginRight: '8px' }}>Coding</span>
                  <strong>{q.title}</strong>
                </div>
                <button onClick={() => toggleBookmark(q.id)} style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', fontSize: '0.85rem' }}>
                  Remove
                </button>
              </div>
            ))}
            {bookmarkedApts.map(q => (
              <div key={q.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-light)', borderRadius: '8px' }}>
                <div>
                  <span className="badge medium" style={{ marginRight: '8px' }}>Aptitude</span>
                  <strong>{q.topic}:</strong> {q.question.substring(0, 40)}...
                </div>
                <button onClick={() => toggleBookmark(q.id)} style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', fontSize: '0.85rem' }}>
                  Remove
                </button>
              </div>
            ))}
            {bookmarks.length === 0 && (
              <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '20px 0' }}>No bookmarked items.</div>
            )}
          </div>
        </div>
      )}

      {subTab === 'notes' && (
        <div style={{ display: 'grid', gridTemplateColumns: '30% 70%', gap: '20px', alignItems: 'start' }}>
          {/* Notes Question Selector */}
          <div className="glass-panel" style={{ padding: '16px' }}>
            <h4 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '10px' }}>Solved DSA Notes</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {codingQuestions.map(q => (
                <button
                  key={q.id}
                  onClick={() => {
                    setEditingNoteId(q.id);
                    setNoteContent(notes[q.id] || '');
                  }}
                  style={{
                    padding: '10px',
                    borderRadius: '6px',
                    border: editingNoteId === q.id ? '1px solid var(--primary)' : '1px solid var(--border-light)',
                    background: editingNoteId === q.id ? 'rgba(99,102,241,0.05)' : 'rgba(255,255,255,0.01)',
                    color: editingNoteId === q.id ? 'var(--text-primary)' : 'var(--text-secondary)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontSize: '0.85rem'
                  }}
                >
                  {q.title}
                </button>
              ))}
            </div>
          </div>

          {/* Note Editor */}
          <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
              <FileText size={18} style={{ color: 'var(--primary)' }} /> Edit Study notes for {codingQuestions.find(q => q.id === editingNoteId)?.title}
            </h3>
            
            <textarea
              value={noteContent}
              onChange={e => setNoteContent(e.target.value)}
              placeholder="Write your DSA notes, optimizations, complexities or edge cases here..."
              className="glass-input"
              style={{ minHeight: '200px', resize: 'vertical', fontFamily: 'var(--font-body)', fontSize: '0.9rem', lineHeight: 1.5 }}
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={handleSaveNote} className="glass-btn btn-primary" style={{ gap: '6px' }}>
                <Save size={14} /> Save Notes
              </button>
            </div>
          </div>
        </div>
      )}

      {subTab === 'cards' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>Interactive Revision Flashcards</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            {flashcards.map((card, index) => {
              const isFlipped = flippedCardIdx === index;
              return (
                <div 
                  key={index}
                  onClick={() => setFlippedCardIdx(isFlipped ? null : index)}
                  className="glass-panel"
                  style={{
                    height: '180px',
                    padding: '24px',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center',
                    background: isFlipped ? 'rgba(99,102,241,0.08)' : 'rgba(15,22,42,0.45)',
                    border: isFlipped ? '1px solid var(--primary)' : '1px solid var(--border-light)',
                    transform: isFlipped ? 'rotateY(0deg)' : 'none',
                    transition: 'all 0.4s ease'
                  }}
                >
                  {!isFlipped ? (
                    <div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px' }}>QUESTION</div>
                      <div style={{ fontSize: '0.95rem', fontWeight: 600 }}>{card.q}</div>
                    </div>
                  ) : (
                    <div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--accent)', fontWeight: 600, marginBottom: '8px' }}>ANSWER</div>
                      <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)', lineHeight: 1.4 }}>{card.a}</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
};

export default PracticeSection;
