import { useState } from 'react';
import { RefreshCw, Play, Bug, Zap, ChevronRight } from 'lucide-react';
import { convertCode } from '../../utils/mockAI';
import { useRAG } from '../../context/RAGContext';

const languages = [
  { id: 'python', name: 'Python', icon: '🐍', color: 'bg-blue-500' },
  { id: 'javascript', name: 'JavaScript', icon: '🟨', color: 'bg-yellow-500' },
  { id: 'java', name: 'Java', icon: '☕', color: 'bg-red-500' },
  { id: 'cpp', name: 'C++', icon: '⚡', color: 'bg-purple-500' },
  { id: 'csharp', name: 'C#', icon: '🎯', color: 'bg-green-500' },
  { id: 'php', name: 'PHP', icon: '🐘', color: 'bg-indigo-500' },
  { id: 'ruby', name: 'Ruby', icon: '💎', color: 'bg-red-600' },
  { id: 'go', name: 'Go', icon: '🚀', color: 'bg-cyan-500' }
];

const codeSnippets = [
  { name: 'Hello World', code: 'print("Hello, World!")', lang: 'python' },
  { name: 'Function Example', code: 'def add(a, b):\n    return a + b', lang: 'python' },
  { name: 'Loop Example', code: 'for i in range(5):\n    print(i)', lang: 'python' },
  { name: 'Class Example', code: 'class Person:\n    def __init__(self, name):\n        self.name = name', lang: 'python' }
];

