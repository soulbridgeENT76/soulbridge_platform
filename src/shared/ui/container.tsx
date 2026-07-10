import type { ElementType, ReactNode } from "react";
import { cn } from "@shared/lib/cn";

type ContainerProps = {
  as?: ElementType;
  className?: string;
  children: ReactNode;
};

/** Centered content column that spreads wide on large screens. */
export function Container({ as: Tag = "div", className, children }: ContainerProps) {
  return (
    <Tag
      className={cn(
        "mx-auto w-full max-w-[1800px] px-6 md:px-12 lg:px-20 2xl:px-28",
        className
      )}
    >
      {children}
    </Tag>
  );
}
