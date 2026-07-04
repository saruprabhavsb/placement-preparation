/* src/context/AppStateContext.jsx */
import React, { createContext, useState, useEffect } from 'react';

export const AppStateContext = createContext();

// Mock Initial Coding Questions
const initialCodingQuestions = [
  {
    id: 'code-1',
    title: 'Two Sum',
    difficulty: 'Easy',
    category: 'Arrays',
    solved: true,
    acceptance: '49%',
    description: 'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`. You may assume that each input would have exactly one solution, and you may not use the same element twice.',
    starterCode: {
      javascript: `function twoSum(nums, target) {\n  // Hint: Use a HashMap for O(N) solution\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (map.has(complement)) return [map.get(complement), i];\n    map.set(nums[i], i);\n  }\n  return [];\n}`,
      python: `def twoSum(nums, target):\n    # Hint: Use a dictionary for O(N) solution\n    seen = {}\n    for i, num in enumerate(nums):\n        complement = target - num\n        if complement in seen:\n            return [seen[complement], i]\n        seen[num] = i\n    return []`,
      cpp: `#include <vector>\n#include <unordered_map>\n\nclass Solution {\npublic:\n    std::vector<int> twoSum(std::vector<int>& nums, int target) {\n        std::unordered_map<int,int> map;\n        for (int i = 0; i < nums.size(); i++) {\n            int complement = target - nums[i];\n            if (map.count(complement)) return {map[complement], i};\n            map[nums[i]] = i;\n        }\n        return {};\n    }\n};`,
      java: `import java.util.*;\n\nclass Solution {\n    public int[] twoSum(int[] nums, int target) {\n        Map<Integer,Integer> map = new HashMap<>();\n        for (int i = 0; i < nums.length; i++) {\n            int complement = target - nums[i];\n            if (map.containsKey(complement)) return new int[]{map.get(complement), i};\n            map.put(nums[i], i);\n        }\n        return new int[0];\n    }\n}`
    },
    testCases: [
      { input: '[2,7,11,15], 9', expected: '[0,1]' },
      { input: '[3,2,4], 6', expected: '[1,2]' }
    ]
  },
  {
    id: 'code-2',
    title: 'Merge Intervals',
    difficulty: 'Medium',
    category: 'Arrays',
    solved: false,
    acceptance: '45%',
    description: 'Given an array of `intervals` where `intervals[i] = [start_i, end_i]`, merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.',
    starterCode: {
      javascript: `function merge(intervals) {\n  // Write your code here\n  return [];\n}`,
      python: `def merge(intervals):\n    # Write your code here\n    return []`,
      cpp: `#include <vector>\n\nclass Solution {\npublic:\n    std::vector<std::vector<int>> merge(std::vector<std::vector<int>>& intervals) {\n        return {};\n    }\n};`,
      java: `import java.util.*;\n\nclass Solution {\n    public int[][] merge(int[][] intervals) {\n        return new int[0][0];\n    }\n}`
    },
    testCases: [
      { input: '[[1,3],[2,6],[8,10],[15,18]]', expected: '[[1,6],[8,10],[15,18]]' },
      { input: '[[1,4],[4,5]]', expected: '[[1,5]]' }
    ]
  },
  {
    id: 'code-3',
    title: 'LRU Cache',
    difficulty: 'Hard',
    category: 'Design',
    solved: false,
    acceptance: '40%',
    description: 'Design a data structure that follows the constraints of a Least Recently Used (LRU) cache. Implement the `LRUCache` class with `get` and `put` methods.',
    starterCode: {
      javascript: `class LRUCache {\n  constructor(capacity) {}\n  get(key) { return -1; }\n  put(key, value) {}\n}`,
      python: `class LRUCache:\n    def __init__(self, capacity: int):\n        pass\n    def get(self, key: int) -> int:\n        return -1\n    def put(self, key: int, value: int) -> None:\n        pass`,
      cpp: `class LRUCache {\npublic:\n    LRUCache(int capacity) {}\n    int get(int key) { return -1; }\n    void put(int key, int value) {}\n};`,
      java: `class LRUCache {\n    public LRUCache(int capacity) {}\n    public int get(int key) { return -1; }\n    public void put(int key, int value) {}\n}`
    },
    testCases: [
      { input: '["LRUCache","put","put","get","put","get","put","get","get","get"], [[2],[1,1],[2,2],[1],[3,3],[2],[4,4],[1],[3],[4]]', expected: '[null,null,null,1,null,-1,null,-1,3,4]' }
    ]
  },
  {
    id: 'code-4',
    title: 'Longest Palindromic Substring',
    difficulty: 'Medium',
    category: 'Strings',
    solved: true,
    acceptance: '32%',
    description: 'Given a string `s`, return the longest palindromic substring in `s`.',
    starterCode: {
      javascript: `function longestPalindrome(s) {\n  // Write your code here\n  return "";\n}`,
      python: `def longestPalindrome(s: str) -> str:\n    # Write your code here\n    return ""`,
      cpp: `#include <string>\n\nclass Solution {\npublic:\n    std::string longestPalindrome(std::string s) {\n        return "";\n    }\n};`,
      java: `class Solution {\n    public String longestPalindrome(String s) {\n        return "";\n    }\n}`
    },
    testCases: [
      { input: '"babad"', expected: '"bab"' },
      { input: '"cbbd"', expected: '"bb"' }
    ]
  },
  {
    id: 'code-5',
    title: 'Binary Search',
    difficulty: 'Easy',
    category: 'Searching',
    solved: false,
    acceptance: '55%',
    description: 'Given an array of integers `nums` which is sorted in ascending order, and an integer `target`, write a function to search `target` in `nums`. If `target` exists, return its index. Otherwise, return -1. You must write an algorithm with O(log n) runtime complexity.',
    starterCode: {
      javascript: `function search(nums, target) {\n  let left = 0, right = nums.length - 1;\n  while (left <= right) {\n    const mid = Math.floor((left + right) / 2);\n    if (nums[mid] === target) return mid;\n    if (nums[mid] < target) left = mid + 1;\n    else right = mid - 1;\n  }\n  return -1;\n}`,
      python: `def search(nums, target):\n    left, right = 0, len(nums) - 1\n    while left <= right:\n        mid = (left + right) // 2\n        if nums[mid] == target: return mid\n        elif nums[mid] < target: left = mid + 1\n        else: right = mid - 1\n    return -1`,
      cpp: `class Solution {\npublic:\n    int search(vector<int>& nums, int target) {\n        int left = 0, right = nums.size() - 1;\n        while (left <= right) {\n            int mid = left + (right - left) / 2;\n            if (nums[mid] == target) return mid;\n            if (nums[mid] < target) left = mid + 1;\n            else right = mid - 1;\n        }\n        return -1;\n    }\n};`,
      java: `class Solution {\n    public int search(int[] nums, int target) {\n        int left = 0, right = nums.length - 1;\n        while (left <= right) {\n            int mid = left + (right - left) / 2;\n            if (nums[mid] == target) return mid;\n            if (nums[mid] < target) left = mid + 1;\n            else right = mid - 1;\n        }\n        return -1;\n    }\n}`
    },
    testCases: [
      { input: '[-1,0,3,5,9,12], 9', expected: '4' },
      { input: '[-1,0,3,5,9,12], 2', expected: '-1' }
    ]
  },
  {
    id: 'code-6',
    title: 'Valid Parentheses',
    difficulty: 'Easy',
    category: 'Strings',
    solved: false,
    acceptance: '41%',
    description: 'Given a string `s` containing just the characters `(`, `)`, `{`, `}`, `[` and `]`, determine if the input string is valid. An input string is valid if: Open brackets must be closed by the same type of brackets. Open brackets must be closed in the correct order.',
    starterCode: {
      javascript: `function isValid(s) {\n  const stack = [];\n  const map = { ')': '(', '}': '{', ']': '[' };\n  for (const char of s) {\n    if ('({['.includes(char)) stack.push(char);\n    else if (stack.pop() !== map[char]) return false;\n  }\n  return stack.length === 0;\n}`,
      python: `def isValid(s: str) -> bool:\n    stack = []\n    mapping = {')': '(', '}': '{', ']': '['}\n    for char in s:\n        if char in '({[': stack.append(char)\n        elif not stack or stack.pop() != mapping[char]: return False\n    return len(stack) == 0`,
      cpp: `class Solution {\npublic:\n    bool isValid(string s) {\n        stack<char> st;\n        for (char c : s) {\n            if (c=='(' || c=='{' || c=='[') st.push(c);\n            else {\n                if (st.empty()) return false;\n                if (c==')' && st.top()!='(') return false;\n                if (c=='}' && st.top()!='{') return false;\n                if (c==']' && st.top()!='[') return false;\n                st.pop();\n            }\n        }\n        return st.empty();\n    }\n};`,
      java: `import java.util.*;\n\nclass Solution {\n    public boolean isValid(String s) {\n        Deque<Character> stack = new ArrayDeque<>();\n        for (char c : s.toCharArray()) {\n            if (c=='(' || c=='{' || c=='[') stack.push(c);\n            else {\n                if (stack.isEmpty()) return false;\n                if (c==')' && stack.peek()!='(') return false;\n                if (c=='}' && stack.peek()!='{') return false;\n                if (c==']' && stack.peek()!='[') return false;\n                stack.pop();\n            }\n        }\n        return stack.isEmpty();\n    }\n}`
    },
    testCases: [
      { input: '"()[]{}"', expected: 'true' },
      { input: '"(]"', expected: 'false' }
    ]
  },
  {
    id: 'code-7',
    title: 'Maximum Subarray',
    difficulty: 'Medium',
    category: 'Dynamic Programming',
    solved: false,
    acceptance: '50%',
    description: 'Given an integer array `nums`, find the subarray with the largest sum, and return its sum. A subarray is a contiguous non-empty sequence of elements within an array.',
    starterCode: {
      javascript: `function maxSubArray(nums) {\n  // Kadane's Algorithm\n  let maxSum = nums[0];\n  let currentSum = nums[0];\n  for (let i = 1; i < nums.length; i++) {\n    currentSum = Math.max(nums[i], currentSum + nums[i]);\n    maxSum = Math.max(maxSum, currentSum);\n  }\n  return maxSum;\n}`,
      python: `def maxSubArray(nums):\n    max_sum = current_sum = nums[0]\n    for num in nums[1:]:\n        current_sum = max(num, current_sum + num)\n        max_sum = max(max_sum, current_sum)\n    return max_sum`,
      cpp: `class Solution {\npublic:\n    int maxSubArray(vector<int>& nums) {\n        int maxSum = nums[0], curr = nums[0];\n        for (int i = 1; i < nums.size(); i++) {\n            curr = max(nums[i], curr + nums[i]);\n            maxSum = max(maxSum, curr);\n        }\n        return maxSum;\n    }\n};`,
      java: `class Solution {\n    public int maxSubArray(int[] nums) {\n        int maxSum = nums[0], curr = nums[0];\n        for (int i = 1; i < nums.length; i++) {\n            curr = Math.max(nums[i], curr + nums[i]);\n            maxSum = Math.max(maxSum, curr);\n        }\n        return maxSum;\n    }\n}`
    },
    testCases: [
      { input: '[-2,1,-3,4,-1,2,1,-5,4]', expected: '6' },
      { input: '[1]', expected: '1' }
    ]
  },
  {
    id: 'code-8',
    title: 'Climbing Stairs',
    difficulty: 'Easy',
    category: 'Dynamic Programming',
    solved: false,
    acceptance: '52%',
    description: 'You are climbing a staircase. It takes `n` steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?',
    starterCode: {
      javascript: `function climbStairs(n) {\n  // DP approach - like Fibonacci\n  if (n <= 2) return n;\n  let prev2 = 1, prev1 = 2;\n  for (let i = 3; i <= n; i++) {\n    const curr = prev1 + prev2;\n    prev2 = prev1;\n    prev1 = curr;\n  }\n  return prev1;\n}`,
      python: `def climbStairs(n: int) -> int:\n    if n <= 2: return n\n    prev2, prev1 = 1, 2\n    for _ in range(3, n + 1):\n        prev2, prev1 = prev1, prev1 + prev2\n    return prev1`,
      cpp: `class Solution {\npublic:\n    int climbStairs(int n) {\n        if (n <= 2) return n;\n        int prev2 = 1, prev1 = 2;\n        for (int i = 3; i <= n; i++) {\n            int curr = prev1 + prev2;\n            prev2 = prev1; prev1 = curr;\n        }\n        return prev1;\n    }\n};`,
      java: `class Solution {\n    public int climbStairs(int n) {\n        if (n <= 2) return n;\n        int prev2 = 1, prev1 = 2;\n        for (int i = 3; i <= n; i++) {\n            int curr = prev1 + prev2;\n            prev2 = prev1; prev1 = curr;\n        }\n        return prev1;\n    }\n}`
    },
    testCases: [
      { input: '2', expected: '2' },
      { input: '5', expected: '8' }
    ]
  }
];

