import ToolCard from "../components/ToolCard";
import {
  Mail,
  FileText,
  Languages,
  Image as ImageIcon,
  Video,
  Music,
  Code,
  MessageSquare,
  BarChart,
  Calculator,
} from "lucide-react";
import { motion } from "framer-motion";

const tools = [
  {
    title: "Email Writer",
    description: "Generate professional emails with AI assistance",
    icon: Mail,
    path: "/tool/email-writer",
  },
  {
    title: "PDF Summarizer",
    description: "Create and format PDF documents automatically",
    icon: FileText,
   path: "/tool/pdf-summarizer"
  },
  {
    title: "Language Tutor",
    description: "Translate text between multiple languages instantly",
    icon: Languages,
    path: "/tool/language-tutor",
  },
    {
    title: "Code Convertor",
    description: "Get help writing and debugging code in any language",
    icon: Code,
     path: "/tool/code-converter"
  },
  {
    title: "Image Generator",
    description: "Create stunning images from text descriptions",
    icon: ImageIcon,
   path: "/tool/image-generator" },
  {
    title: "Video Editor",
    description: "Edit and enhance videos with AI-powered tools",
    icon: Video,
     path: "/tool/video-editor"
  },
  {
    title: "Audio Transcriber",
    description: "Convert audio files to accurate text transcriptions",
    icon: Music,
    path: "/tool/audio-transcriber",
  },
  {
    title: "Content Writer",
    description: "Generate engaging content for blogs and articles",
    icon: MessageSquare,
    path: "/tool/content-writer",
  },
  {
    title: "Data Analyzer",
    description: "Analyze and visualize your data with AI insights",
    icon: BarChart,
    path: "/tool/data-analyzer",
  },
  {
    title: "Math Solver",
    description: "Solve complex mathematical problems step by step",
    icon: Calculator,
    path: "/tool/math-solver",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
    

      {/* ================= HERO SECTION ================= */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 py-24 sm:py-28">
        {/* Animated Particle Background */}
        <div className="absolute inset-0 opacity-10 bg-[url('/grid.svg')] animate-pulse"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-sm uppercase tracking-widest text-blue-400 mb-4"
          >
            One Platform · Multiple AI Tools
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
          >
            AI-Powered Multi-Functional
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 animate-gradient-x">
              Web Assistant
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-xl text-slate-400 max-w-3xl mx-auto mb-10"
          >
            A unified AI-driven platform designed to enhance productivity,
            learning, creativity, and development — all in one place.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <a
              href="#tools"
              className="px-8 py-4 rounded-lg font-semibold text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-blue-500/40 transition-all transform hover:scale-105"
            >
              Explore Tools
            </a>

            <a
              href="#learn-more"
              className="px-8 py-4 rounded-lg font-semibold text-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors transform hover:scale-105"
            >
              Learn More
            </a>
          </motion.div>
        </div>
      </section>

      {/* ================= TOOLS SECTION ================= */}
      <section
        id="tools"
        className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl font-bold mb-4"
          >
            Our AI Tools
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-slate-400 text-lg max-w-2xl mx-auto"
          >
            9+ intelligent AI-powered modules designed to support writing,
            learning, coding, creativity, and data analysis.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {tools.map((tool, index) => (
            <motion.div
              key={tool.path}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <ToolCard
                title={tool.title}
                description={tool.description}
                icon={tool.icon}
                path={tool.path}
                className="transform transition-all hover:scale-105 hover:shadow-xl hover:shadow-purple-500/30"
              />
            </motion.div>
          ))}
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="bg-slate-900 border-t border-slate-800 py-10 mt-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-slate-400">
            © 2024 AI Assistant. All rights reserved.
          </p>
          <p className="text-slate-500 text-sm mt-2">
            Final Year Project · BS Computer Science
          </p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="mt-4 px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 transition-all"
          >
            Scroll to Top
          </button>
        </div>
      </footer>
    </div>
  );
}
