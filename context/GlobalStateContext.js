import React, { createContext, useContext, useState } from "react";
import Settings from "../models/Settings";
import Contact from "../models/Contact";

// Create the context
const GlobalStateContext = createContext();

export function GlobalStateProvider({ children, value }) {
  // If value is provided (from App.js), use it. Otherwise, create default state here.
  const [user, setUser] = useState(null);
  const [settings, setSettings] = useState(new Settings());
  const [contacts, setContacts] = useState([
    new Contact({
      id: "1",
      name: "Alice Anderson",
      phone: "555-1234",
      email: "alice@example.com",
      relationship: "Friend",
    }),
    new Contact({
      id: "2",
      name: "Bob Brown",
      phone: "555-5678",
      email: "bob@example.com",
      relationship: "Brother",
    }),
    new Contact({
      id: "3",
      name: "Charlie Clark",
      phone: "555-8765",
      email: "charlie@example.com",
      relationship: "Father",
    }),
    new Contact({
      id: "4",
      name: "David Davis",
      phone: "555-4321",
      email: "david@example.com",
      relationship: "Friend",
    }),
    new Contact({
      id: "5",
      name: "Eve Evans",
      phone: "555-0000",
      email: "eve@example.com",
      relationship: "Mother",
    }),
  ]);
  const contextValue = value || {
    user,
    setUser,
    settings,
    setSettings,
    contacts,
    setContacts,
  };

  return (
    <GlobalStateContext.Provider value={contextValue}>
      {children}
    </GlobalStateContext.Provider>
  );
}

export function useGlobalState() {
  return useContext(GlobalStateContext);
}
