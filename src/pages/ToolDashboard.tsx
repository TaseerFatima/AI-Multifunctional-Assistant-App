import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, History, Settings,FileText, Code, Languages, Mail, Sparkles, Brain, Zap, ImageIcon } from 'lucide-react';
import EmailWriter from '../components/modules/EmailWriter';
import PDFSummarizer from '../components/modules/PdfSummarizer';
import { useRAG } from '../context/RAGContext';
import LanguageTutor from '../components/modules/LanguageTutor';
import CodeConverter from '../components/modules/CodeConvertor';
import ImageGenerator from '../components/modules/image-generator';
// In ToolDashboard.tsx, update the moduleComponents mapping:
const moduleComponents: Record<string, React.ComponentType> = {
  'email-writer': EmailWriter,
  'pdf-summarizer': PDFSummarizer,
  'code-converter': CodeConverter,
  'language-tutor': LanguageTutor,
  'image-generator': ImageGenerator,
  
};

const moduleIcons: Record<string, React.ReactNode> = {
  'email-writer': <Mail className="w-6 h-6" />,
  'pdf-summarizer': <FileText className="w-6 h-6" />,
  'code-converter': <Code className="w-6 h-6" />,
  'language-tutor': <Languages className="w-6 h-6" />,
  'image-generator': <ImageIcon className="w-6 h-6" />,
};

const moduleColors: Record<string, string> = {
  'email-writer': 'bg-blue-500',
  'pdf-summarizer': 'bg-purple-500',
  'code-converter': 'bg-green-500',
  'language-tutor': 'bg-pink-500',
  'image-generator': 'bg-yellow-500',
};

export default function ToolDashboard() {
  const { toolName } = useParams<{ toolName: string }>();
  const [activeTab, setActiveTab] = useState('generate');
  const { knowledgeBase, searchKnowledgeBase } = useRAG();
  
  const ModuleComponent = moduleComponents[toolName || ''] || DefaultModule;
  const moduleIcon = toolName ? moduleIcons[toolName] : <Sparkles className="w-6 h-6" />;
  const moduleColor = toolName ? moduleColors[toolName] : 'bg-slate-600';

  const toolTitle = toolName
    ?.split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  // Search in knowledge base
  const relatedKnowledge = toolName ? searchKnowledgeBase(toolTitle || '') : [];

  return (
    <div className="min-h-screen bg-slate-950 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col">
        <div className="p-6">
          <Link
            to="/"
            className="flex items-center space-x-2 text-slate-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Home</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <button
            onClick={() => setActiveTab('generate')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'generate'
                ? 'bg-slate-800 text-white'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Zap className="w-5 h-5" />
            <span>Generate</span>
          </button>
          
          <button
            onClick={() => setActiveTab('history')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'history'
                ? 'bg-slate-800 text-white'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <History className="w-5 h-5" />
            <span>History</span>
          </button>
          
          <button
            onClick={() => setActiveTab('knowledge')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'knowledge'
                ? 'bg-slate-800 text-white'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Brain className="w-5 h-5" />
            <span>Knowledge Base</span>
            {relatedKnowledge.length > 0 && (
              <span className="ml-auto bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                {relatedKnowledge.length}
              </span>
            )}
          </button>
          
          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'settings'
                ? 'bg-slate-800 text-white'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </button>
        </nav>

        {/* Knowledge Base Stats */}
        <div className="p-4 border-t border-slate-800">
          <div className="text-sm text-slate-400 mb-2">Knowledge Base</div>
          <div className="flex items-center justify-between">
            <div className="text-xs text-slate-500">{knowledgeBase.length} items</div>
            <div className={`w-3 h-3 rounded-full ${moduleColor}`}></div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-5xl mx-auto p-6 lg:p-8">
          {/* Header */}
          <header className="mb-8">
            <div className="flex items-center gap-4 mb-2">
              <div className={`p-3 rounded-xl ${moduleColor} bg-opacity-20`}>
                {moduleIcon}
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white">{toolTitle}</h1>
                <p className="text-slate-400">
                  AI-powered {toolTitle?.toLowerCase()} with RAG-enhanced intelligence
                </p>
              </div>
            </div>
            
            {/* Tabs */}
            <div className="flex border-b border-slate-800 mt-6">
              {['generate', 'history', 'knowledge', 'settings'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 font-medium text-sm transition-colors ${
                    activeTab === tab
                      ? 'text-white border-b-2 border-blue-500'
                      : 'text-slate-400 hover:text-slate-300'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </header>

          {/* Content based on active tab */}
          {activeTab === 'generate' && <ModuleComponent />}
          
          {activeTab === 'history' && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Generation History</h2>
              <div className="text-center py-12">
                <History className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                <p className="text-slate-500">No history yet. Start generating to see your activity here.</p>
              </div>
            </div>
          )}
          
          {activeTab === 'knowledge' && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Knowledge Base</h2>
              {relatedKnowledge.length > 0 ? (
                <div className="space-y-4">
                  {relatedKnowledge.map((item, index) => (
                    <div key={index} className="bg-slate-800 rounded-lg p-4">
                      <h3 className="font-medium text-white mb-2">{item.title}</h3>
                      <p className="text-slate-300 text-sm">{item.text.substring(0, 150)}...</p>
                      <div className="text-xs text-slate-500 mt-2">
                        Added {item.timestamp}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Brain className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                  <p className="text-slate-500">No related knowledge found. Upload files to build your knowledge base.</p>
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'settings' && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Module Settings</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    AI Model
                  </label>
                  <select className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white">
                    <option>GPT-4 (Recommended)</option>
                    <option>Claude</option>
                    <option>Gemini</option>
                    <option>Llama</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Output Quality
                  </label>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-slate-400">Fast</span>
                    <input type="range" min="1" max="3" defaultValue="2" className="flex-1" />
                    <span className="text-sm text-slate-400">High Quality</span>
                  </div>
                </div>
                
                <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium">
                  Save Settings
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

const DefaultModule = () => (
  <div className="text-center py-12">
    <Sparkles className="w-16 h-16 text-slate-700 mx-auto mb-4" />
    <h2 className="text-2xl text-slate-400 mb-2">Module Coming Soon!</h2>
    <p className="text-slate-600">This module is under development.</p>
  </div>
);