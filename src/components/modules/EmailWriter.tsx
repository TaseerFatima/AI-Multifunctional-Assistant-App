import { useState } from 'react';
import { Send, Copy, RefreshCw, Download, Save } from 'lucide-react';
import { generateEmail } from '../../utils/mockAI';
import { useRAG } from '../../context/RAGContext';

export default function EmailWriter() {
  const [tone, setTone] = useState('professional');
  const [purpose, setPurpose] = useState('business');
  const [keyPoints, setKeyPoints] = useState('');
  const [generatedEmail, setGeneratedEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [loading, setLoading] = useState(false);
  const [savedTemplates, setSavedTemplates] = useState<string[]>([]);
  
  const { addToKnowledgeBase } = useRAG();

 const handleGenerate = async () => {
  if (!keyPoints.trim()) return;

  setLoading(true);

  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1500));

  const email = generateEmail({
    tone,
    purpose,
    keyPoints,
    subject: subject || 'Important Message'
  });

  setGeneratedEmail(email);

  // Add to knowledge base with proper typing
  addToKnowledgeBase({
    title: `${purpose} Email - ${tone} tone`,
    text: `Generated email with key points: ${keyPoints}`,
    type: 'email',
    timestamp: new Date().toLocaleString(),
    tags: [tone, purpose]  // ✅ include required tags
  });

  setLoading(false);
};


  const handleSaveTemplate = () => {
    if (generatedEmail) {
      setSavedTemplates([...savedTemplates, generatedEmail]);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedEmail);
  };

  const handleDownload = () => {
    const blob = new Blob([generatedEmail], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `email_${purpose}_${new Date().getTime()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Tone Selection */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Select Tone
        </label>
        <div className="flex gap-2 flex-wrap">
          {['Professional', 'Casual', 'Persuasive', 'Friendly', 'Formal'].map((t) => (
            <button
              key={t}
              onClick={() => setTone(t.toLowerCase())}
              className={`px-4 py-2 rounded-lg transition-colors ${
                tone === t.toLowerCase() 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Purpose & Subject */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Email Purpose
          </label>
          <select
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white"
          >
            <option value="business">Business Inquiry</option>
            <option value="job-application">Job Application</option>
            <option value="follow-up">Follow-up</option>
            <option value="thank-you">Thank You</option>
            <option value="announcement">Announcement</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Subject Line
          </label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Enter email subject"
            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white"
          />
        </div>
      </div>

      {/* Key Points Input */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Key Points / Instructions
        </label>
        <textarea
          value={keyPoints}
          onChange={(e) => setKeyPoints(e.target.value)}
          placeholder="• What is the main purpose?
• Who is the recipient?
• Any specific details to include?
• Call to action?"
          className="w-full h-40 px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 resize-none"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleGenerate}
          disabled={loading || !keyPoints.trim()}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
            loading || !keyPoints.trim()
              ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {loading ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              Generate Email
            </>
          )}
        </button>
        
        <button
          onClick={handleCopy}
          disabled={!generatedEmail}
          className="flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium disabled:opacity-50"
        >
          <Copy className="w-5 h-5" />
          Copy
        </button>
        
        <button
          onClick={handleDownload}
          disabled={!generatedEmail}
          className="flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium disabled:opacity-50"
        >
          <Download className="w-5 h-5" />
          Download
        </button>
        
        <button
          onClick={handleSaveTemplate}
          disabled={!generatedEmail}
          className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium disabled:opacity-50"
        >
          <Save className="w-5 h-5" />
          Save Template
        </button>
      </div>

      {/* Generated Email Preview */}
      {generatedEmail && (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Generated Email</h3>
            <div className="text-sm text-slate-400">
              {generatedEmail.split(' ').length} words
            </div>
          </div>
          <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">
            <div className="space-y-4">
              <div>
                <span className="text-slate-400 text-sm">Subject:</span>
                <div className="text-white font-medium mt-1">{subject || 'No Subject'}</div>
              </div>
              <div>
                <span className="text-slate-400 text-sm">Email Body:</span>
                <pre className="whitespace-pre-wrap text-slate-300 font-sans mt-2 text-sm">
                  {generatedEmail}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Saved Templates */}
      {savedTemplates.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Saved Templates</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {savedTemplates.map((template, index) => (
              <div key={index} className="bg-slate-800 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="text-sm text-slate-400">Template #{index + 1}</div>
                  <button
                    onClick={() => setGeneratedEmail(template)}
                    className="text-sm text-blue-400 hover:text-blue-300"
                  >
                    Use
                  </button>
                </div>
                <p className="text-slate-300 text-sm line-clamp-3">
                  {template.substring(0, 100)}...
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}