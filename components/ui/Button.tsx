"use client";

import { motion } from "framer-motion";

interface ButtonProps {
      variant?: "primary" | "ghost" | "destructive";
      size?: "sm" | "md" | "lg";
      children: React.ReactNode;
      className?: string;
      onClick?: () => void;
      disabled?: boolean;
      type?: "button" | "submit";
}

export default function Button({
      variant = "primary",
      size = "md",
      className = "",
      children,
      onClick,
      disabled,
      type = "button",
}: ButtonProps) {
      const base =
            "inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-accent/20 disabled:opacity-50 disabled:cursor-not-allowed";

      const variants: Record<string, string> = {
            primary: "bg-accent text-white hover:bg-accent-hover rounded-lg",
            ghost: "bg-transparent text-accent hover:bg-accent-light rounded-lg",
            destructive: "bg-destructive text-white hover:opacity-90 rounded-lg",
      };

      const sizes: Record<string, string> = {
            sm: "px-3 py-1.5 text-sm",
            md: "px-4 py-2 text-sm",
            lg: "px-6 py-3 text-base",
      };

      return (
            <motion.button
                  type={type}
                  onClick={onClick}
                  disabled={disabled}
                  className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
                  whileTap={{ scale: 0.97 }}
            >
                  {children}
            </motion.button>
      );
}
