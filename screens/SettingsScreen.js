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
  ScrollView,
} from "react-native";
import * as Notifications from "expo-notifications";
import { useDatabase } from "../context/DatabaseContext";
import Settings from "../models/Settings";
import SyncStatusComponent from "../components/SyncStatusComponent";
import MedicationNotificationComponent from "../components/MedicationNotificationComponent";

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

  const handleTestNotification = async () => {
    try {
      // Request notification permissions if not already granted
      const { status } = await Notifications.getPermissionsAsync();
      let finalStatus = status;

      if (finalStatus !== "granted") {
        const { status: newStatus } =
          await Notifications.requestPermissionsAsync();
        finalStatus = newStatus;
      }

      if (finalStatus !== "granted") {
        Alert.alert(
          "Permission Required",
          "Please enable notifications in your device settings to receive medication reminders."
        );
        return;
      }

      // Schedule a test notification for 1 minute from now
      const testTime = new Date();
      testTime.setMinutes(testTime.getMinutes() + 1);

      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Test Notification",
          body: "This is a test notification scheduled 1 minute ago.",
          data: {
            type: "test_notification",
            scheduledTime: testTime.toISOString(),
          },
          sound: "default",
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: 60, // 1 minute from now
          repeats: false,
        },
      });

      Alert.alert(
        "Test Notification Scheduled",
        "A test notification has been scheduled for 1 minute from now."
      );
    } catch (error) {
      console.error("Error scheduling test notification:", error);
      Alert.alert("Error", "Failed to schedule test notification.");
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
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
        scrollEnabled={false}
      />

      {/* Firebase Sync Status */}
      <View style={styles.syncSection}>
        <SyncStatusComponent />
      </View>

      {/* Medication Notifications */}
      <View style={styles.notificationSection}>
        <MedicationNotificationComponent />
      </View>

      <View style={styles.dangerSection}>
        <Text style={styles.dangerSectionTitle}>Data Management</Text>

        <TouchableOpacity
          style={styles.testNotificationButton}
          onPress={handleTestNotification}
        >
          <Text style={styles.testNotificationButtonText}>
            Send Test Notification
          </Text>
        </TouchableOpacity>
        <Text style={styles.testNotificationText}>
          This will send a test notification in 1 minute to verify your
          notification settings.
        </Text>

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
    </ScrollView>
  );
});

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  contentContainer: {
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 16,
    paddingBottom: 40,
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
  syncSection: {
    marginTop: 20,
    paddingHorizontal: 20,
    width: "100%",
  },
  notificationSection: {
    marginTop: 20,
    paddingHorizontal: 20,
    width: "100%",
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
  testNotificationButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 8,
  },
  testNotificationButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  testNotificationText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    fontStyle: "italic",
    marginBottom: 20,
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
