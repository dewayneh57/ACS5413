/**
 * ACS5413 Assignment 5 - Form Input
 * Dewayne Hafenstein - HAFE0010
 *
 * This project extends the previous assignment by adding form input to the contacts screen.  The other
 * screens will have similar capabilities added in the future.  For now, the contacts screen constitutes
 * the submission for this assignment.
 *
 * This application is the forerunner to my final project for this course, which will be a full-featured
 * personal health record management application.  It will enable a user to record their medical
 * information, contacts, documentation, and more.  It will also track their medication and provide
 * reminders when to take doses and when to refill prescriptions.
 */
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { useWindowDimensions } from "react-native";
import { GlobalStateProvider } from "./context/GlobalStateContext";
import Settings from "./models/Settings";
import MainTabsComponent from "./components/MainTabsComponent";

function OrientationProvider({ children }) {
  const { width, height } = useWindowDimensions();
  const orientation = width < height ? "portrait" : "landscape";
  console.log("Orientation:", orientation);
  return children(orientation);
}

export default function App() {
  const [settings, setSettings] = React.useState(new Settings());
  const [contacts, setContacts] = React.useState([]);
  const [doctors, setDoctors] = React.useState([]);
  const [hospitals, setHospitals] = React.useState([]);
  const [pharmacies, setPharmacies] = React.useState([]);
  const [medications, setMedications] = React.useState([]);
  const [insurance, setInsurance] = React.useState([]);
  const [allergies, setAllergies] = React.useState([]);

  return (
    <GlobalStateProvider
      value={{
        settings,
        setSettings,
        contacts,
        setContacts,
        doctors,
        setDoctors,
        hospitals,
        setHospitals,
        pharmacies,
        setPharmacies,
        medications,
        setMedications,
        insurance,
        setInsurance,
        allergies,
        setAllergies,
      }}
    >
      <OrientationProvider>
        {(orientation) => (
          <NavigationContainer>
            <MainTabsComponent orientation={orientation} />
          </NavigationContainer>
        )}
      </OrientationProvider>
    </GlobalStateProvider>
  );
}
