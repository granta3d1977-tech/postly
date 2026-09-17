import * as React from "react";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className = "", ...props }, ref) => <input ref={ref} className={`w-full bg-transparent outline-none placeholder:text-zinc-500 disabled:cursor-not-allowed ${className}`} {...props} />,
);
Input.displayName = "Input";
