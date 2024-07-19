"use client";

import { useContext, useEffect, useState } from "react";

import { cn } from "@/lib/utils";
import { DepContext } from "@/components/context/dep-provider";

type Props = {
  children: React.ReactNode;
  className?: string;
};

export function Container({ children, className }: Props) {
  const { refs } = useContext(DepContext);
  const [headerHeight, setHeaderHeight] = useState(0);

  useEffect(() => {
    if (refs?.header?.current) {
      setHeaderHeight(refs.header.current.offsetHeight);
    }
  }, [refs?.header]);

  return (
    <main
      style={{ marginTop: headerHeight ? `${headerHeight}px` : "10rem" }}
      className={cn("mx-auto max-w-7xl px-4 sm:px-6 lg:px-8", className)}
    >
      {children}
    </main>
  );
}
