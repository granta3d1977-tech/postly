import * as React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "secondary" | "outline" | "ghost";
  size?: "default" | "sm" | "icon";
};

const variants = {
  default: "bg-violet-500 text-white shadow-[0_12px_32px_rgba(139,92,246,.28)] hover:bg-violet-400",
  secondary: "bg-zinc-100 text-zinc-950 hover:bg-white",
  outline: "border border-zinc-200 bg-white text-zinc-900 hover:bg-zinc-50",
  ghost: "text-zinc-300 hover:bg-white/10 hover:text-white",
};
const sizes = { default: "h-11 px-5", sm: "h-9 px-3.5 text-sm", icon: "size-10" };

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "default", size = "default", type = "button", ...props }, ref) => (
    <button ref={ref} type={type} className={`inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className}`} {...props} />
  ),
);
Button.displayName = "Button";
