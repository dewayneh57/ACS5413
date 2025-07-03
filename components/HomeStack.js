import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ContactsScreen from "../screens/ContactsScreen";
import DoctorsScreen from "../screens/DoctorsScreen";
import FamilyScreen from "../screens/FamilyScreen";
import HistoryScreen from "../screens/HistoryScreen";
import HospitalScreen from "../screens/HospitalScreen";
import MedicationsScreen from "../screens/MedicationsScreen";
import PharmacyScreen from "../screens/PharmacyScreen";
import InsuranceScreen from "../screens/InsuranceScreen";
import DocumentsScreen from "../screens/DocumentsScreen";
import AllergiesScreen from "../screens/AllergiesScreen";
import HomeScreen from "../screens/HomeScreen";

const Stack = createNativeStackNavigator();

export default function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: "Form Input" }}
      />
      <Stack.Screen name="Contacts" component={ContactsScreen} />
      <Stack.Screen name="Doctors" component={DoctorsScreen} />
      <Stack.Screen name="Family" component={FamilyScreen} />
      <Stack.Screen name="History" component={HistoryScreen} />
      <Stack.Screen name="Hospital" component={HospitalScreen} />
      <Stack.Screen name="Medications" component={MedicationsScreen} />
      <Stack.Screen name="Pharmacy" component={PharmacyScreen} />
      <Stack.Screen name="Insurance" component={InsuranceScreen} />
      <Stack.Screen name="Documents" component={DocumentsScreen} />
      <Stack.Screen name="Allergies" component={AllergiesScreen} />
    </Stack.Navigator>
  );
}
