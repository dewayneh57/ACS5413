import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function PharmacyScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Pharmacy Page</Text>
      <Text style={styles.instructions}>
        On this screen, users can manage their pharmacy information, including
        preferred pharmacy, contact details, and transfer requests.
        {"\n\n"}
        This helps ensure prescriptions are sent to the correct location and
        makes it easy to update pharmacy preferences as needed.
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
