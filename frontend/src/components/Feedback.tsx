import { AlertCircle, CheckCircle2, Info } from 'lucide-react';

interface FeedbackProps {
  type: 'error' | 'success' | 'info';
  message: string;
}

const styles = {
  error: {
    container: 'border-red-200 bg-red-50 text-red-800',
    icon: 'text-red-600',
    Icon: AlertCircle,
  },
  success: {
    container: 'border-emerald-200 bg-emerald-50 text-emerald-800',
    icon: 'text-emerald-600',
    Icon: CheckCircle2,
  },
  info: {
    container: 'border-sky-200 bg-sky-50 text-sky-800',
    icon: 'text-sky-600',
    Icon: Info,
  },
};

export function Feedback({ type, message }: FeedbackProps) {
  const { Icon, container, icon } = styles[type];

  return (
    <div
      className={`flex items-start gap-2 rounded-md border px-3 py-2.5 text-sm leading-5 shadow-sm ${container}`}
      role={type === 'error' ? 'alert' : 'status'}
      aria-live={type === 'error' ? 'assertive' : 'polite'}
    >
      <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${icon}`} aria-hidden="true" />
      <span>{message}</span>
    </div>
  );
}
