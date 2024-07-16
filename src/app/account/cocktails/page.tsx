"use client";

import { useContext, useEffect, useState } from "react";

import { type Cocktail, DepContext } from "@/components/context/dep-provider";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CocktailCard } from "@/components/ui/custom/cocktail-card";

export default function AccountCocktails() {
  const [cocktails, setCocktails] = useState<Cocktail[]>([]);
  const { idxdb } = useContext(DepContext);

  // probably will want to make this a hook instead
  useEffect(() => {
    if (!idxdb) return;

    idxdb.cocktails.toCollection().toArray().then(setCocktails);
  }, [idxdb]);

  return (
    <main>
      <h1>Account Cocktails</h1>
      <Accordion
        type="single"
        collapsible
        className="w-full"
      >
        {cocktails.map((cocktail) => (
          <AccordionItem
            key={cocktail.id}
            value={cocktail.id}
          >
            <AccordionTrigger>{cocktail.name}</AccordionTrigger>
            <AccordionContent>
              <CocktailCard cocktail={cocktail} />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </main>
  );
}