// Mock Initial Aptitude Questions
const initialAptitudeQuestions = [
  {
    id: 'apt-1',
    category: 'Aptitude',
    topic: 'Probability',
    question: 'A bag contains 6 black and 8 white balls. One ball is drawn at random. What is the probability that the ball drawn is white?',
    options: ['3/7', '4/7', '1/8', '2/7'],
    answer: '4/7',
    explanation: 'Total balls = 6 + 8 = 14. Number of white balls = 8. Probability = 8/14 = 4/7.'
  },
  {
    id: 'apt-2',
    category: 'Aptitude',
    topic: 'Time and Work',
    question: 'A can do a piece of work in 10 days, and B can do it in 15 days. If they work together, how many days will they take to complete the work?',
    options: ['5 days', '6 days', '8 days', '12 days'],
    answer: '6 days',
    explanation: "A's 1 day work = 1/10. B's 1 day work = 1/15. Together = 1/10 + 1/15 = 5/30 = 1/6. Thus, 6 days."
  },
  {
    id: 'apt-3',
    category: 'Reasoning',
    topic: 'Blood Relations',
    question: "Pointing to a photograph, a man said, 'I have no brother or sister but that man's father is my father's son.' Whose photograph was it?",
    options: ['His own', 'His son\'s', 'His father\'s', 'His nephew\'s'],
    answer: "His son's",
    explanation: "Since he has no brother or sister, 'my father's son' is himself. So, the man in the photograph's father is himself. Thus, the photograph is of his son."
  },
  {
    id: 'apt-4',
    category: 'Verbal',
    topic: 'Grammar',
    question: 'Identify the correct sentence:',
    options: [
      'Each of the players have performed well.',
      'Each of the players has performed well.',
      'Every players has performed well.',
      'Each players have performed well.'
    ],
    answer: 'Each of the players has performed well.',
    explanation: "'Each' is a singular pronoun and requires a singular verb ('has')."
  }
];

