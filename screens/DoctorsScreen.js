import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function DoctorsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Doctors Page</Text>
      <Text style={styles.instructions}>
         On this page, the user will be able to manage the list of their 
         doctors, their specialties, and contact information.  Designation 
         of their PCP (S) will enable any medical professional to
         contact them in case of an emergency.  
         {"\n\n"}
         The doctors will consist of their first and last names, phone 
         numbers, email addresses, and office addresses and hours.
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
