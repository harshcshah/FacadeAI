import React from 'react';
import { CheckCircle2, Sparkles, AlertCircle, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type?: 'success' | 'ai' | 'info';
  title: string;
  description?: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none max-w-sm">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto flex items-start gap-3 bg-zinc-900 text-white px-4 py-3 rounded-xl shadow-xl shadow-zinc-950/20 border border-zinc-800 animate-in slide-in-from-bottom-2 fade-in duration-200"
        >
          {toast.type === 'ai' ? (
            <Sparkles className="w-5 h-5 text-violet-400 shrink-0 mt-0.5" />
          ) : toast.type === 'info' ? (
            <AlertCircle className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          )}

          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold tracking-wide text-zinc-100">{toast.title}</p>
            {toast.description && (
              <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">{toast.description}</p>
            )}
          </div>

          <button
            onClick={() => onDismiss(toast.id)}
            className="text-zinc-500 hover:text-zinc-300 p-0.5 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
