import { cn } from "@kodan/ui/lib/utils";
import * as React from "react";

type AlertDescriptionProps = Omit<React.ComponentProps<"div">, "children"> & {
  children: React.ReactNode;
};

function AlertDescription({ className, children, ...props }: AlertDescriptionProps) {
  return (
    <div
      data-slot="alert-description"
      className={cn("text-[11px] leading-relaxed opacity-95 [&_p]:leading-relaxed", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export { AlertDescription };
