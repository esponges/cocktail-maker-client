"use client";

import { createContext } from "react";
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
  mixers: string[];
  size: string;
  cost: number;
  complexity: string;
  required_ingredients: string[];
  required_tools?: string[];
};

export const DepContext = createContext<{
  idxdb?: Dexie & {
    cocktails: EntityTable<
      Cocktail,
      "id" // primary key "id" (for the typings only)
    >;
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
      "++id, name, description, steps, is_alcoholic, mixers, size, cost, complexity, required_ingredients, required_tools",
  });

  return (
    <>
      <Toaster />
      <DepContext.Provider value={{ idxdb }}>{children}</DepContext.Provider>
    </>
  );
}
