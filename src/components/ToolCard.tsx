import { Link } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';

interface ToolCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  path: string;
}

export default function ToolCard({ title, description, icon: Icon, path }: ToolCardProps) {
  return (
    <Link
      to={path}
      className="w-full group bg-slate-800 border border-slate-700 rounded-xl p-6 flex flex-col justify-between hover:border-blue-500 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 hover:-translate-y-1"
    >
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="p-4 bg-slate-900 rounded-lg group-hover:bg-blue-600 transition-colors duration-300">
          <Icon className="w-10 h-10 text-blue-500 group-hover:text-white transition-colors duration-300" />
        </div>
        <h3 className="text-xl font-semibold text-white">{title}</h3>
        <p className="text-slate-400 text-sm">{description}</p>
      </div>
    </Link>
  );
}
