"use client";

import { cn } from "@CC/ui/lib/utils";
import type { HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";
import { ZenDivider } from "./ZenDivider";
import { ZenPaper } from "./ZenPaper";

type ZenCardProps = Omit<HTMLMotionProps<"section">, "children"> & {
  children: ReactNode;
  tone?: "washi" | "ink";
};

export function ZenCard({ className, children, tone = "washi", ...props }: ZenCardProps) {
  return (
    <ZenPaper tone={tone} className={cn(className)} {...props}>
      <ZenDivider className="mb-4 h-4 text-current" />
      {children}
    </ZenPaper>
  );
}