export default function CodeConverter() {
  const [fromLang, setFromLang] = useState('python');
  const [toLang, setToLang] = useState('javascript');
  const [inputCode, setInputCode] = useState('def hello_world():\n    print("Hello, World!")');
  const [outputCode, setOutputCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [syntaxHighlight, setSyntaxHighlight] = useState(true);
  const [showLineNumbers, setShowLineNumbers] = useState(true);
  
  const { addToKnowledgeBase } = useRAG();

  const handleConvert = async () => {
    if (!inputCode.trim()) return;
    
    setLoading(true);
    
    // Simulate conversion
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const converted = convertCode(inputCode, fromLang, toLang);
    setOutputCode(converted);
    
    // Add to knowledge base
    addToKnowledgeBase({
      title: `Code Conversion: ${fromLang} → ${toLang}`,
      text: `Original (${fromLang}):\n${inputCode}\n\nConverted (${toLang}):\n${converted}`,
      type: 'code',
      timestamp: new Date().toLocaleString(),
      tags: [fromLang, toLang, 'conversion']
    });
    
    setLoading(false);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleRunCode = () => {
    // Mock execution
    alert('Code executed in sandbox environment!');
  };

  const handleDebug = () => {
    // Mock debugging
    const issues = [
      'No syntax errors found',
      'All variables properly initialized',
      'Memory usage optimized',
      'No security vulnerabilities detected'
    ];
    alert('Debug Results:\n\n' + issues.join('\n• '));
  };

  const loadSnippet = (snippet: typeof codeSnippets[0]) => {
    setInputCode(snippet.code);
    setFromLang(snippet.lang);
  };

  return (
    <div className="space-y-6">
      {/* Language Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* From Language */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Convert From
          </label>
          <div className="grid grid-cols-4 gap-2">
            {languages.map((lang) => (
              <button
                key={lang.id}
                onClick={() => setFromLang(lang.id)}
                className={`flex flex-col items-center p-3 rounded-lg transition-all ${
                  fromLang === lang.id
                    ? `${lang.color} text-white`
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <span className="text-lg mb-1">{lang.icon}</span>
                <span className="text-xs">{lang.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* To Language */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Convert To
          </label>
          <div className="grid grid-cols-4 gap-2">
            {languages.map((lang) => (
              <button
                key={lang.id}
                onClick={() => setToLang(lang.id)}
                className={`flex flex-col items-center p-3 rounded-lg transition-all ${
                  toLang === lang.id
                    ? `${lang.color} text-white`
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <span className="text-lg mb-1">{lang.icon}</span>
                <span className="text-xs">{lang.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Code Input/Output */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Code */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-slate-300">
              Input Code ({fromLang.toUpperCase()})
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => handleCopy(inputCode)}
                className="text-xs px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded"
              >
                Copy
              </button>
              <button
                onClick={() => setInputCode('')}
                className="text-xs px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded"
              >
                Clear
              </button>
            </div>
          </div>
          <div className="relative">
            <textarea
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              className="w-full h-64 font-mono text-sm px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white resize-none"
              placeholder={`Enter ${fromLang} code here...`}
            />
            {showLineNumbers && (
              <div className="absolute left-0 top-0 bottom-0 w-8 bg-slate-800 text-slate-500 text-xs font-mono overflow-hidden rounded-l-lg border-r border-slate-700">
                {inputCode.split('\n').map((_, i) => (
                  <div key={i} className="px-1 text-right">{i + 1}</div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Output Code */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-slate-300">
              Output Code ({toLang.toUpperCase()})
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => handleCopy(outputCode)}
                disabled={!outputCode}
                className="text-xs px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded disabled:opacity-50"
              >
                Copy
              </button>
              <button
                onClick={handleRunCode}
                disabled={!outputCode}
                className="text-xs px-3 py-1 bg-green-600 hover:bg-green-700 rounded disabled:opacity-50"
              >
                Run
              </button>
            </div>
          </div>
          <div className="relative">
            <pre className={`w-full h-64 font-mono text-sm p-4 bg-slate-900 border border-slate-700 rounded-lg text-white overflow-auto ${
              syntaxHighlight ? 'syntax-highlighted' : ''
            }`}>
              {outputCode || 'Converted code will appear here...'}
            </pre>
            {showLineNumbers && outputCode && (
              <div className="absolute left-0 top-0 bottom-0 w-8 bg-slate-800 text-slate-500 text-xs font-mono overflow-hidden rounded-l-lg border-r border-slate-700">
                {outputCode.split('\n').map((_, i) => (
                  <div key={i} className="px-1 text-right">{i + 1}</div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Snippets */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Quick Snippets
        </label>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {codeSnippets.map((snippet) => (
            <button
              key={snippet.name}
              onClick={() => loadSnippet(snippet)}
              className="flex-shrink-0 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg"
            >
              {snippet.name}
            </button>
          ))}
        </div>
      </div>

      {/* Control Panel */}
      <div className="bg-slate-800 rounded-lg p-4">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="syntax"
                checked={syntaxHighlight}
                onChange={(e) => setSyntaxHighlight(e.target.checked)}
                className="rounded"
              />
              <label htmlFor="syntax" className="text-sm text-slate-300">
                Syntax Highlight
              </label>
            </div>
            
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="lineNumbers"
                checked={showLineNumbers}
                onChange={(e) => setShowLineNumbers(e.target.checked)}
                className="rounded"
              />
              <label htmlFor="lineNumbers" className="text-sm text-slate-300">
                Line Numbers
              </label>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleConvert}
              disabled={loading || !inputCode.trim()}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                loading || !inputCode.trim()
                  ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              {loading ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Converting...
                </>
              ) : (
                <>
                  <ChevronRight className="w-5 h-5" />
                  Convert Code
                </>
              )}
            </button>
            
            <button
              onClick={handleDebug}
              disabled={!outputCode}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium disabled:opacity-50"
            >
              <Bug className="w-5 h-5" />
              Debug
            </button>
            
            <button
              onClick={handleRunCode}
              disabled={!outputCode}
              className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium disabled:opacity-50"
            >
              <Play className="w-5 h-5" />
              Run
            </button>
          </div>
        </div>
      </div>

      {/* Conversion Info */}
      {outputCode && (
        <div className="bg-slate-800 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-3">
            <Zap className="w-5 h-5 text-yellow-500" />
            <h4 className="font-medium">Conversion Details</h4>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-slate-900 rounded">
              <div className="text-2xl font-bold text-green-500">
                {inputCode.split('\n').length}
              </div>
              <div className="text-sm text-slate-400">Input Lines</div>
            </div>
            <div className="text-center p-3 bg-slate-900 rounded">
              <div className="text-2xl font-bold text-blue-500">
                {outputCode.split('\n').length}
              </div>
              <div className="text-sm text-slate-400">Output Lines</div>
            </div>
            <div className="text-center p-3 bg-slate-900 rounded">
              <div className="text-2xl font-bold text-purple-500">
                {fromLang.toUpperCase()}
              </div>
              <div className="text-sm text-slate-400">Source Language</div>
            </div>
            <div className="text-center p-3 bg-slate-900 rounded">
              <div className="text-2xl font-bold text-pink-500">
                {toLang.toUpperCase()}
              </div>
              <div className="text-sm text-slate-400">Target Language</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}