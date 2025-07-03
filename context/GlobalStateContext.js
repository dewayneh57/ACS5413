import React, { createContext, useContext, useState } from "react";
import Settings from "../models/Settings";

// Create the context
const GlobalStateContext = createContext();

export function GlobalStateProvider({ children, value }) {
  // If value is provided (from App.js), use it. Otherwise, create default state here.
  const [user, setUser] = useState(null);
  const [settings, setSettings] = useState(new Settings());
  const contextValue = value || { user, setUser, settings, setSettings };

  return (
    <GlobalStateContext.Provider value={contextValue}>
      {children}
    </GlobalStateContext.Provider>
  );
}

export function useGlobalState() {
  return useContext(GlobalStateContext);
}
