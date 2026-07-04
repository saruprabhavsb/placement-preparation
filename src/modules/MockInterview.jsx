/* src/modules/MockInterview.jsx */
import React, { useContext, useState, useEffect } from 'react';
import { AppStateContext } from '../context/AppStateContext';
import { 
  Mic, 
  MicOff, 
  Send, 
  Award, 
  BookOpen, 
  TrendingUp,
  MessageSquare,
  Sparkles,
  RefreshCw
} from 'lucide-react';

const MockInterview = () => {
  const { recordInterview, addNotification } = useContext(AppStateContext);

  const [stage, setStage] = useState('select'); // select, interview, result
  const [interviewType, setInterviewType] = useState('Technical'); // HR, Technical, Coding
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [transcript, setTranscript] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState(null);

  // Sample questions list
  const interviewQuestions = {
    Technical: [
      { q: "What is the difference between a Process and a Thread, and how do they manage memory?", keywords: ['memory', 'process', 'thread', 'share', 'isolated'] },
      { q: "Explain the difference between SQL and NoSQL databases, and when would you prefer NoSQL?", keywords: ['schema', 'scaling', 'relational', 'document', 'sql'] },
      { q: "Explain how React's Virtual DOM works to optimize page rendering.", keywords: ['diffing', 'reconciliation', 'dom', 'update', 'virtual'] }
    ],
    HR: [
      { q: "Tell me about a time you handled a disagreement in a project group.", keywords: ['listen', 'compromise', 'respect', 'team', 'resolved'] },
      { q: "Why do you want to join our organization, and what makes you the ideal candidate?", keywords: ['values', 'grow', 'skills', 'contribute', 'ideal'] },
      { q: "Where do you see yourself in the next five years, professionally?", keywords: ['learn', 'leadership', 'expert', 'growth', 'contribute'] }
    ]
  };

  // Setup Web Speech API for voice dictation
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = 'en-US';

      rec.onresult = (event) => {
        let interimTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            setUserAnswer(prev => prev + ' ' + event.results[i][0].transcript);
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
      };

      rec.onerror = (e) => {
        console.error("Speech recognition error:", e);
        setIsRecording(false);
      };

      rec.onend = () => {
        setIsRecording(false);
      };

      setRecognition(rec);
    }
  }, []);

  const toggleRecording = () => {
    if (!recognition) {
      addNotification('Speech Recognition', 'Voice typing is not supported in this browser. Please type your response.', 'warning');
      return;
    }

    if (isRecording) {
      recognition.stop();
      setIsRecording(false);
    } else {
      setIsRecording(true);
      recognition.start();
      addNotification('Microphone Active', 'Speak clearly. Dictation active.', 'info');
    }
  };

  const handleStart = (type) => {
    setInterviewType(type);
    setCurrentQuestionIdx(0);
    setUserAnswer('');
    setTranscript([]);
    setStage('interview');
  };

  const handleSubmitAnswer = () => {
    if (userAnswer.trim().length < 10) {
      addNotification('Short response', 'Please provide a more detailed response to continue.', 'warning');
      return;
    }

    // Stop recording if active
    if (isRecording && recognition) {
      recognition.stop();
      setIsRecording(false);
    }

    const currentQuestions = interviewQuestions[interviewType] || interviewQuestions.Technical;
    const currentQ = currentQuestions[currentQuestionIdx];

    // Score user answer
    const words = userAnswer.toLowerCase().split(/\s+/);
    let matchedKeywords = [];
    currentQ.keywords.forEach(kw => {
      if (userAnswer.toLowerCase().includes(kw)) {
        matchedKeywords.push(kw);
      }
    });

    const kwScore = (matchedKeywords.length / currentQ.keywords.length) * 60;
    const lenScore = Math.min(40, words.length * 0.4);
    const score = Math.round(kwScore + lenScore);

    const qaLog = {
      question: currentQ.q,
      answer: userAnswer,
      score,
      feedback: score >= 80 ? 'Excellent clarity and keyword usage.' : score >= 60 ? 'Good coverage, but try to use more technical key phrases.' : 'Needs elaboration. Explain concepts step-by-step.'
    };

    setTranscript(prev => [...prev, qaLog]);

    if (currentQuestionIdx < currentQuestions.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
      setUserAnswer('');
    } else {
      // Calculate overall score
      setTimeout(() => {
        setStage('result');
      }, 500);
    }
  };

  const getOverallGrade = (score) => {
    if (score >= 90) return 'A+';
    if (score >= 80) return 'A-';
    if (score >= 70) return 'B+';
    if (score >= 60) return 'B-';
    return 'C';
  };

  const renderResult = () => {
    const totalScore = transcript.reduce((sum, item) => sum + item.score, 0);
    const averageScore = Math.round(totalScore / transcript.length);
    const grade = getOverallGrade(averageScore);

    // Save mock interview stats globally
    const handleCompleteSave = () => {
      recordInterview(interviewType, 'Mock AI Corp', averageScore, grade);
      setStage('select');
    };

    return (
      <div className="glass-panel animate-fade-in" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* Performance Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-light)', paddingBottom: '16px' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Interview Evaluation Completed</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>Session: {interviewType} Assessment</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Avg Score</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)' }}>{averageScore}%</div>
            </div>
            <div className="flex-center" style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', color: 'white', fontWeight: 'bold', fontSize: '1.25rem' }}>
              {grade}
            </div>
          </div>
        </div>

        {/* Detailed Logs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {transcript.map((item, index) => (
            <div 
              key={index}
              style={{
                padding: '16px',
                background: 'rgba(255, 255, 255, 0.01)',
                border: '1px solid var(--border-light)',
                borderRadius: '12px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, fontSize: '0.9rem', marginBottom: '8px' }}>
                <span>Question {index + 1}: {item.question}</span>
                <span style={{ color: item.score >= 80 ? 'var(--accent)' : item.score >= 60 ? 'var(--warning)' : 'var(--danger)' }}>
                  Score: {item.score}%
                </span>
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontStyle: 'italic', marginBottom: '10px' }}>
                " {item.answer} "
              </div>
              <div style={{ fontSize: '0.8rem', background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '6px', color: 'var(--text-primary)' }}>
                <strong>AI Review:</strong> {item.feedback}
              </div>
            </div>
          ))}
        </div>

        {/* Action button */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '10px' }}>
          <button
            onClick={handleCompleteSave}
            className="glass-btn btn-primary"
            style={{ padding: '10px 24px' }}
          >
            Save Session & Return
          </button>
        </div>

      </div>
    );
  };

  const currentQuestions = interviewQuestions[interviewType] || interviewQuestions.Technical;
  const activeQ = currentQuestions[currentQuestionIdx];

  return (
    <div>
      {stage === 'select' && (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="glass-panel" style={{ padding: '28px', textAlign: 'center' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '8px' }}>AI Interactive Placement Mock Coach</h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto 20px auto', lineHeight: 1.5 }}>
              Choose an interview category below. The virtual assistant will present common placement questions. Speak or type your answers to receive scoring and grading reviews.
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
              <div 
                onClick={() => handleStart('Technical')}
                className="glass-panel glow-indigo" 
                style={{ padding: '24px', width: '220px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}
              >
                <div className="flex-center" style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.15)', color: 'var(--primary)' }}>
                  <Award size={24} />
                </div>
                <h4 style={{ fontSize: '1rem' }}>Technical Round</h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>OS, Databases, React, and networking algorithms.</p>
              </div>

              <div 
                onClick={() => handleStart('HR')}
                className="glass-panel glow-violet" 
                style={{ padding: '24px', width: '220px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}
              >
                <div className="flex-center" style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(168, 85, 247, 0.15)', color: 'var(--secondary)' }}>
                  <MessageSquare size={24} />
                </div>
                <h4 style={{ fontSize: '1rem' }}>HR & Behavioral</h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Conflict resolution, aspirations, and values tests.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {stage === 'interview' && (
        <div className="glass-panel animate-fade-in" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Question Index Progress */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Question {currentQuestionIdx + 1} of {currentQuestions.length}</span>
            <span className="badge medium" style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)' }}>{interviewType} Session</span>
          </div>

          {/* AI Coach Question Prompt */}
          <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
            <div className="flex-center" style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(99, 102, 241, 0.15)', color: 'var(--primary)', flexShrink: 0 }}>
              <Sparkles size={24} className="pulse-glow" />
            </div>
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '18px', borderRadius: '12px', border: '1px solid var(--border-light)', flex: 1 }}>
              <p style={{ fontSize: '1.1rem', fontWeight: 500, lineHeight: 1.5 }}>
                {activeQ.q}
              </p>
            </div>
          </div>

          {/* User Input Section */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ position: 'relative' }}>
              <textarea
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Type your response here or click the microphone to dictate your answer..."
                className="glass-input"
                style={{ width: '100%', minHeight: '140px', paddingRight: '50px', resize: 'vertical' }}
              />
              <button
                onClick={toggleRecording}
                className="flex-center"
                title={isRecording ? "Stop voice input" : "Activate voice input"}
                style={{
                  position: 'absolute',
                  bottom: '16px',
                  right: '16px',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: isRecording ? 'var(--danger)' : 'rgba(255,255,255,0.05)',
                  border: '1px solid var(--border-light)',
                  color: isRecording ? 'white' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  transition: 'background var(--transition-fast)'
                }}
              >
                {isRecording ? <MicOff size={16} /> : <Mic size={16} />}
              </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button
                onClick={() => setStage('select')}
                className="glass-btn"
              >
                Abort
              </button>
              <button
                onClick={handleSubmitAnswer}
                className="glass-btn btn-primary"
                style={{ gap: '6px' }}
              >
                Submit Answer <Send size={14} />
              </button>
            </div>
          </div>

        </div>
      )}

      {stage === 'result' && renderResult()}
    </div>
  );
};

export default MockInterview;
