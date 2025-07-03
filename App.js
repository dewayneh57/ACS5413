/**
 * ACS5413 Assignment 5 - Form Input
 * Dewayne Hafenstein - HAFE0010
 *
 * This project extends the previous assignment by adding a Form Input
 * component that allows users to enter and submit their health information.
 *
 * This application is the forerunner to my final project for this
 * course, which will be a full-featured personal health record
 * management application.  It will enable a user to record their
 * medical information, contacts, documentation, and more.  It will
 * also track their medication and provide reminders when to take
 * doses and when to refill prescriptions.
 */
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { GlobalStateProvider } from "./context/GlobalStateContext";
import Settings from "./models/Settings";
import MainTabsComponent from "./components/MainTabsComponent";

export default function App() {
  // Set up global state for settings and contacts
  const [settings, setSettings] = React.useState(new Settings());
  const [contacts, setContacts] = React.useState([]); // move contacts state here

  /**
   * Refactored this code to put all components underneath a global state provider to manage all the application state.
   * This allows for easier management of settings and user data across the application.
   * The settings state is initialized with a new Settings object, which can be modified by the user.
   */
  return (
    <GlobalStateProvider
      value={{ settings, setSettings, contacts, setContacts }}
    >
      <NavigationContainer>
        <MainTabsComponent />
      </NavigationContainer>
    </GlobalStateProvider>
  );
}
