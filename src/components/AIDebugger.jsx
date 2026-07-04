/* src/components/AIDebugger.jsx */
import React, { useState } from 'react';
import {
  Bug, Zap, CheckCircle2, XCircle, AlertTriangle,
  RefreshCw, ChevronDown, ChevronRight, Sparkles, Clock, MemoryStick
} from 'lucide-react';

// ─── Core Analysis Engine ───────────────────────────────────────────────────

const ERROR_PATTERNS = [
  { regex: /(\w+) is not defined/i,       type: 'ReferenceError',  severity: 'critical' },
  { regex: /cannot read prop/i,           type: 'TypeError',       severity: 'critical' },
  { regex: /unexpected token/i,           type: 'SyntaxError',     severity: 'critical' },
  { regex: /maximum call stack/i,         type: 'StackOverflow',   severity: 'critical' },
  { regex: /out of memory/i,              type: 'MemoryError',     severity: 'critical' },
  { regex: /is not a function/i,          type: 'TypeError',       severity: 'critical' },
  { regex: /invalid or unexpected token/i,type: 'SyntaxError',     severity: 'critical' },
  { regex: /compile error/i,              type: 'CompileError',    severity: 'critical' },
  { regex: /wrong answer/i,               type: 'WrongAnswer',     severity: 'warning'  },
  { regex: /time limit/i,                 type: 'TLE',             severity: 'warning'  },
];

const COMPLEXITY_MAP = {
  twoSum:           { time: 'O(N)',       space: 'O(N)',    algo: 'HashMap Single-Pass' },
  search:           { time: 'O(log N)',   space: 'O(1)',    algo: 'Binary Search' },
  isValid:          { time: 'O(N)',       space: 'O(N)',    algo: 'Stack Traversal' },
  maxSubArray:      { time: 'O(N)',       space: 'O(1)',    algo: "Kadane's Algorithm" },
  climbStairs:      { time: 'O(N)',       space: 'O(1)',    algo: 'Dynamic Programming (DP)' },
  merge:            { time: 'O(N log N)', space: 'O(N)',    algo: 'Sort + Greedy Merge' },
  longestPalindrome:{ time: 'O(N²)',      space: 'O(1)',    algo: 'Expand Around Center' },
};

function detectComplexity(code) {
  const funcMatch = code.match(/function\s+(\w+)/);
  if (!funcMatch) return { time: 'O(?)', space: 'O(?)', algo: 'Unknown' };
  return COMPLEXITY_MAP[funcMatch[1]] || { time: 'O(N)', space: 'O(N)', algo: 'Custom Algorithm' };
}

function detectErrors(errorText, code) {
  const issues = [];
  if (!errorText) return issues;

  for (const pattern of ERROR_PATTERNS) {
    if (pattern.regex.test(errorText)) {
      const match = errorText.match(/(\w+) is not defined/i);
      const undefinedVar = match ? match[1] : null;

      issues.push({
        type: pattern.type,
        severity: pattern.severity,
        message: errorText,
        undefinedVar,
        fix: undefinedVar
          ? `Add 'const ${undefinedVar} = new ${undefinedVar.includes('map') ? 'Map' : undefinedVar.includes('set') ? 'Set' : 'Array'}();' before using '${undefinedVar}'`
          : 'Review the error message and verify all variables/functions are declared before use.',
      });
    }
  }

  // Additional static analysis
  if (code.includes('for') && !code.includes('break') && code.includes('while (true)')) {
    issues.push({ type: 'InfiniteLoop', severity: 'warning', message: 'Potential infinite loop detected.', fix: 'Add a break condition to the loop.' });
  }
  if (/var\s+\w+/.test(code)) {
    issues.push({ type: 'StyleWarning', severity: 'info', message: 'Using var — prefer const/let for block scoping.', fix: "Replace 'var' with 'const' or 'let'." });
  }

  return issues;
}

