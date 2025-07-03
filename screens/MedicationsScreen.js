import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function MedicationsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Medications Page</Text>
      <Text style={styles.instructions}>
        On this screen the user can record information about their medications,
        including names, dosages, and schedules. 
        {"\n\n"}
        This information is crucial for ensuring that patients receive the correct 
        medications at the right times. 
        {"\n\n"}
        This screen is also where frequency and dosing reminders can be set
        allowing the application to notify the user when it is time to take
        their medications.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
  },
  instructions: {
    margin: 12,
    fontSize: 16,
    fontWeight: "normal",
  },
});
