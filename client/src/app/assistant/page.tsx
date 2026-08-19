'use client';

import { useState } from 'react';
import { Bot, Sparkles, Send, Loader2, Brain, Plus, CheckCircle2, ArrowRight } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AIMessage } from '@/types';
import { mockInitialMessages } from '@/lib/mock-data';
import { api } from '@/lib/api';

const QUICK_PROMPTS = [
  "What should I learn next?",
  "Why is AI Engineering a good fit for me?",
  "How can I improve my Python?",
  "Give me a project to practice ML"
];

export default function AssistantPage() {
  const [messages, setMessages] = useState<AIMessage[]>(mockInitialMessages);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg: AIMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      content: query,
      timestamp: 'Just now'
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const responseMsg = await api.sendAssistantMessage(query);
      setMessages(prev => [...prev, responseMsg]);
    } catch {
      // fallback
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-8rem)]">
        {/* Main Chat Panel (2 cols) */}
        <div className="lg:col-span-2 flex flex-col h-full bg-white rounded-2xl border border-slate-200 shadow-soft overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                  CareerPath AI
                  <Badge variant="ai">Mentor Mode</Badge>
                </h2>
                <p className="text-[11px] text-slate-500">Connected to your profile & roadmap context</p>
              </div>
            </div>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
            {messages.map((m, index) => (
              <div
                key={m.id || `msg_${index}`}
                className={`flex gap-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.sender === 'assistant' && (
                  <div className="h-8 w-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 text-xs font-bold mt-1">
                    <Bot className="h-4 w-4" />
                  </div>
                )}
                <div className={`space-y-2 max-w-[85%] ${m.sender === 'user' ? 'bg-indigo-600 text-white' : 'bg-slate-50 border border-slate-100 text-slate-800'} p-4 rounded-2xl text-xs leading-relaxed`}>
                  <p className="whitespace-pre-line font-medium">{m.content}</p>

                  {/* Action Card Embedded in Response */}
                  {m.actionCard && (
                    <div className="p-3 rounded-xl bg-white border border-slate-200 text-slate-900 space-y-2 shadow-xs mt-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs">{m.actionCard.title}</span>
                        <Badge variant="success">Recommendation</Badge>
                      </div>
                      <p className="text-[11px] text-slate-500">{m.actionCard.description}</p>
                      <Button size="sm" variant="primary" className="w-full text-xs font-bold gap-1">
                        <Plus className="h-3.5 w-3.5" /> {m.actionCard.ctaText}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-xs text-slate-400 p-2">
                <Loader2 className="h-4 w-4 animate-spin text-indigo-600" />
                <span>CareerPath AI is typing...</span>
              </div>
            )}
          </div>

          {/* Prompt Chips & Input Bar */}
          <div className="p-4 border-t border-slate-100 space-y-3 bg-white">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {QUICK_PROMPTS.map((qp, index) => (
                <button
                  key={`qp_${index}_${qp}`}
                  onClick={() => handleSend(qp)}
                  className="px-3 py-1 rounded-full bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-600 text-[11px] font-semibold whitespace-nowrap transition-colors"
                >
                  {qp}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask CareerPath AI anything about your career path..."
                className="flex-1 h-11 px-4 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-600 focus:outline-none"
              />
              <Button variant="ai" size="md" onClick={() => handleSend()} disabled={loading}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Right Context Panel (1 col) */}
        <div className="hidden lg:space-y-4 lg:block">
          <Card className="p-5 bg-white border-slate-200 rounded-2xl space-y-4">
            <h3 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">Active Learner Context</h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <p className="text-slate-400 font-semibold uppercase text-[10px]">Target Role</p>
                <p className="font-extrabold text-slate-900 text-sm">AI Engineer (87% Match)</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <p className="text-slate-400 font-semibold uppercase text-[10px]">Current Roadmap Phase</p>
                <p className="font-bold text-slate-800">Phase 2: Math & Statistics (75%)</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
                <p className="text-slate-400 font-semibold uppercase text-[10px]">Active Skill Gaps</p>
                <div className="flex flex-wrap gap-1">
                  <Badge variant="warning">Python</Badge>
                  <Badge variant="warning">Statistics</Badge>
                  <Badge variant="info">PyTorch</Badge>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
