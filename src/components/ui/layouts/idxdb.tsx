"use client";

import { initDB } from "@/lib/idxdb";
import { useEffect, useReducer, createContext, useState } from "react";

type Props = {
  children: React.ReactNode;
};

type State = {
  dbReady: boolean;
};

const actionsType = {
  INIT: "INIT",
} as const;

type ActionsType = (typeof actionsType)[keyof typeof actionsType];

type Actions = {
  type: ActionsType;
  payload?: unknown;
};

const Context = createContext<{
  state: State;
  dispatch: React.Dispatch<Actions>;
}>({
  state: { dbReady: false },
  dispatch: () => {},
});

const reducer = (state: State, action: Actions) => {
  switch (action.type) {
    case actionsType.INIT:
      return {
        ...state,
        dbReady: true,
      };
    default:
      return state;
  }
};

/* wrapper that inits the idxdb for the components that need it */
export default function IdxDbWrapper({ children }: Props) {
  const [isMounted, setIsMounted] = useState(false);
  const [state, dispatch] = useReducer(reducer, {
    dbReady: false,
  });

  useEffect(() => {
    initDB(() => dispatch({ type: actionsType.INIT }));
  }, []);

  return <Context.Provider value={{ state, dispatch }}>{children}</Context.Provider>;
}
