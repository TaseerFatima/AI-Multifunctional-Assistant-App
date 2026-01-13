import { motion } from "framer-motion";
import { Mail, FileText, Languages, Image as ImageIcon, Video, Music, Code, MessageSquare, BarChart, Calculator } from "lucide-react";

const features = [
  { title: "AI Email Writer", description: "Generate professional emails instantly", icon: Mail, color: "bg-blue-600" },
  { title: "PDF Summarizer", description: "Summarize or format PDFs automatically", icon: FileText, color: "bg-purple-600" },
  { title: "Language Tutor", description: "Translate and learn languages fast", icon: Languages, color: "bg-green-600" },
  { title: "Image Generator", description: "Turn text into AI images", icon: ImageIcon, color: "bg-pink-500" },
  { title: "Video Editor", description: "Edit and enhance videos easily", icon: Video, color: "bg-orange-500" },
  { title: "Audio Transcriber", description: "Convert audio to text", icon: Music, color: "bg-teal-500" },
  { title: "Code Assistant", description: "Write, debug, and optimize code", icon: Code, color: "bg-indigo-500" },
  { title: "Content Writer", description: "Generate blog & article content", icon: MessageSquare, color: "bg-red-500" },
  { title: "Data Analyzer", description: "AI-powered data insights", icon: BarChart, color: "bg-yellow-500" },
  { title: "Math Solver", description: "Solve complex math problems step by step", icon: Calculator, color: "bg-gray-500" },
];

export default function Features() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 text-white py-20 px-4 sm:px-6 lg:px-8">
      <h1 className="text-5xl font-bold text-center mb-16">Platform Features</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className="rounded-xl overflow-hidden shadow-lg hover:scale-105 transition-all duration-300"
          >
            <div className={`p-6 flex flex-col items-center justify-center space-y-4 ${feature.color} bg-opacity-20`}>
              <feature.icon className="w-12 h-12 text-white" />
              <h3 className="text-xl font-semibold text-center">{feature.title}</h3>
              <p className="text-center text-slate-300 text-sm">{feature.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
