import { useState, useRef } from 'react';
import { Upload, FileText, Download, Eye, Trash2, BarChart3, Clock, FileUp } from 'lucide-react';
import { summarizePDF } from '../../utils/mockAI';
import { useRAG } from '../../context/RAGContext';

interface UploadedFile {
  id: string;
  file: File;
  summary: string;
  summaryLength: string;
  timestamp: Date;
}

export default function PdfSummarizer() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [activeFile, setActiveFile] = useState<UploadedFile | null>(null);
  const [summaryLength, setSummaryLength] = useState('medium');
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { addToKnowledgeBase } = useRAG();

  // Handle uploaded files sequentially
  const handleFileUpload = async (files: FileList) => {
    setLoading(true);

    for (const file of Array.from(files)) {
      // Relaxed PDF check for cross-browser support
      if (file.type === 'application/pdf' || file.type === 'application/x-pdf') {
        try {
          // Read PDF content if you want real summaries (optional)
          // const fileText = await file.text();
          // const summary = await summarizePDF(fileText, summaryLength);

          // For mock demo, we just use the filename
          const summary = await summarizePDF(file.name, summaryLength);

          const newFile: UploadedFile = {
            id: Math.random().toString(36).substr(2, 9),
            file,
            summary,
            summaryLength,
            timestamp: new Date(),
          };

          setUploadedFiles(prev => [...prev, newFile]);
          setActiveFile(newFile);

          // Add to RAG knowledge base
          addToKnowledgeBase({
            title: `PDF Summary: ${file.name}`,
            text: summary,
            type: 'pdf',
            timestamp: new Date().toLocaleString(),
            tags: [summaryLength, file.name],
          });
        } catch (err) {
          console.error('Error summarizing PDF:', file.name, err);
        }
      }
    }

    setLoading(false);
  };

  // Drag & drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  const removeFile = (id: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== id));
    if (activeFile?.id === id) setActiveFile(null);
  };

  const downloadSummary = (file: UploadedFile) => {
    const blob = new Blob([file.summary], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `summary_${file.file.name.replace('.pdf', '')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
          isDragging ? 'border-blue-500 bg-blue-500/10' : 'border-slate-700 hover:border-slate-600'
        }`}
      >
        {loading ? (
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-slate-300">Processing PDF...</p>
          </div>
        ) : (
          <>
            <Upload className="w-12 h-12 text-slate-500 mx-auto mb-4" />
            <p className="text-slate-300 mb-2">
              Drag & drop PDF files here, or click to browse
            </p>
            <p className="text-sm text-slate-500">Supports PDF files up to 10MB</p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
              className="hidden"
              multiple
            />
          </>
        )}
      </div>

      {/* Summary Length Options */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Summary Length
        </label>
        <div className="flex gap-2">
          {[
            { id: 'short', label: 'Brief (2-3 sentences)', icon: '📝' },
            { id: 'medium', label: 'Standard (paragraph)', icon: '📄' },
            { id: 'detailed', label: 'Detailed (full analysis)', icon: '📊' },
          ].map(({ id, label, icon }) => (
            <button
              key={id}
              onClick={() => setSummaryLength(id)}
              className={`flex-1 flex flex-col items-center px-4 py-3 rounded-lg transition-colors border ${
                summaryLength === id
                  ? 'bg-purple-600/20 border-purple-500 text-purple-300'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <span className="text-lg mb-1">{icon}</span>
              <span className="text-sm">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Uploaded Files</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {uploadedFiles.map((file) => (
              <div
                key={file.id}
                className={`bg-slate-800 border rounded-lg p-4 transition-colors cursor-pointer ${
                  activeFile?.id === file.id
                    ? 'border-purple-500'
                    : 'border-slate-700 hover:border-slate-600'
                }`}
                onClick={() => setActiveFile(file)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <FileText className="w-10 h-10 text-purple-500 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-white truncate">{file.file.name}</h4>
                      <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                        <span>{(file.file.size / 1024).toFixed(1)} KB</span>
                        <span>•</span>
                        <span>{file.summaryLength}</span>
                        <span>•</span>
                        <span>
                          {file.timestamp.toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(file.id);
                    }}
                    className="text-slate-500 hover:text-red-400"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Summary Display */}
      {activeFile && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Summary</h3>
            <button
              onClick={() => downloadSummary(activeFile)}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
          </div>

          <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 bg-purple-500/20 rounded-lg">
                <FileText className="w-8 h-8 text-purple-500" />
              </div>
              <div>
                <h4 className="font-medium text-white text-lg">{activeFile.file.name}</h4>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1 text-sm text-slate-400">
                    <BarChart3 className="w-4 h-4" />
                    {activeFile.summaryLength} summary
                  </div>
                  <div className="flex items-center gap-1 text-sm text-slate-400">
                    <Clock className="w-4 h-4" />
                    {activeFile.timestamp.toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-slate-800 rounded-lg">
                <h5 className="font-medium text-slate-300 mb-2 flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  Summary Preview
                </h5>
                <p className="text-slate-300 text-sm">
                  {activeFile.summary.substring(0, 200)}...
                  {activeFile.summary.length > 200 && (
                    <button className="text-blue-400 hover:text-blue-300 ml-2">
                      Show more
                    </button>
                  )}
                </p>
              </div>

              <div>
                <h5 className="font-medium text-slate-300 mb-2">Full Summary</h5>
                <div className="bg-slate-950 border border-slate-700 rounded-lg p-4">
                  <pre className="whitespace-pre-wrap text-slate-300 text-sm leading-relaxed">
                    {activeFile.summary}
                  </pre>
                </div>
              </div>
            </div>

            {/* Key Points */}
            <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <h5 className="font-medium text-blue-300 mb-2">Key Insights</h5>
              <ul className="text-sm text-slate-300 space-y-1">
                <li>• Main topic identified and summarized</li>
                <li>• Key arguments extracted</li>
                <li>• Important statistics highlighted</li>
                <li>• Conclusion summarized</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {uploadedFiles.length === 0 && !loading && (
        <div className="text-center py-12">
          <FileUp className="w-16 h-16 text-slate-700 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-400 mb-2">No PDFs Uploaded</h3>
          <p className="text-slate-600">Upload a PDF to get started with AI-powered summarization</p>
        </div>
      )}
    </div>
  );
}
