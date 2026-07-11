import { cn } from "@kodan/ui/lib/utils";
import * as React from "react";

type AlertTitleProps = Omit<React.ComponentProps<"h5">, "children"> & {
  children: React.ReactNode;
};

function AlertTitle({ className, children, ...props }: AlertTitleProps) {
  return (
    <h5
      data-slot="alert-title"
      className={cn("mb-1 font-semibold tracking-[0.04em] uppercase", className)}
      {...props}
    >
      {children}
    </h5>
  );
}

export { AlertTitle };
