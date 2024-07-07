"use client";

import { createContext, useEffect, useRef, useState } from "react";
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

  // using a websocket to spin up the server until we get a persistent server
  const [ws, setWebsocket] = useState(null as WebSocket | null);
  const join = (uuid: string) => {
    const URL = `${process.env.NEXT_PUBLIC_WS_URL}/${uuid}`;

    setWebsocket(() => {
      const webSocket = new WebSocket(URL);

      webSocket.onmessage = (_e) => {
        // console.log(e.data);
      };
      webSocket.onclose = () => {
        console.log("Connection Closed");
      };

      return webSocket;
    });
  };

  useEffect(() => {
    if (!ws) {
      join(crypto.randomUUID());
    }

    return () => {
      ws?.close();
    };
  }, [ws]);

  return (
    <>
      <Toaster />
      <DepContext.Provider value={{ idxdb, refs }}>
        {children}
      </DepContext.Provider>
    </>
  );
}
