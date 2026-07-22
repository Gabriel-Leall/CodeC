import * as React from "react";

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline";
}

export function Button({
  className = "",
  variant = "default",
  children,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none";

  const variants = {
    default: "bg-violet-600 text-white hover:bg-violet-700",
    outline: "border border-gray-300 bg-white hover:bg-gray-100",
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}