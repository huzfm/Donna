"use client";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "destructive";
  className?: string;
}

export default function Badge({
  children,
  variant = "default",
  className = "",
}: BadgeProps) {
  const variants: Record<string, string> = {
    default: "bg-surface-2 text-secondary",
    success: "bg-accent-light text-accent",
    warning: "bg-amber-50 text-warning",
    destructive: "bg-red-50 text-destructive",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
