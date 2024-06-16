"use client";

import { createContext } from "react";
import Dexie, { type EntityTable } from "dexie";

// todo: probably move this to a schema file
export type Cocktail = {
  id: string;
  name: string;
  description: string;
  steps: {
    index: number;
    description: string;
  }[];
  is_alcoholic: boolean;
  mixers: string[];
  size: string;
  cost: number;
  complexity: string;
  required_ingredients: string[];
  required_tools: string[];
};

export const DepContext = createContext<{
  idxdb?: Dexie & {
    cocktails: EntityTable<
      Cocktail,
      "id" // primary key "id" (for the typings only)
    >;
  }
  // more clients can be added here
}>({});

export function DepProvider({ children }: { children: React.ReactNode }) {
  const idxdb = new Dexie("CocktailsDatabase") as Dexie & {
    cocktails: EntityTable<
      Cocktail,
      "id"
    >;
  };

  idxdb.version(1).stores({
    cocktails:
      // eslint-disable-next-line max-len
      "++id, name, description, steps, is_alcoholic, mixers, size, cost, complexity, required_ingredients, required_tools",
  });

  idxdb.on("populate", async () => {
    await idxdb.cocktails.bulkAdd([
      {
        id: "1",
        name: "Cocktail 1",
        description: "Cocktail 1 description",
        steps: [
          { index: 1, description: "Step 1" },
          { index: 2, description: "Step 2" },
          { index: 3, description: "Step 3" },
        ],
        is_alcoholic: true,
        mixers: ["Mixer 1", "Mixer 2"],
        size: "Large",
        cost: 10,
        complexity: "Medium",
        required_ingredients: ["Ingredient 1", "Ingredient 2"],
        required_tools: ["Tool 1", "Tool 2"],
      },
    ]);

    console.log("Cocktails populated");
  });
  return (
    <DepContext.Provider value={{ idxdb }}>{children}</DepContext.Provider>
  );
}
