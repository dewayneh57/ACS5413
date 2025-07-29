import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ContactsScreen from "../screens/ContactsScreen";
import DoctorsScreen from "../screens/DoctorsScreen";
import HistoryScreen from "../screens/HistoryScreen";
import HospitalScreen from "../screens/HospitalScreen";
import MedicationsScreen from "../screens/MedicationsScreen";
import PharmacyScreen from "../screens/PharmacyScreen";
import InsuranceScreen from "../screens/InsuranceScreen";
import AllergiesScreen from "../screens/AllergiesScreen";
import HomeScreen from "../screens/HomeScreen";
import MapScreen from "../screens/MapScreen";

const Stack = createNativeStackNavigator();

export default function HomeStack({ orientation }) {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        // Pass orientation as a prop to HomeScreen
        children={(props) => (
          <HomeScreen {...props} orientation={orientation} />
        )}
        options={{ title: "Personal Health Management" }}
      />
      <Stack.Screen name="Contacts" component={ContactsScreen} />
      <Stack.Screen name="Doctors" component={DoctorsScreen} />
      <Stack.Screen name="History" component={HistoryScreen} />
      <Stack.Screen name="Hospital" component={HospitalScreen} />
      <Stack.Screen name="Medications" component={MedicationsScreen} />
      <Stack.Screen name="Pharmacy" component={PharmacyScreen} />
      <Stack.Screen name="Insurance" component={InsuranceScreen} />
      <Stack.Screen name="Allergies" component={AllergiesScreen} />
      <Stack.Screen
        name="MapScreen"
        component={MapScreen}
        options={{ title: "Location Map" }}
      />
    </Stack.Navigator>
  );
}
