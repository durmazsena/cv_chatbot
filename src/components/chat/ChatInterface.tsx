'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, User, Loader2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

const quickActions = [
    "Projelerin neler?",
    "Teknik yeteneklerin neler?",
    "İş deneyiminden bahset",
    "İletişim bilgileri"
];

export const ChatInterface = () => {
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: 'Merhaba! 👋 Ben Sena\'nın yapay zeka asistanıyım. Sena\'nın projeleri, deneyimleri veya teknik becerileri hakkında sorular sorabilirsin!' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [typingContent, setTypingContent] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, typingContent]);

    const typeText = async (text: string) => {
        let displayed = '';
        for (let i = 0; i < text.length; i++) {
            displayed += text[i];
            setTypingContent(displayed);
            // 8ms per character for smooth typing effect
            await new Promise(r => setTimeout(r, 8));
        }
        return text;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;
        await sendMessage(input);
    };

    const sendMessage = async (text: string) => {
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: text }]);
        setIsLoading(true);
        setTypingContent('');

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: messages,
                    userMessage: text
                }),
            });

            const data = await response.json();

            if (data.response) {
                // Type out the response character by character
                await typeText(data.response);
                // After typing complete, add to messages
                setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
                setTypingContent('');
            } else if (data.error) {
                setMessages(prev => [...prev, { role: 'assistant', content: 'Üzgünüm, bir hata oluştu: ' + data.details }]);
            }
        } catch (error) {
            console.error('Chat Error:', error);
            setMessages(prev => [...prev, { role: 'assistant', content: 'Üzgünüm, bir hata oluştu. Lütfen tekrar dene.' }]);
        } finally {
            setIsLoading(false);
            setTypingContent('');
        }
    };

    return (
        <div className="flex flex-col h-full">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 scroll-smooth" ref={scrollRef}>
                <div className="space-y-5">
                    <AnimatePresence>
                        {messages.map((m, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`flex max-w-[85%] gap-3 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                    <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 shadow-sm ${m.role === 'user'
                                        ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white'
                                        : 'bg-gradient-to-br from-pink-100 to-purple-100 text-purple-600'
                                        }`}>
                                        {m.role === 'user' ? <User size={16} /> : <Sparkles size={16} />}
                                    </div>
                                    <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${m.role === 'user'
                                        ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-tr-sm'
                                        : 'bg-white text-slate-700 border border-slate-100 rounded-tl-sm'
                                        }`}>
                                        {m.role === 'assistant' ? (
                                            <ReactMarkdown
                                                components={{
                                                    a: ({ href, children }) => (
                                                        <a
                                                            href={href}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-purple-600 hover:text-purple-500 underline underline-offset-2 transition-colors font-medium"
                                                        >
                                                            {children}
                                                        </a>
                                                    ),
                                                    p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                                                    ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>,
                                                    ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>,
                                                    li: ({ children }) => <li>{children}</li>,
                                                    strong: ({ children }) => <strong className="font-semibold text-purple-700">{children}</strong>,
                                                    h1: ({ children }) => <h1 className="text-lg font-bold mb-2 text-purple-800">{children}</h1>,
                                                    h2: ({ children }) => <h2 className="text-base font-bold mb-2 text-purple-700">{children}</h2>,
                                                    h3: ({ children }) => <h3 className="text-sm font-bold mb-1 text-purple-600">{children}</h3>,
                                                }}
                                            >
                                                {m.content}
                                            </ReactMarkdown>
                                        ) : (
                                            m.content
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {/* Typing animation */}
                    {typingContent && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex justify-start"
                        >
                            <div className="flex max-w-[85%] gap-3">
                                <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 shadow-sm bg-gradient-to-br from-pink-100 to-purple-100 text-purple-600">
                                    <Sparkles size={16} />
                                </div>
                                <div className="p-4 rounded-2xl text-sm leading-relaxed shadow-sm bg-white text-slate-700 border border-slate-100 rounded-tl-sm">
                                    <ReactMarkdown
                                        components={{
                                            a: ({ href, children }) => (
                                                <a href={href} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:text-purple-500 underline underline-offset-2 transition-colors font-medium">
                                                    {children}
                                                </a>
                                            ),
                                            p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                                            strong: ({ children }) => <strong className="font-semibold text-purple-700">{children}</strong>,
                                        }}
                                    >
                                        {typingContent}
                                    </ReactMarkdown>
                                    <span className="inline-block w-1 h-4 bg-purple-500 animate-pulse ml-0.5" />
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {isLoading && !typingContent && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex justify-start items-center gap-2 text-purple-400 text-xs ml-12"
                        >
                            <Loader2 size={14} className="animate-spin" />
                            <span>Düşünüyorum...</span>
                        </motion.div>
                    )}

                    {/* Quick Actions */}
                    {messages.length === 1 && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="flex flex-wrap gap-2 mt-4"
                        >
                            {quickActions.map((action, i) => (
                                <button
                                    key={i}
                                    onClick={() => sendMessage(action)}
                                    className="px-4 py-2 text-sm bg-white hover:bg-purple-50 text-purple-600 border border-purple-200 rounded-full transition-all hover:border-purple-300 hover:shadow-sm"
                                >
                                    {action}
                                </button>
                            ))}
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-slate-100 bg-white/50">
                <form onSubmit={handleSubmit} className="flex gap-3">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Sena hakkında bir şey sor..."
                        className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-300 transition-all placeholder:text-slate-400"
                    />
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 text-white px-5 py-3 rounded-xl transition-all shadow-md hover:shadow-lg"
                    >
                        <Send size={18} />
                    </button>
                </form>
            </div>
        </div>
    );
};
