"use client";

import { useContext, useEffect, useState } from "react";
import { Cocktail, DepContext } from "@/components/context/dep-provider";

export default function AccountCocktails() {
  const [cocktails, setCocktails] = useState<Cocktail[]>([]);
  const [selectedCocktail, setSelectedCocktail] = useState<Cocktail>();
  const { idxdb } = useContext(DepContext);

  // probably will want to make this a hook instead
  useEffect(() => {
    if (!idxdb) return;

    idxdb.cocktails.toCollection().toArray().then(setCocktails);
  }, [idxdb]);
  
  console.log(cocktails);

  return (
    <main>
      <h1>Account Cocktails</h1>
    </main>
  );
}
