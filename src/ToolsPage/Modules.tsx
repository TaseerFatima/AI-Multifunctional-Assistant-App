import ToolCard from "../components/ToolCard";
import { motion } from "framer-motion";
import { 
  Mail, FileText, Languages, Image as ImageIcon, Video, Music, 
  Code, MessageSquare, BarChart, Calculator, Brain, Cpu, Zap, 
  Database, Shield, Palette, FileCode,  
} from "lucide-react";

const modules = [
  { title: "Email Writer", description: "Compose professional emails with AI assistance", icon: Mail, path: "/tool/email-writer" },
  { title: "PDF Summarizer", description: "Extract key insights from PDF documents", icon: FileText, path: "/tool/pdf-summarizer" },
  { title: "Language Tutor", description: "Learn and translate multiple languages", icon: Languages, path: "/tool/language-tutor" },
  { title: "Code Converter", description: "Convert code between programming languages", icon: Code, path: "/tool/code-converter" },
 { title: "Image Generator", description: "Create stunning images from text descriptions", icon: ImageIcon, path: "/tool/image-generator" },
  { title: "Video Editor", description: "Edit videos with AI-powered tools", icon: Video, path: "/tool/video-editor" },
  { title: "Audio Transcriber", description: "Convert audio to accurate text transcriptions", icon: Music, path: "/tool/audio-transcriber" },
  { title: "Content Writer", description: "Generate engaging content for blogs and articles", icon: MessageSquare, path: "/tool/content-writer" },
  { title: "Data Analyzer", description: "Analyze and visualize data with AI insights", icon: BarChart, path: "/tool/data-analyzer" },
  { title: "Math Solver", description: "Solve complex mathematical problems step by step", icon: Calculator, path: "/tool/math-solver" },
  { title: "AI Chat Assistant", description: "Get intelligent responses to your questions", icon: Brain, path: "/tool/chat-assistant" },
  { title: "Code Debugger", description: "Find and fix bugs in your code", icon: Cpu, path: "/tool/code-debugger" },
  { title: "Data Generator", description: "Generate synthetic data for testing", icon: Database, path: "/tool/data-generator" },
  { title: "Security Analyzer", description: "Analyze code for security vulnerabilities", icon: Shield, path: "/tool/security-analyzer" },
  { title: "Design Assistant", description: "Get design suggestions and templates", icon: Palette, path: "/tool/design-assistant" },
  { title: "Document Generator", description: "Create professional documents automatically", icon: FileCode, path: "/tool/document-generator" },
];

export default function Modules() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 text-white py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold mb-4">AI Modules Collection</h1>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            Explore our comprehensive suite of AI-powered tools designed to enhance productivity, creativity, and learning.
            Each module features RAG-enhanced intelligence for better results.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {modules.map((module, index) => (
            <motion.div
              key={module.path}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.5 }}
            >
              <ToolCard
                title={module.title}
                description={module.description}
                icon={module.icon}
                path={module.path}
                className="transform transition-all hover:scale-105 hover:shadow-xl hover:shadow-blue-500/20"
              />
            </motion.div>
          ))}
        </div>

        {/* RAG Enhanced Badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full">
            <Zap className="w-5 h-5" />
            <span className="font-semibold">All modules feature RAG-enhanced intelligence</span>
          </div>
          <p className="text-slate-400 mt-4 max-w-2xl mx-auto">
            RAG (Retrieval-Augmented Generation) allows our AI to access and learn from your uploaded documents,
            providing more accurate and context-aware responses across all modules.
          </p>
        </motion.div>
      </div>
    </div>
  );
}