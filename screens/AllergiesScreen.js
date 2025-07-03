import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function AllergiesScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Allergies Page</Text>
      <Text style={styles.instructions}>
        On this screen, users can record and manage their allergies, including
        medication, food, and environmental allergies. 
        {"\n\n"}
        This information is vital
        for healthcare providers to avoid adverse reactions and ensure safe
        treatment plans.
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
