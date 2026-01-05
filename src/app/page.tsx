import { ChatInterface } from '../components/chat/ChatInterface';
import { Github, Linkedin, Mail } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen w-full bg-[#fefcff] relative">
      {/* Dreamy Sky Pink Glow */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `
            radial-gradient(circle at 30% 70%, rgba(173, 216, 230, 0.35), transparent 60%),
            radial-gradient(circle at 70% 30%, rgba(255, 182, 193, 0.4), transparent 60%)`,
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12 md:py-16 flex flex-col items-center">
        {/* Hero Section */}
        <div className="text-center mb-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <div className="mb-6">
            <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-pink-300 to-purple-400 p-1 shadow-lg shadow-pink-200/50">
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-3xl font-bold text-purple-500">
                SD
              </div>
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-pink-500 to-rose-400 tracking-tight">
            Sena's AI Assistant
          </h1>
          <p className="text-base md:text-lg text-slate-600 max-w-xl mx-auto leading-relaxed">
            AI/ML Engineer • Software Engineer
          </p>
          <p className="text-sm text-slate-500 mb-6">
            hakkında her şeyi sorabilirsin
          </p>

          {/* Social Links */}
          <div className="flex justify-center gap-4">
            <a
              href="https://github.com/durmazsena"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-full bg-white/80 hover:bg-white border border-slate-200 text-slate-600 hover:text-purple-600 transition-all shadow-sm hover:shadow-md"
            >
              <Github size={20} />
            </a>
            <a
              href="https://www.linkedin.com/in/sena-durmaz-s01"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-full bg-white/80 hover:bg-white border border-slate-200 text-slate-600 hover:text-purple-600 transition-all shadow-sm hover:shadow-md"
            >
              <Linkedin size={20} />
            </a>
            <a
              href="mailto:durmazsenawork@gmail.com"
              className="p-3 rounded-full bg-white/80 hover:bg-white border border-slate-200 text-slate-600 hover:text-purple-600 transition-all shadow-sm hover:shadow-md"
            >
              <Mail size={20} />
            </a>
          </div>
        </div>

        {/* Chat Interface Container */}
        <div className="w-full max-w-4xl rounded-3xl overflow-hidden shadow-xl border border-white/60 backdrop-blur-xl bg-white/70 h-[550px] flex flex-col">
          <ChatInterface />
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-slate-400 text-sm flex gap-4">
          <span>Built with Next.js + LangChain</span>
          <span>•</span>
          <span>Powered by Gemini 2.0</span>
        </div>
      </div>
    </main>
  );
}
