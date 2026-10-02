import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, X, Bot, User, ArrowRight, CornerDownLeft } from 'lucide-react';
import { CurrencyConfig, StructuralZone, Material } from '../types';

interface AIAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  projectName: string;
  zones: StructuralZone[];
  materialsMap: Map<string, Material>;
  totalCostFormatted: string;
  currency: CurrencyConfig;
  selectedStyle: string;
}

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
}

const SUGGESTED_QUESTIONS = [
  'What style would suit my house?',
  'How can I reduce the cost?',
  'Which material needs less maintenance?',
  'Give me a design under ₹5 lakh.',
];

export const AIAssistantDrawer: React.FC<AIAssistantDrawerProps> = ({
  isOpen,
  onClose,
  projectName,
  zones,
  materialsMap,
  totalCostFormatted,
  currency,
  selectedStyle,
}) => {
  const totalAreaSqFt = zones.reduce((sum, z) => sum + z.netAreaSqFt, 0);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: `Hello! I've analyzed your home. The front facade has approximately ${totalAreaSqFt.toLocaleString()} sq ft of editable surface area across ${zones.length} detected surfaces. How can I help you plan your renovation today?`,
      timestamp: 'Just now',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (userText: string) => {
    if (!userText.trim() || isLoading) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          projectContext: {
            buildingType: projectName || 'Two-Storey Suburban Villa',
            totalAreaSqFt,
            totalCost: totalCostFormatted,
            currency: currency.symbol,
            selectedStyle,
            budget: `${currency.symbol}5,00,000`,
            zones: zones.map((z) => ({
              id: z.id,
              name: z.name,
              type: z.type,
              netAreaSqFt: z.netAreaSqFt,
              assignedMaterialName: z.assignedMaterialId
                ? materialsMap.get(z.assignedMaterialId)?.name
                : undefined,
            })),
          },
        }),
      });

      const data = await res.json();
      const aiReply = data.reply || "I'm ready to help you optimize your renovation finishes and cost estimates.";

      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: aiReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (err) {
      console.error('Chat error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          sender: 'ai',
          text: `For your home facade (${totalAreaSqFt} sq ft), placing stacked stone veneer on the entrance column and using elastomeric paint on the upper floor creates balanced curb appeal while keeping the budget under control.`,
          timestamp: 'Just now',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-white shadow-2xl border-l border-zinc-200 flex flex-col animate-in slide-in-from-right duration-200 select-none">
      {/* Header */}
      <div className="p-4 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-violet-600 text-white flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-violet-200" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-zinc-900">FacadeAI Assistant</h3>
            <p className="text-[10px] text-zinc-500">Architectural & Cost Advisor</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-lg transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex gap-2.5 text-xs ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {m.sender === 'ai' && (
              <div className="w-6 h-6 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center shrink-0 mt-0.5">
                <Bot className="w-3.5 h-3.5" />
              </div>
            )}
            <div
              className={`p-3 rounded-2xl max-w-[85%] leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-zinc-900 text-white rounded-tr-xs'
                  : 'bg-zinc-100/90 text-zinc-800 rounded-tl-xs whitespace-pre-wrap'
              }`}
            >
              {m.text}
              <div
                className={`text-[9px] mt-1 ${
                  m.sender === 'user' ? 'text-zinc-400 text-right' : 'text-zinc-500'
                }`}
              >
                {m.timestamp}
              </div>
            </div>
            {m.sender === 'user' && (
              <div className="w-6 h-6 rounded-full bg-zinc-200 text-zinc-700 flex items-center justify-center shrink-0 mt-0.5">
                <User className="w-3.5 h-3.5" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-2.5 text-xs">
            <div className="w-6 h-6 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center shrink-0 mt-0.5">
              <Bot className="w-3.5 h-3.5" />
            </div>
            <div className="p-3 bg-zinc-100 text-zinc-600 rounded-2xl rounded-tl-xs flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-violet-500 animate-bounce" />
              <div className="w-2 h-2 rounded-full bg-violet-500 animate-bounce [animation-delay:0.15s]" />
              <div className="w-2 h-2 rounded-full bg-violet-500 animate-bounce [animation-delay:0.3s]" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompt Pills */}
      <div className="p-3 border-t border-zinc-100 bg-zinc-50/50">
        <span className="text-[10px] text-zinc-500 font-semibold block mb-1.5 uppercase tracking-wider">
          Suggested Questions
        </span>
        <div className="flex flex-wrap gap-1.5">
          {SUGGESTED_QUESTIONS.map((q) => (
            <button
              key={q}
              onClick={() => handleSendMessage(q)}
              className="text-[11px] bg-white border border-zinc-200 hover:border-violet-300 hover:text-violet-700 text-zinc-700 px-2.5 py-1 rounded-full transition-colors text-left"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="p-3 border-t border-zinc-200 bg-white">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(inputValue);
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask about materials, budget, or styles..."
            className="flex-1 text-xs bg-zinc-100 border border-zinc-200 rounded-xl px-3 py-2 text-zinc-800 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-violet-500 focus:bg-white"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className="p-2 bg-zinc-900 text-white rounded-xl hover:bg-zinc-800 disabled:opacity-40 transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
