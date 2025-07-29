/**
 * ACS5413 - Mobile Application Development
 * Dewayne Hafenstein - HAFE0010
 */
import React, { forwardRef, useImperativeHandle, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Switch,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useDatabase } from "../context/DatabaseContext";
import Settings from "../models/Settings";

const SETTINGS_OPTIONS = [
  { key: "viewStyle", label: "View as Grid (on), or List (off)" },
  { key: "showReminders", label: "Show Medication Reminders" },
];

const SettingsScreen = forwardRef((props, ref) => {
  const { clearAllData } = useDatabase();

  // Temporary default settings until we add settings to database
  const [settings, setSettings] = useState(
    new Settings({
      viewStyle: "grid",
      showReminders: true,
    })
  );

  useImperativeHandle(ref, () => ({
    getSettings: () => settings,
  }));

  const toggleOption = (key) => {
    if (key === "viewStyle") {
      setSettings(
        new Settings({
          ...settings,
          viewStyle: settings.viewStyle === "grid" ? "list" : "grid",
        })
      );
    }
    // Add more options as needed
  };

  const handleClearAllData = () => {
    Alert.alert(
      "Clear All Data",
      "Are you sure you want to clear all data? This action cannot be undone and will remove all contacts, doctors, hospitals, pharmacies, medications, allergies, and medical history.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Clear All Data",
          style: "destructive",
          onPress: async () => {
            try {
              await clearAllData();
              Alert.alert("Success", "All data has been cleared successfully.");
            } catch (error) {
              Alert.alert("Error", "Failed to clear data. Please try again.");
              console.error("Error clearing data:", error);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Settings and Options</Text>
      <FlatList
        data={SETTINGS_OPTIONS}
        keyExtractor={(item) => item.key}
        renderItem={({ item }) => (
          <View style={styles.optionRow}>
            <Text style={styles.optionLabel}>{item.label}</Text>
            {item.key === "viewStyle" ? (
              <Switch
                value={settings.viewStyle === "grid"}
                onValueChange={() => toggleOption(item.key)}
              />
            ) : null}
          </View>
        )}
      />

      <View style={styles.dangerSection}>
        <Text style={styles.dangerSectionTitle}>Data Management</Text>
        <TouchableOpacity
          style={styles.clearDataButton}
          onPress={handleClearAllData}
        >
          <Text style={styles.clearDataButtonText}>Clear All Data</Text>
        </TouchableOpacity>
        <Text style={styles.warningText}>
          This will permanently delete all your health data including contacts,
          doctors, hospitals, pharmacies, medications, allergies, and medical
          history.
        </Text>
      </View>
    </View>
  );
});

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: "#ffffff",
    paddingTop: 16,
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 12,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: 320,
    marginVertical: 8,
    paddingHorizontal: 8,
  },
  optionLabel: {
    fontSize: 16,
    flex: 1,
  },
  dangerSection: {
    marginTop: 40,
    paddingHorizontal: 20,
    width: "100%",
  },
  dangerSectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#dc3545",
  },
  clearDataButton: {
    backgroundColor: "#dc3545",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 12,
  },
  clearDataButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  warningText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    fontStyle: "italic",
  },
});