// Mock Companies List
const initialCompanies = [
  {
    id: 'google',
    name: 'Google',
    role: 'Software Engineer',
    eligibility: 'CGPA > 8.0, No active backlogs',
    salary: '₹30 - ₹60 LPA',
    location: 'Bangalore, Hyderabad, Pune',
    hiringProcess: [
      { step: 'Online Assessment', desc: '2 coding questions (medium/hard) on DSA.' },
      { step: 'Technical Round 1', desc: 'Algorithms, Data Structures, Complexity analysis.' },
      { step: 'Technical Round 2', desc: 'System Design / Advanced Graph / Tree problems.' },
      { step: 'Googliness Round', desc: 'Behavioral, cultural fit, situational reasoning.' }
    ],
    codingQuestions: ['Two Sum', 'LRU Cache', 'Merge Intervals'],
    hrQuestions: [
      'Why Google?',
      'Tell me about a time you solved a complex technical bug under pressure.',
      'How do you manage disagreements in a software project development group?'
    ]
  },
  {
    id: 'amazon',
    name: 'Amazon',
    role: 'SDE-1',
    eligibility: 'CGPA > 7.5, B.Tech/M.Tech',
    salary: '₹22 - ₹45 LPA',
    location: 'Bangalore, Chennai, Gurugram',
    hiringProcess: [
      { step: 'Online Assessment', desc: 'Coding round + Leadership Principles questionnaire.' },
      { step: 'Technical Interview 1', desc: 'DSA, Arrays, Trees, Dynamic Programming.' },
      { step: 'Technical Interview 2', desc: 'System Design (for SDE-2) or OOPs & Database (SDE-1).' },
      { step: 'Bar Raiser Round', desc: 'Rigorous behavioral check aligning with Leadership Principles.' }
    ],
    codingQuestions: ['Merge Intervals', 'Longest Palindromic Substring'],
    hrQuestions: [
      'Describe a situation where you went above and beyond for a customer.',
      'How would you handle a colleague not completing their share of tasks?'
    ]
  },
  {
    id: 'tcs',
    name: 'TCS Digital/Ninja',
    role: 'Systems Engineer',
    eligibility: 'CGPA > 6.0, Max 1 backlog allowed',
    salary: '₹3.6 - ₹7.0 LPA',
    location: 'Pan India',
    hiringProcess: [
      { step: 'NQT Test', desc: 'Aptitude, Verbal, Reasoning, and 2 Basic Coding questions.' },
      { step: 'Technical Interview', desc: 'C/C++/Java basics, OOPs, SQL, Project discussions.' },
      { step: 'Managerial Round', desc: 'Scenario questions, project architecture.' },
      { step: 'HR Interview', desc: 'Salary discussion, relocation willingness, document verify.' }
    ],
    codingQuestions: ['Two Sum'],
    hrQuestions: [
      'Are you willing to relocate to any office in India?',
      'What are your career goals for the next five years?'
    ]
  }
];

