import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function HospitalScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Hospital Page</Text>
      <Text style={styles.instructions}>
        On this screen the user can record information about preferred
        hospitals, including their names, addresses, and contact information.
         {"\n\n"}
        This information can be crucial for medical professionals to understand
        the patient's healthcare preferences and history. This also allows the
        user to indicate hospitals that are in-network or out-of-network, which
        can be important for insurance purposes and emergency situations.
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
