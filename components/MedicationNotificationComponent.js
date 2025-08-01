/**
 * ACS5413 - Personal Health Management
 * Dewayne Hafenstein - HAFE0010
 *
 * MedicationNotificationComponent - Displays medication notification status and controls
 */

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { useDatabase } from "../context/DatabaseContext";

export default function MedicationNotificationComponent() {
  const {
    medications,
    getScheduledMedicationNotifications,
    cancelAllMedicationNotifications,
    updateMedicationNotifications,
  } = useDatabase();

  const [scheduledNotifications, setScheduledNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadScheduledNotifications();
  }, [medications]);

  const loadScheduledNotifications = async () => {
    try {
      const notifications = await getScheduledMedicationNotifications();
      setScheduledNotifications(notifications);
    } catch (error) {
      console.error("Error loading scheduled notifications:", error);
    }
  };

  const handleRefreshNotifications = async () => {
    setIsLoading(true);
    try {
      await updateMedicationNotifications();
      await loadScheduledNotifications();
      Alert.alert("Success", "Medication notifications have been refreshed");
    } catch (error) {
      console.error("Error refreshing notifications:", error);
      Alert.alert("Error", "Failed to refresh medication notifications");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelAllNotifications = () => {
    Alert.alert(
      "Cancel All Notifications",
      "Are you sure you want to cancel all medication reminder notifications?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Yes, Cancel All",
          style: "destructive",
          onPress: async () => {
            setIsLoading(true);
            try {
              await cancelAllMedicationNotifications();
              await loadScheduledNotifications();
              Alert.alert(
                "Success",
                "All medication notifications have been cancelled"
              );
            } catch (error) {
              console.error("Error cancelling notifications:", error);
              Alert.alert("Error", "Failed to cancel medication notifications");
            } finally {
              setIsLoading(false);
            }
          },
        },
      ]
    );
  };

  const getMedicationsWithNotifications = () => {
    return medications.filter((med) =>
      [
        "once_daily",
        "twice_daily",
        "three_times_daily",
        "four_times_daily",
      ].includes(med.dosingInstructionsType)
    );
  };

  const medicationsWithNotifications = getMedicationsWithNotifications();

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Medication Notifications</Text>

      <View style={styles.statusContainer}>
        <Text style={styles.statusText}>
          {medicationsWithNotifications.length} of {medications.length}{" "}
          medications have reminder schedules
        </Text>
        <Text style={styles.statusText}>
          {scheduledNotifications.length} notification times scheduled
        </Text>
      </View>

      {scheduledNotifications.length > 0 && (
        <View style={styles.notificationsList}>
          <Text style={styles.subTitle}>Scheduled Notification Times:</Text>
          <ScrollView
            style={styles.notificationsScroll}
            nestedScrollEnabled={true}
          >
            {scheduledNotifications.map((notification, index) => (
              <View key={index} style={styles.notificationItem}>
                <Text style={styles.notificationTime}>{notification.time}</Text>
                <Text style={styles.notificationDetails}>
                  {notification.medications.length} medication
                  {notification.medications.length > 1 ? "s" : ""}:
                </Text>
                <Text style={styles.medicationsList}>
                  {notification.medications.join(", ")}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.refreshButton]}
          onPress={handleRefreshNotifications}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? "Refreshing..." : "Refresh Notifications"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={handleCancelAllNotifications}
          disabled={isLoading || scheduledNotifications.length === 0}
        >
          <Text style={styles.buttonText}>Cancel All Notifications</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          Notifications are automatically scheduled for medications with daily
          dosing instructions:
        </Text>
        <Text style={styles.infoDetails}>
          • Once Daily (QD): 8:00 AM{"\n"}• Twice Daily (BID): 8:00 AM, 8:00 PM
          {"\n"}• Three Times Daily (TID): 8:00 AM, 2:00 PM, 8:00 PM{"\n"}• Four
          Times Daily (QID): 8:00 AM, 12:00 PM, 4:00 PM, 8:00 PM
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    marginVertical: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  statusContainer: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 6,
    marginBottom: 12,
  },
  statusText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  notificationsList: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 6,
    marginBottom: 12,
    maxHeight: 200,
  },
  subTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  notificationsScroll: {
    maxHeight: 150,
  },
  notificationItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  notificationTime: {
    fontSize: 16,
    fontWeight: "600",
    color: "#007AFF",
  },
  notificationDetails: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  medicationsList: {
    fontSize: 14,
    color: "#333",
    marginTop: 2,
    fontStyle: "italic",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
    marginHorizontal: 4,
  },
  refreshButton: {
    backgroundColor: "#007AFF",
  },
  cancelButton: {
    backgroundColor: "#FF3B30",
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  infoContainer: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 6,
  },
  infoText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  infoDetails: {
    fontSize: 12,
    color: "#888",
    lineHeight: 18,
  },
});