export const AppStateProvider = ({ children }) => {
  // Navigation
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // User Profile
  const [userProfile, setUserProfile] = useState(() => {
    const saved = localStorage.getItem('profile');
    return saved ? JSON.parse(saved) : {
      name: 'Aniket Sharma',
      email: 'aniket.sharma@college.edu',
      targetCompany: 'Google',
      targetRole: 'Software Engineer',
      cgpa: '8.7',
      resumeScore: 78,
      solvedCount: 2
    };
  });

  // Streak Counter
  const [streak, setStreak] = useState(() => {
    const saved = localStorage.getItem('streak');
    return saved ? parseInt(saved, 10) : 5;
  });

  // Database of coding questions
  const [codingQuestions, setCodingQuestions] = useState(() => {
    const saved = localStorage.getItem('codingQuestions');
    return saved ? JSON.parse(saved) : initialCodingQuestions;
  });

  // Database of aptitude questions
  const [aptitudeQuestions, setAptitudeQuestions] = useState(() => {
    const saved = localStorage.getItem('aptitudeQuestions');
    return saved ? JSON.parse(saved) : initialAptitudeQuestions;
  });

  // Custom user submissions history
  const [submissions, setSubmissions] = useState(() => {
    const saved = localStorage.getItem('submissions');
    return saved ? JSON.parse(saved) : [
      { id: 'sub-1', problemId: 'code-1', language: 'javascript', status: 'Accepted', date: '2026-07-04 14:32', code: '// Solved' },
      { id: 'sub-2', problemId: 'code-4', language: 'python', status: 'Accepted', date: '2026-07-04 18:10', code: '# Solved' }
    ];
  });

  // Bookmarked items
  const [bookmarks, setBookmarks] = useState(() => {
    const saved = localStorage.getItem('bookmarks');
    return saved ? JSON.parse(saved) : ['code-2', 'apt-1'];
  });

  // Problem Notes
  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem('notes');
    return saved ? JSON.parse(saved) : {
      'code-1': 'Two sum can be optimized using a HashMap to O(N) time and O(N) space instead of nested loops O(N^2).'
    };
  });

  // Mock interview history
  const [interviews, setInterviews] = useState(() => {
    const saved = localStorage.getItem('interviews');
    return saved ? JSON.parse(saved) : [
      { id: 'int-1', type: 'Technical', company: 'Amazon', score: 82, grade: 'A-', date: '2026-07-03' }
    ];
  });

  // Resume text & score details
  const [resumeData, setResumeData] = useState(() => {
    const saved = localStorage.getItem('resumeData');
    return saved ? JSON.parse(saved) : {
      text: 'Aniket Sharma - Software Engineering Student\nEducation: B.Tech in Computer Science, GPA 8.7\nSkills: React, Node.js, Python, SQL, Git, Algorithms\nExperience: Web Development Intern at Tech Solutions.\nProjects: E-commerce Site, Chat Application.',
      targetJob: 'Frontend Developer React',
      score: 78,
      missingSkills: ['Redux', 'Unit Testing', 'TypeScript'],
      foundSkills: ['React', 'Node.js', 'Python', 'SQL', 'Git'],
      grammarErrors: ['Found 1 duplicate spacing error', 'Recommend active voice verbs in B.Tech descriptions']
    };
  });

  // Notifications / Toast Alerts
  const [notifications, setNotifications] = useState([
    { id: 'not-1', type: 'placement', title: 'Google Off-Campus Drive', message: 'Applications close in 3 days. Ensure your resume is ATS optimized!', time: '10m ago' },
    { id: 'not-2', type: 'contest', title: 'Weekly Contest #12', message: 'Starts today at 8:00 PM. Solve 4 DSA questions in 90 mins.', time: '2h ago' }
  ]);

  // Saving states to localStorage
  useEffect(() => {
    localStorage.setItem('profile', JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem('streak', streak.toString());
  }, [streak]);

  useEffect(() => {
    localStorage.setItem('codingQuestions', JSON.stringify(codingQuestions));
  }, [codingQuestions]);

  useEffect(() => {
    localStorage.setItem('aptitudeQuestions', JSON.stringify(aptitudeQuestions));
  }, [aptitudeQuestions]);

  useEffect(() => {
    localStorage.setItem('submissions', JSON.stringify(submissions));
  }, [submissions]);

  useEffect(() => {
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('interviews', JSON.stringify(interviews));
  }, [interviews]);

  useEffect(() => {
    localStorage.setItem('resumeData', JSON.stringify(resumeData));
  }, [resumeData]);

  // Actions
  const addNotification = (title, message, type = 'info') => {
    setNotifications(prev => [
      { id: Date.now().toString(), type, title, message, time: 'Just now' },
      ...prev
    ]);
  };

  const solveCodingQuestion = (id) => {
    setCodingQuestions(prev => prev.map(q => q.id === id ? { ...q, solved: true } : q));
    setUserProfile(prev => {
      const updated = { ...prev, solvedCount: prev.solvedCount + 1 };
      return updated;
    });
    addNotification('Task Completed!', `You solved the coding challenge.`, 'success');
  };

  const toggleBookmark = (id) => {
    setBookmarks(prev => 
      prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]
    );
  };

  const saveNote = (id, text) => {
    setNotes(prev => ({ ...prev, [id]: text }));
  };

  const recordSubmission = (problemId, language, status, code) => {
    const newSub = {
      id: 'sub-' + Date.now(),
      problemId,
      language,
      status,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      code
    };
    setSubmissions(prev => [newSub, ...prev]);
    if (status === 'Accepted') {
      solveCodingQuestion(problemId);
    } else {
      addNotification('Submission Failed', 'Check compiler diagnostics for details.', 'error');
    }
  };

  const recordInterview = (type, company, score, grade) => {
    const newInt = {
      id: 'int-' + Date.now(),
      type,
      company,
      score,
      grade,
      date: new Date().toISOString().split('T')[0]
    };
    setInterviews(prev => [newInt, ...prev]);
    addNotification('Mock Completed', `Completed ${type} Interview. Score: ${score}%`, 'success');
  };

  const updateResumeData = (text, targetJob, score, found, missing, grammar) => {
    const newResume = { text, targetJob, score, foundSkills: found, missingSkills: missing, grammarErrors: grammar };
    setResumeData(newResume);
    setUserProfile(prev => ({ ...prev, resumeScore: score }));
    addNotification('Resume Processed', `ATS Analysis score updated to ${score}%`, 'success');
  };

  const addCodingQuestion = (newQ) => {
    const qWithId = {
      ...newQ,
      id: 'code-' + (codingQuestions.length + 1),
      solved: false,
      acceptance: '50%',
      starterCode: {
        javascript: `function ${newQ.funcName || 'solution'}() {\n  // Write your code here\n  return;\n}`,
        python: `def ${newQ.funcName || 'solution'}():\n    # Write your code here\n    pass`,
        cpp: `class Solution {\npublic:\n    void ${newQ.funcName || 'solution'}() {\n        \n    }\n};`,
        java: `class Solution {\n    public void ${newQ.funcName || 'solution'}() {\n        \n    }\n}`
      }
    };
    setCodingQuestions(prev => [...prev, qWithId]);
    addNotification('Admin Dashboard', `New coding problem "${newQ.title}" created.`, 'info');
  };

  return (
    <AppStateContext.Provider value={{
      activeTab,
      setActiveTab,
      sidebarCollapsed,
      setSidebarCollapsed,
      userProfile,
      setUserProfile,
      streak,
      setStreak,
      codingQuestions,
      aptitudeQuestions,
      submissions,
      bookmarks,
      notes,
      interviews,
      resumeData,
      notifications,
      setNotifications,
      companies: initialCompanies,
      addNotification,
      solveCodingQuestion,
      toggleBookmark,
      saveNote,
      recordSubmission,
      recordInterview,
      updateResumeData,
      addCodingQuestion
    }}>
      {children}
    </AppStateContext.Provider>
  );
};
