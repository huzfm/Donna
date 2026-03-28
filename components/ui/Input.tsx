"use client";

interface InputProps {
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  type?: string;
  className?: string;
  icon?: React.ReactNode;
}

export default function Input({
  placeholder,
  value,
  onChange,
  onKeyDown,
  type = "text",
  className = "",
  icon,
}: InputProps) {
  return (
    <div className="relative">
      {icon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted">
          {icon}
        </div>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        className={`w-full border border-border rounded-lg bg-white px-4 py-2 text-sm text-primary placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all ${icon ? "pl-10" : ""} ${className}`}
      />
    </div>
  );
}
