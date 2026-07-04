/* src/modules/AICareerAssistant.jsx */
import React, { useContext, useState } from 'react';
import { AppStateContext } from '../context/AppStateContext';
import { 
  Send, 
  Sparkles, 
  Map, 
  BrainCircuit, 
  TrendingUp, 
  MessageSquare,
  Compass
} from 'lucide-react';

const AICareerAssistant = () => {
  const { codingQuestions, addNotification } = useContext(AppStateContext);

  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState([
    { id: 'm-1', sender: 'ai', text: "Hello! I am your AI Career Assistant. How can I help you accelerate your placement preparation today?" }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = (textToSend) => {
    const query = textToSend || chatInput;
    if (!query.trim()) return;

    // Clear input
    if (!textToSend) setChatInput('');

    // Add user message
    const userMsg = { id: 'm-user-' + Date.now(), sender: 'user', text: query };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      let aiText = '';
      const lowercaseQuery = query.toLowerCase();

      if (lowercaseQuery.includes('roadmap') || lowercaseQuery.includes('7-day')) {
        aiText = "Here is your customized **7-Day Study Roadmap**:\n\n" +
                 "📅 **Day 1-2: Data Structures Foundation**\n" +
                 "Focus on HashMaps and Arrays. Practice 'Two Sum' and 'Merge Intervals'.\n\n" +
                 "📅 **Day 3-4: Strings & Recursion**\n" +
                 "Solve string parsing puzzles. Study Palindromes and Backtracking.\n\n" +
                 "📅 **Day 5: Quantitative Aptitude**\n" +
                 "Revise Probability and Time-Work equations.\n\n" +
                 "📅 **Day 6: Mock Interview**\n" +
                 "Run a simulated Technical Round using the 'Mock Interview' coach.\n\n" +
                 "📅 **Day 7: Revision & ATS Audit**\n" +
                 "Add missing keywords (like TypeScript/Redux) to your resume and run an ATS scan.";
      } else if (lowercaseQuery.includes('weak') || lowercaseQuery.includes('diagnose')) {
        // Calculate weak areas based on solved questions
        const solvedCategories = codingQuestions.filter(q => q.solved).map(q => q.category);
        const unsolvedCategories = codingQuestions.filter(q => !q.solved).map(q => q.category);

        aiText = "🔍 **Weak Area Diagnostic Report**:\n\n" +
                 `• **Strengths**: You have completed challenges in: **${solvedCategories.length > 0 ? [...new Set(solvedCategories)].join(', ') : 'None yet'}**.\n` +
                 `• **Opportunities**: You have pending tasks in: **${unsolvedCategories.length > 0 ? [...new Set(unsolvedCategories)].join(', ') : 'None! Outstanding work'}**.\n\n` +
                 "💡 *Recommendation*: Solve **LRU Cache** (Design category) to build caching memory architectures knowledge, which is heavily tested by Amazon and Google.";
      } else if (lowercaseQuery.includes('motivate') || lowercaseQuery.includes('motivation')) {
        aiText = "🔥 **Fuel Your Drive**:\n\n" +
                 "Consistency beats intensity every single day. Solving just 1 problem daily yields 365 problems a year. You are already in the top 5% of candidates by actively prepping. Success is the sum of small details, repeated day in and day out!";
      } else {
        aiText = "I have logged your request. I recommend generating a **7-Day Roadmap** or performing a **Weak Area Diagnosis** to focus your prep for top companies!";
      }

      const aiMsg = { id: 'm-ai-' + Date.now(), sender: 'ai', text: aiText };
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
      addNotification('AI Assistant', 'New advice generated.', 'info');
    }, 1200);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: '70% 30%', gap: '20px', height: 'calc(100vh - 120px)' }}>
      
      {/* Left Column: Chat log */}
      <div 
        className="glass-panel" 
        style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          overflow: 'hidden'
        }}
      >
        {/* Messages list */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {messages.map((m) => (
            <div 
              key={m.id}
              style={{
                alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '75%',
                background: m.sender === 'user' ? 'linear-gradient(135deg, var(--primary), var(--secondary))' : 'rgba(255,255,255,0.02)',
                border: m.sender === 'user' ? 'none' : '1px solid var(--border-light)',
                borderRadius: '12px',
                padding: '12px 16px',
                fontSize: '0.9rem',
                lineHeight: 1.5,
                color: 'var(--text-primary)',
                whiteSpace: 'pre-line'
              }}
            >
              {m.text}
            </div>
          ))}
          {isTyping && (
            <div 
              style={{
                alignSelf: 'flex-start',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid var(--border-light)',
                borderRadius: '12px',
                padding: '12px 16px',
                fontSize: '0.9rem',
                color: 'var(--text-muted)'
              }}
              className="pulse-glow"
            >
              AI is writing a roadmap...
            </div>
          )}
        </div>

        {/* Input box */}
        <div style={{ padding: '16px', borderTop: '1px solid var(--border-light)', display: 'flex', gap: '10px' }}>
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSend();
            }}
            placeholder="Ask anything about roadmaps, interviews, or weak areas..."
            className="glass-input"
            style={{ flex: 1 }}
          />
          <button
            onClick={() => handleSend()}
            className="glass-btn btn-primary"
            style={{ padding: '10px 16px' }}
          >
            <Send size={16} />
          </button>
        </div>
      </div>

      {/* Right Column: Prompt actions shortcuts */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <h3 style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Compass size={18} style={{ color: 'var(--secondary)' }} /> Quick Assist Options
          </h3>

          <button
            onClick={() => handleSend("Generate a 7-day study roadmap")}
            className="glass-btn"
            style={{ width: '100%', justifyContent: 'flex-start', fontSize: '0.85rem', gap: '10px' }}
          >
            <Map size={16} style={{ color: 'var(--primary)' }} />
            <span>7-Day Study Roadmap</span>
          </button>

          <button
            onClick={() => handleSend("Diagnose my weak areas")}
            className="glass-btn"
            style={{ width: '100%', justifyContent: 'flex-start', fontSize: '0.85rem', gap: '10px' }}
          >
            <BrainCircuit size={16} style={{ color: 'var(--accent)' }} />
            <span>Diagnose Weak Areas</span>
          </button>

          <button
            onClick={() => handleSend("Give me motivation")}
            className="glass-btn"
            style={{ width: '100%', justifyContent: 'flex-start', fontSize: '0.85rem', gap: '10px' }}
          >
            <TrendingUp size={16} style={{ color: 'var(--warning)' }} />
            <span>Motivation Boost</span>
          </button>
        </div>

        {/* AI Assistant context statistics */}
        <div className="glass-panel" style={{ padding: '20px', fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
          <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>Chat Assistant Status</div>
          • Processing: Live client-side logic
          <br />
          • Current Mode: Placement advisory
          <br />
          • Active Models: Cognitive QA simulator
        </div>
      </div>

    </div>
  );
};

export default AICareerAssistant;
