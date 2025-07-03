import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function FamilyScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Family Page</Text>
      <Text style={styles.instructions}>
         The intention on this page is to allow the user to input and manage 
         critical family history, such as strokes, high blood pressure, diabetes, 
         heart disease, and other hereditary conditions.
         {"\n\n"}
         This information can be crucial for medical professionals to understand
         the patient's background and potential risk factors.
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
  instructions : {
    margin: 12,
    fontSize: 16,
    fontWeight: "normal",
  }
});
