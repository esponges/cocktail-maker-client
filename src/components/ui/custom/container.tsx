"use client";

import { cn } from "@/lib/utils";
import { useHeaderHeight } from "@/lib/hooks/misc";

type Props = {
  children: React.ReactNode;
  className?: string;
  offsetHeader?: boolean;
};

export function Container({ children, className, offsetHeader = true }: Props) {
  const { headerHeight } = useHeaderHeight();

  return (
    <main
      style={{
        marginTop: headerHeight && offsetHeader ? `${headerHeight}px` : "",
      }}
      className={cn("mx-auto max-w-7xl px-4 sm:px-6 lg:px-8", className)}
    >
      {children}
    </main>
  );
}
