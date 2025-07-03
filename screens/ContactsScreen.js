import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function ContactsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Contacts Page</Text>
      <Text style={styles.instructions}>
         On this page, the user will be able to manage their contact list
         for family and friends for the purpose of allowing medical professionals
         to contact them in case of an emergency.  
         {"\n\n"}
         The contacts will consist of 
         the persons first and last names, phone numbers, email addresses, and 
         their relationship to the person that is using the application.
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
