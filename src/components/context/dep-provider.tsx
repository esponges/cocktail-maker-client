"use client";

import { createContext, useEffect, useRef } from "react";
import Dexie, { type EntityTable } from "dexie";

import { Toaster } from "../ui/toaster";

// todo: probably move this to a schema file
export type Cocktail = {
  id: string;
  name: string;
  description: string;
  steps: {
    index: string;
    description: string;
  }[];
  is_alcoholic: boolean;
  size: string;
  cost: number;
  complexity: string;
  required_ingredients: string[];
  required_tools?: string[];
  base_ingredients?: string[];
};

export const DepContext = createContext<{
  idxdb?: Dexie & {
    cocktails: EntityTable<
      Cocktail,
      "id" // primary key "id" (for the typings only)
    >;
  };
  refs?: {
    form: React.RefObject<HTMLFormElement>;
  };
  // more dependency clients can be added here
}>({});

export function DepProvider({ children }: { children: React.ReactNode }) {
  const idxdb = new Dexie("cocktail_maker") as Dexie & {
    cocktails: EntityTable<Cocktail, "id">;
  };

  idxdb.version(1).stores({
    cocktails:
      // eslint-disable-next-line max-len
      "++id, name, description, steps, is_alcoholic, mixers, size, cost, complexity, required_ingredients, required_tools, base_ingredients",
  });

  // refs for navigation
  const refs = {
    form: useRef<HTMLFormElement>(null),
  };

  // wake up server in case it's been spun down by Render.io
  useEffect(() => {
    async function wakeUpServer() {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/home/health`, {
        method: "GET",
      }).catch((err) => {
        // fire-and-forget strategy
        // don't wait for the response but catch any errors
        console.error("Error calling wakeUpServer", err);
      });
    }
    
    wakeUpServer();

    // keep server awake
    const interval = setInterval(() => {
      wakeUpServer();
    }, 1000 * 60 * 5);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Toaster />
      <DepContext.Provider value={{ idxdb, refs }}>
        {children}
      </DepContext.Provider>
    </>
  );
}
