import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function DocumentsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Documents Page</Text>
      <Text style={styles.instructions}>
        On this screen, users can upload, view, and manage important medical
        documents such as insurance cards, test results, and referral letters.
        Additionally, durable power of attorney documents, living wills, DNRs,
        and other critical paperwork can be stored here. 
        {"\n\n"}
        This helps keep all critical paperwork organized and easily accessible 
        for appointments or emergencies.
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