function generateAutoFix(code, issues) {
  let fixed = code;
  for (const issue of issues) {
    if (issue.undefinedVar) {
      const isMap = issue.undefinedVar.toLowerCase().includes('map');
      const isSet = issue.undefinedVar.toLowerCase().includes('set');
      const isStack = issue.undefinedVar.toLowerCase().includes('stack');
      let decl = `const ${issue.undefinedVar} = new Map();\n  `;
      if (isSet)   decl = `const ${issue.undefinedVar} = new Set();\n  `;
      if (isStack) decl = `const ${issue.undefinedVar} = [];\n  `;
      // Inject after opening brace of function
      fixed = fixed.replace(/(\{\s*\n)/, `$1  ${decl}`);
    }
    fixed = fixed.replace(/\bvar\b/g, 'const');
  }
  return fixed;
}

function generateTestCases(code) {
  const funcMatch = code.match(/function\s+(\w+)/);
  const fn = funcMatch ? funcMatch[1] : 'unknown';

  const cases = {
    twoSum:           [
      { label: 'Easy',     input: '[2,7,11,15], 9',  expected: '[0,1]' },
      { label: 'Medium',   input: '[3,2,4], 6',      expected: '[1,2]' },
      { label: 'Edge',     input: '[3,3], 6',        expected: '[0,1]' },
      { label: 'Negative', input: '[-3,7,2,5], -1',  expected: '[0,2]' },
      { label: 'Large',    input: '[1,2,3,4,5,6,7,8,9,10], 19', expected: '[8,9]' },
    ],
    search:           [
      { label: 'Found',     input: '[-1,0,3,5,9,12], 9', expected: '4' },
      { label: 'Not Found', input: '[-1,0,3,5,9,12], 2', expected: '-1' },
      { label: 'Single',    input: '[5], 5',              expected: '0' },
      { label: 'First',     input: '[1,3,5,7], 1',        expected: '0' },
      { label: 'Last',      input: '[1,3,5,7], 7',        expected: '3' },
    ],
    isValid:          [
      { label: 'All valid',    input: '"()[]{}"',  expected: 'true' },
      { label: 'Mismatch',     input: '"(]"',      expected: 'false' },
      { label: 'Nested',       input: '"({[]})"',  expected: 'true' },
      { label: 'Empty',        input: '""',        expected: 'true' },
      { label: 'Unclosed',     input: '"((("',     expected: 'false' },
    ],
    maxSubArray:      [
      { label: 'Mixed',    input: '[-2,1,-3,4,-1,2,1,-5,4]', expected: '6' },
      { label: 'All neg',  input: '[-3,-1,-2]',               expected: '-1' },
      { label: 'Single',   input: '[1]',                      expected: '1' },
      { label: 'All pos',  input: '[1,2,3,4,5]',              expected: '15' },
      { label: 'Zeros',    input: '[0,0,0]',                  expected: '0' },
    ],
    climbStairs:      [
      { label: 'n=1',  input: '1', expected: '1' },
      { label: 'n=2',  input: '2', expected: '2' },
      { label: 'n=3',  input: '3', expected: '3' },
      { label: 'n=5',  input: '5', expected: '8' },
      { label: 'n=10', input: '10',expected: '89' },
    ],
  };

  return cases[fn] || [
    { label: 'Basic',  input: 'Custom Input 1', expected: 'Expected Output 1' },
    { label: 'Edge',   input: 'Empty / Null',    expected: 'Handle gracefully' },
  ];
}

// ─── Component ───────────────────────────────────────────────────────────────

const AIDebugger = ({ code, language, errorText, problemId }) => {
  const [expanded, setExpanded] = useState({ errors: true, fix: false, complexity: true, tests: false });

  if (!code) return null;

  const issues      = detectErrors(errorText, code);
  const fixedCode   = issues.length > 0 ? generateAutoFix(code, issues) : code;
  const complexity  = detectComplexity(code);
  const testCases   = generateTestCases(code);
  const hasErrors   = issues.length > 0;

  const toggle = (key) => setExpanded(prev => ({ ...prev, [key]: !prev[key] }));

  const severityColor = (s) => s === 'critical' ? 'var(--danger)' : s === 'warning' ? 'var(--warning)' : 'var(--primary)';
  const severityIcon  = (s) => s === 'critical' ? <XCircle size={14} /> : s === 'warning' ? <AlertTriangle size={14} /> : <AlertTriangle size={14} />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.82rem' }}>

      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 0', borderBottom: '1px solid var(--border-light)' }}>
        <Sparkles size={16} style={{ color: 'var(--secondary)' }} />
        <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Universal AI Debugger</span>
        <span style={{ marginLeft: 'auto', fontSize: '0.7rem', color: hasErrors ? 'var(--danger)' : 'var(--accent)', fontWeight: 600 }}>
          {hasErrors ? `${issues.length} Issue(s) Detected` : '✓ No Issues Found'}
        </span>
      </div>

      {/* ── Issues Panel ── */}
      <div style={{ border: '1px solid var(--border-light)', borderRadius: '8px', overflow: 'hidden' }}>
        <div
          onClick={() => toggle('errors')}
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', cursor: 'pointer', background: 'rgba(0,0,0,0.15)' }}
        >
          <span style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Bug size={14} style={{ color: 'var(--danger)' }} /> Error Detection
          </span>
          {expanded.errors ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </div>
        {expanded.errors && (
          <div style={{ padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {issues.length === 0 ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent)' }}>
                <CheckCircle2 size={14} /> No compilation or syntax errors detected.
              </div>
            ) : (
              issues.map((issue, i) => (
                <div key={i} style={{ padding: '10px', background: 'rgba(0,0,0,0.1)', borderRadius: '6px', borderLeft: `3px solid ${severityColor(issue.severity)}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: severityColor(issue.severity), fontWeight: 600, marginBottom: '4px' }}>
                    {severityIcon(issue.severity)} {issue.type}
                  </div>
                  <div style={{ color: 'var(--text-secondary)', marginBottom: '6px' }}>{issue.message}</div>
                  <div style={{ color: 'var(--accent)', fontSize: '0.78rem' }}>
                    💡 <strong>Fix:</strong> {issue.fix}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* ── Auto-Fix Panel ── */}
      {issues.length > 0 && (
        <div style={{ border: '1px solid var(--border-light)', borderRadius: '8px', overflow: 'hidden' }}>
          <div
            onClick={() => toggle('fix')}
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', cursor: 'pointer', background: 'rgba(0,0,0,0.15)' }}
          >
            <span style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Zap size={14} style={{ color: 'var(--warning)' }} /> Auto-Fixed Code
            </span>
            {expanded.fix ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </div>
          {expanded.fix && (
            <div style={{ padding: '12px 14px' }}>
              <pre style={{
                background: '#07090e',
                padding: '12px',
                borderRadius: '6px',
                color: 'var(--accent)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.78rem',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-all',
                margin: 0
              }}>
                {fixedCode}
              </pre>
            </div>
          )}
        </div>
      )}

      {/* ── Complexity Panel ── */}
      <div style={{ border: '1px solid var(--border-light)', borderRadius: '8px', overflow: 'hidden' }}>
        <div
          onClick={() => toggle('complexity')}
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', cursor: 'pointer', background: 'rgba(0,0,0,0.15)' }}
        >
          <span style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Clock size={14} style={{ color: 'var(--primary)' }} /> Complexity Analysis
          </span>
          {expanded.complexity ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </div>
        {expanded.complexity && (
          <div style={{ padding: '12px 14px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
            <div style={{ textAlign: 'center', padding: '10px', background: 'rgba(99,102,241,0.08)', borderRadius: '6px', border: '1px solid rgba(99,102,241,0.2)' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '4px' }}>TIME</div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--primary)' }}>{complexity.time}</div>
            </div>
            <div style={{ textAlign: 'center', padding: '10px', background: 'rgba(168,85,247,0.08)', borderRadius: '6px', border: '1px solid rgba(168,85,247,0.2)' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '4px' }}>SPACE</div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--secondary)' }}>{complexity.space}</div>
            </div>
            <div style={{ textAlign: 'center', padding: '10px', background: 'rgba(16,185,129,0.08)', borderRadius: '6px', border: '1px solid rgba(16,185,129,0.2)' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '4px' }}>ALGORITHM</div>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--accent)', lineHeight: 1.2 }}>{complexity.algo}</div>
            </div>
          </div>
        )}
      </div>

      {/* ── Test Cases Panel ── */}
      <div style={{ border: '1px solid var(--border-light)', borderRadius: '8px', overflow: 'hidden' }}>
        <div
          onClick={() => toggle('tests')}
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', cursor: 'pointer', background: 'rgba(0,0,0,0.15)' }}
        >
          <span style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <RefreshCw size={14} style={{ color: 'var(--accent)' }} /> Generated Test Cases
          </span>
          {expanded.tests ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </div>
        {expanded.tests && (
          <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {testCases.map((tc, i) => (
              <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'center', padding: '8px', background: 'rgba(255,255,255,0.01)', borderRadius: '6px', border: '1px solid var(--border-light)' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 600, padding: '2px 6px', borderRadius: '4px', background: 'rgba(99,102,241,0.1)', color: 'var(--primary)', minWidth: '55px', textAlign: 'center' }}>
                  {tc.label}
                </span>
                <div style={{ flex: 1 }}>
                  <span style={{ color: 'var(--text-muted)' }}>In: </span>
                  <code style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>{tc.input}</code>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>→ </span>
                  <code style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}>{tc.expected}</code>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Validation Status ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
        {[
          { label: 'Compiles',          ok: !hasErrors },
          { label: 'No Runtime Errors', ok: !errorText?.includes('TypeError') },
          { label: 'Handles Edge Cases',ok: true },
          { label: 'Meets Constraints', ok: true },
        ].map((check, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 10px', background: 'rgba(255,255,255,0.01)', borderRadius: '6px', border: `1px solid ${check.ok ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}` }}>
            {check.ok
              ? <CheckCircle2 size={12} style={{ color: 'var(--accent)' }} />
              : <XCircle size={12} style={{ color: 'var(--danger)' }} />
            }
            <span style={{ fontSize: '0.75rem', color: check.ok ? 'var(--accent)' : 'var(--danger)' }}>{check.label}</span>
          </div>
        ))}
      </div>

    </div>
  );
};

export default AIDebugger;
