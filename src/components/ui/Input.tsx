interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function Input({ label, error, id, className = "", ...rest }: InputProps) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={inputId} className="text-sm font-medium text-slate-700">
        {label}
      </label>
      <input
        id={inputId}
        className={`rounded-lg border px-3 py-2 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-primary-600/30 ${
          error ? "border-red-400" : "border-slate-200 focus:border-primary-600"
        } ${className}`}
        {...rest}
      />
      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
  );
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

export function Textarea({ label, error, id, className = "", ...rest }: TextareaProps) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={inputId} className="text-sm font-medium text-slate-700">
        {label}
      </label>
      <textarea
        id={inputId}
        className={`rounded-lg border px-3 py-2 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-primary-600/30 ${
          error ? "border-red-400" : "border-slate-200 focus:border-primary-600"
        } ${className}`}
        {...rest}
      />
      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
  );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
}

export function Select({ label, error, id, className = "", children, ...rest }: SelectProps) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={inputId} className="text-sm font-medium text-slate-700">
        {label}
      </label>
      <select
        id={inputId}
        className={`rounded-lg border px-3 py-2 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-primary-600/30 ${
          error ? "border-red-400" : "border-slate-200 focus:border-primary-600"
        } ${className}`}
        {...rest}
      >
        {children}
      </select>
      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
  );
}
