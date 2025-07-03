/**
 * ACS5413 - Mobile Application Development
 * Dewayne Hafenstein - HAFE0010
 */
import React, { forwardRef, useImperativeHandle } from "react";
import { View, Text, StyleSheet, FlatList, Switch } from "react-native";
import { useGlobalState } from "../context/GlobalStateContext";
import Settings from "../models/Settings";

const SETTINGS_OPTIONS = [
  { key: "viewStyle", label: "View as Grid (on), or List (off)" },
  { key: "showReminders", label: "Show Medication Reminders" },
];

const SettingsScreen = forwardRef((props, ref) => {
  const { settings, setSettings } = useGlobalState();

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
});
