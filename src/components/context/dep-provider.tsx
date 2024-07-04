"use client";

import { createContext, useRef } from "react";
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
  }
  // more dependency clients can be added here
}>({});

export function DepProvider({ children }: { children: React.ReactNode }) {
  const idxdb = new Dexie("cocktail_maker") as Dexie & {
    cocktails: EntityTable<Cocktail, "id">;
  };
  const refs = {
    form: useRef<HTMLFormElement>(null),
  };


  idxdb.version(1).stores({
    cocktails:
      // eslint-disable-next-line max-len
      "++id, name, description, steps, is_alcoholic, mixers, size, cost, complexity, required_ingredients, required_tools, base_ingredients",
  });

  return (
    <>
      <Toaster />
      <DepContext.Provider value={{ idxdb, refs }}>{children}</DepContext.Provider>
    </>
  );
}
