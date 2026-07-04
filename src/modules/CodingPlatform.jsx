/* src/modules/CodingPlatform.jsx */
import React, { useContext, useState, useEffect } from 'react';
import { AppStateContext } from '../context/AppStateContext';
import AIDebugger from '../components/AIDebugger';
import { 
  Play, 
  Send, 
  RotateCcw, 
  Check, 
  AlertCircle, 
  Terminal, 
  ListOrdered,
  ChevronRight,
  Sparkles
} from 'lucide-react';

const CodingPlatform = () => {
  const { 
    codingQuestions, 
    recordSubmission, 
    addNotification 
  } = useContext(AppStateContext);

  const [selectedProblem, setSelectedProblem] = useState(codingQuestions[0]);
  const [selectedLang, setSelectedLang] = useState('javascript');
  const [editorCode, setEditorCode] = useState(selectedProblem.starterCode[selectedLang]);
  const [customInput, setCustomInput] = useState('');
  
  // Terminal states
  const [terminalOutput, setTerminalOutput] = useState('');
  const [terminalStatus, setTerminalStatus] = useState('idle'); // idle, running, success, error
  const [consoleTab, setConsoleTab] = useState('output'); // output, ai-debugger
  const [lastErrorText, setLastErrorText] = useState('');
  const [activePane, setActivePane] = useState('description'); // description, submissions, leaderboard

  // Refresh code when problem or language changes
  useEffect(() => {
    if (selectedProblem.starterCode[selectedLang]) {
      setEditorCode(selectedProblem.starterCode[selectedLang]);
    } else {
      setEditorCode('// No starter code available');
    }
    setTerminalOutput('');
    setTerminalStatus('idle');
    setLastErrorText('');
    setConsoleTab('output');
  }, [selectedProblem, selectedLang]);

  // Mock Leaderboard
  const leaderboard = [
    { rank: 1, name: 'Siddharth M.', solved: 4, score: 980 },
    { rank: 2, name: 'Priya R.', solved: 4, score: 940 },
    { rank: 3, name: 'Aniket Sharma (You)', solved: 2, score: 810 },
    { rank: 4, name: 'Rahul V.', solved: 2, score: 760 },
    { rank: 5, name: 'Sneha K.', solved: 1, score: 450 }
  ];

  // Client-side JS code runner
  const handleRunCode = (isSubmit = false) => {
    setTerminalStatus('running');
    setTerminalOutput('Compiling and running tests...');
    setConsoleTab('output');

    setTimeout(() => {
      if (selectedLang !== 'javascript') {
        // Mock execution for Python, C++, Java
        setTerminalStatus('success');
        setTerminalOutput(
          `[Mock Compiler] Running in ${selectedLang.toUpperCase()} Mode...\n` +
          `Test Case 1: Pass\n` +
          `Test Case 2: Pass\n` +
          `Status: SUCCESS\n` +
          `Execution Time: 42ms`
        );
        setLastErrorText('');
        if (isSubmit) {
          recordSubmission(selectedProblem.id, selectedLang, 'Accepted', editorCode);
        }
        return;
      }

      // Live JS Evaluation
      try {
        let runResult = '';
        let passAll = true;

        // Extract function or class name from code
        const funcMatch = editorCode.match(/function\s+(\w+)/) || editorCode.match(/class\s+(\w+)/);
        if (!funcMatch) {
          throw new Error("Could not parse main function or class name. Ensure your solution template declares a main function or class.");
        }
        const funcName = funcMatch[1];

        // Evaluate user code in a controlled namespace
        const evalCode = `${editorCode}\nreturn ${funcName};`;
        const userFunctionOrClass = new Function(evalCode)();

        // Run against problem's test cases
        selectedProblem.testCases.forEach((tc, idx) => {
          let result;
          let expectedStr = tc.expected;

          if (selectedProblem.id === 'code-1') { // Two Sum
            const nums = idx === 0 ? [2,7,11,15] : [3,2,4];
            const target = idx === 0 ? 9 : 6;
            result = userFunctionOrClass(nums, target);
          } 
          else if (selectedProblem.id === 'code-2') { // Merge Intervals
            const intervals = idx === 0 ? [[1,3],[2,6],[8,10],[15,18]] : [[1,4],[4,5]];
            result = userFunctionOrClass(intervals);
          } 
          else if (selectedProblem.id === 'code-3') { // LRU Cache
            const cache = new userFunctionOrClass(2);
            cache.put(1, 1);
            cache.put(2, 2);
            const r1 = cache.get(1); // should be 1
            cache.put(3, 3); // evicts key 2
            const r2 = cache.get(2); // should be -1
            result = [r1, r2];
            expectedStr = '[1,-1]';
          } 
          else if (selectedProblem.id === 'code-4') { // Longest Palindromic Substring
            const str = idx === 0 ? "babad" : "cbbd";
            result = userFunctionOrClass(str);
          }
          else if (selectedProblem.id === 'code-5') { // Binary Search
            const nums = [-1,0,3,5,9,12];
            const target = idx === 0 ? 9 : 2;
            result = userFunctionOrClass(nums, target);
          }
          else if (selectedProblem.id === 'code-6') { // Valid Parentheses
            const str = idx === 0 ? "()[]{}" : "(]";
            result = userFunctionOrClass(str);
          }
          else if (selectedProblem.id === 'code-7') { // Maximum Subarray
            const nums = idx === 0 ? [-2,1,-3,4,-1,2,1,-5,4] : [1];
            result = userFunctionOrClass(nums);
          }
          else if (selectedProblem.id === 'code-8') { // Climbing Stairs
            const n = idx === 0 ? 2 : 5;
            result = userFunctionOrClass(n);
          }

          const resultStr = JSON.stringify(result);
          // Standardize expected compare
          const cleanExpectedStr = expectedStr.replace(/\s+/g, '');
          const cleanResultStr = resultStr ? resultStr.replace(/\s+/g, '') : '';
          
          let isMatch = cleanResultStr === cleanExpectedStr;

          // Special logic for palindromes where both aba and bab are valid
          if (selectedProblem.id === 'code-4' && idx === 0) {
            isMatch = result === "bab" || result === "aba";
          }

          runResult += `Test Case ${idx + 1} (${tc.input}):\n` +
                       `  Expected: ${expectedStr}\n` +
                       `  Received: ${resultStr}\n` +
                       `  Verdict: ${isMatch ? 'PASSED ✅' : 'FAILED ❌'}\n\n`;
          if (!isMatch) passAll = false;
        });

        if (passAll) {
          setTerminalStatus('success');
          setTerminalOutput(runResult + `Status: Accepted.\nAll test cases passed! 🎉`);
          setLastErrorText('');
          if (isSubmit) {
            recordSubmission(selectedProblem.id, selectedLang, 'Accepted', editorCode);
          }
        } else {
          setTerminalStatus('error');
          setTerminalOutput(runResult + `Status: Wrong Answer.`);
          setLastErrorText('Error: wrong answer detected in unit test results.');
          // Automatically focus AI Debugger panel on wrong answer
          setConsoleTab('ai-debugger');
          if (isSubmit) {
            recordSubmission(selectedProblem.id, selectedLang, 'Wrong Answer', editorCode);
          }
        }
      } catch (err) {
        setTerminalStatus('error');
        setTerminalOutput(`Compilation Error:\n${err.message}`);
        setLastErrorText(err.message);
        // Automatically focus AI Debugger panel on compilation error
        setConsoleTab('ai-debugger');
        if (isSubmit) {
          recordSubmission(selectedProblem.id, selectedLang, 'Compile Error', editorCode);
        }
      }
    }, 1200);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: '40% 60%', gap: '20px', height: 'calc(100vh - 120px)' }}>
      
      {/* Left Panel: Description / Submissions / Leaderboard */}
      <div 
        className="glass-panel" 
        style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          overflow: 'hidden'
        }}
      >
        {/* Toggle headers */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-light)', background: 'rgba(0,0,0,0.1)' }}>
          <button 
            onClick={() => setActivePane('description')}
            style={{
              flex: 1, padding: '14px', border: 'none', background: 'none', color: activePane === 'description' ? 'var(--primary)' : 'var(--text-secondary)',
              borderBottom: activePane === 'description' ? '2px solid var(--primary)' : 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem'
            }}
          >
            Description
          </button>
          <button 
            onClick={() => setActivePane('leaderboard')}
            style={{
              flex: 1, padding: '14px', border: 'none', background: 'none', color: activePane === 'leaderboard' ? 'var(--primary)' : 'var(--text-secondary)',
              borderBottom: activePane === 'leaderboard' ? '2px solid var(--primary)' : 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem'
            }}
          >
            Leaderboard
          </button>
        </div>

        {/* Sidebar problem list & details */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '18px' }}>
          {activePane === 'description' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Problem Selector dropdown */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>SELECT PROBLEM</label>
                <select 
                  value={selectedProblem.id}
                  onChange={(e) => {
                    const found = codingQuestions.find(q => q.id === e.target.value);
                    if (found) setSelectedProblem(found);
                  }}
                  className="glass-input"
                  style={{ background: 'var(--bg-secondary)', cursor: 'pointer' }}
                >
                  {codingQuestions.map(q => (
                    <option key={q.id} value={q.id}>
                      {q.title} ({q.difficulty}) {q.solved ? '✓' : ''}
                    </option>
                  ))}
                </select>
              </div>

              {/* Title & Badge */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px' }}>
                <h3 style={{ fontSize: '1.25rem' }}>{selectedProblem.title}</h3>
                <span className={`badge ${selectedProblem.difficulty.toLowerCase()}`}>
                  {selectedProblem.difficulty}
                </span>
              </div>

              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Acceptance: {selectedProblem.acceptance} | Category: {selectedProblem.category}
              </div>

              {/* Problem Statement */}
              <div 
                style={{ 
                  fontSize: '0.9rem', 
                  lineHeight: 1.6, 
                  color: 'var(--text-secondary)',
                  background: 'rgba(255,255,255,0.01)',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.02)'
                }}
              >
                {selectedProblem.description}
              </div>

              {/* Examples */}
              <div>
                <h4 style={{ fontSize: '0.95rem', marginBottom: '8px' }}>Test Cases</h4>
                {selectedProblem.testCases.map((tc, index) => (
                  <div 
                    key={index}
                    style={{ 
                      background: 'rgba(0,0,0,0.2)', 
                      padding: '10px', 
                      borderRadius: '6px', 
                      fontSize: '0.8rem', 
                      fontFamily: 'var(--font-mono)',
                      marginBottom: '8px',
                      borderLeft: '3px solid var(--primary)'
                    }}
                  >
                    <div><strong>Input:</strong> {tc.input}</div>
                    <div style={{ marginTop: '4px' }}><strong>Expected:</strong> {tc.expected}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activePane === 'leaderboard' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h4 style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ListOrdered size={18} style={{ color: 'var(--secondary)' }} /> Active Prep Leaderboard
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {leaderboard.map(user => (
                  <div 
                    key={user.rank}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      background: user.rank === 3 ? 'rgba(99, 102, 241, 0.1)' : 'rgba(255,255,255,0.02)',
                      border: user.rank === 3 ? '1px solid var(--primary)' : '1px solid var(--border-light)',
                      borderRadius: '8px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontWeight: 800, color: user.rank === 1 ? 'var(--warning)' : 'var(--text-muted)' }}>
                        #{user.rank}
                      </span>
                      <span style={{ fontSize: '0.85rem', fontWeight: user.rank === 3 ? 600 : 400 }}>
                        {user.name}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      {user.solved} solved ({user.score} pts)
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Panel: Editor & Terminal */}
      <div style={{ display: 'grid', gridTemplateRows: '60% 40%', gap: '16px' }}>
        
        {/* Editor Container */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Header controls */}
          <div 
            style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              padding: '8px 16px', 
              background: 'rgba(0,0,0,0.1)', 
              borderBottom: '1px solid var(--border-light)' 
            }}
          >
            <div style={{ display: 'flex', gap: '10px' }}>
              <select
                value={selectedLang}
                onChange={(e) => setSelectedLang(e.target.value)}
                className="glass-input"
                style={{ padding: '4px 10px', fontSize: '0.8rem', background: 'var(--bg-secondary)' }}
              >
                <option value="javascript">JavaScript</option>
                <option value="python">Python 3</option>
                <option value="cpp">C++ 17</option>
                <option value="java">Java 11</option>
              </select>
            </div>
            
            <button 
              onClick={() => setEditorCode(selectedProblem.starterCode[selectedLang])}
              className="flex-center" 
              title="Reset Code template"
              style={{
                background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px'
              }}
            >
              <RotateCcw size={16} />
            </button>
          </div>

          {/* Actual Code Area */}
          <div style={{ flex: 1, position: 'relative' }}>
            <textarea
              value={editorCode}
              onChange={(e) => setEditorCode(e.target.value)}
              style={{
                width: '100%',
                height: '100%',
                background: '#07090e',
                color: '#e2e8f0',
                border: 'none',
                resize: 'none',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.85rem',
                padding: '16px',
                outline: 'none',
                lineHeight: 1.5
              }}
            />
          </div>
        </div>

        {/* Console / Terminal Container */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          
          {/* Tab Selection Header */}
          <div 
            style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              padding: '4px 16px', 
              background: 'rgba(0,0,0,0.15)', 
              borderBottom: '1px solid var(--border-light)' 
            }}
          >
            <div style={{ display: 'flex', gap: '4px' }}>
              <button
                onClick={() => setConsoleTab('output')}
                style={{
                  padding: '6px 12px',
                  background: consoleTab === 'output' ? 'rgba(255,255,255,0.05)' : 'none',
                  border: 'none',
                  color: consoleTab === 'output' ? 'var(--text-primary)' : 'var(--text-muted)',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Terminal size={12} /> Output Log
              </button>
              <button
                onClick={() => setConsoleTab('ai-debugger')}
                style={{
                  padding: '6px 12px',
                  background: consoleTab === 'ai-debugger' ? 'rgba(99,102,241,0.1)' : 'none',
                  border: 'none',
                  color: consoleTab === 'ai-debugger' ? 'var(--primary)' : 'var(--text-muted)',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Sparkles size={12} /> AI Debugger Report
              </button>
            </div>
            
            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                onClick={() => handleRunCode(false)}
                disabled={terminalStatus === 'running'}
                className="glass-btn btn-accent"
                style={{ padding: '4px 12px', fontSize: '0.75rem', gap: '4px' }}
              >
                <Play size={12} /> Run Code
              </button>
              <button 
                onClick={() => handleRunCode(true)}
                disabled={terminalStatus === 'running'}
                className="glass-btn btn-primary"
                style={{ padding: '4px 12px', fontSize: '0.75rem', gap: '4px' }}
              >
                <Send size={12} /> Submit
              </button>
            </div>
          </div>

          {/* Active Tab Panel View */}
          <div style={{ flex: 1, overflowY: 'auto', background: '#040508', padding: '12px' }}>
            {consoleTab === 'output' ? (
              <div 
                style={{ 
                  fontFamily: 'var(--font-mono)', 
                  fontSize: '0.8rem',
                  whiteSpace: 'pre-wrap',
                  color: terminalStatus === 'error' ? 'var(--danger)' : terminalStatus === 'success' ? 'var(--accent)' : 'var(--text-secondary)'
                }}
              >
                {terminalStatus === 'idle' && <div style={{ color: 'var(--text-muted)' }}>Ready. Write code and click Run Code to execute.</div>}
                {terminalStatus === 'running' && <div className="pulse-glow" style={{ color: 'var(--warning)' }}>Running compiler tests...</div>}
                {terminalStatus !== 'idle' && terminalStatus !== 'running' && terminalOutput}
              </div>
            ) : (
              <AIDebugger 
                code={editorCode} 
                language={selectedLang} 
                errorText={lastErrorText} 
                problemId={selectedProblem.id} 
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodingPlatform;
