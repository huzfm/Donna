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
                        <div className="text-muted absolute top-1/2 left-3 -translate-y-1/2">
                              {icon}
                        </div>
                  )}
                  <input
                        type={type}
                        placeholder={placeholder}
                        value={value}
                        onChange={onChange}
                        onKeyDown={onKeyDown}
                        className={`text-primary placeholder:text-muted focus:ring-accent/20 focus:border-accent w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-sm transition-all focus:ring-2 focus:outline-none ${icon ? "pl-10" : ""} ${className}`}
                  />
            </div>
      );
}
