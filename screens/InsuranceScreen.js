import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function InsuranceScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Insurance Page</Text>
      <Text style={styles.instructions}>
        On this screen, users can manage their insurance information, including
        policy details, coverage options, and contact information for their
        insurance provider. 
        {"\n\n"}
        This helps ensure that users have easy access to
        their insurance details when needed, such as during medical appointments
        or emergencies.
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
