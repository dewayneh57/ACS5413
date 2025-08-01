/**
 * ACS5413 - Personal Health Management
 * Dewayne Hafenstein - HAFE0010
 *
 * MedicationNotificationService - Manages medication reminder notifications
 * Groups medications by time to prevent notification bombardment
 */

import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

class MedicationNotificationService {
  constructor() {
    this.notificationTimes = {
      once_daily: ["08:00"],
      twice_daily: ["08:00", "20:00"],
      three_times_daily: ["08:00", "14:00", "20:00"],
      four_times_daily: ["08:00", "12:00", "16:00", "20:00"],
    };
    this.supportedTypes = [
      "once_daily",
      "twice_daily",
      "three_times_daily",
      "four_times_daily",
    ];
  }

  /**
   * Configure notification permissions and channels
   */
  async initialize() {
    try {
      const { status } = await Notifications.getPermissionsAsync();
      let finalStatus = status;

      if (finalStatus !== "granted") {
        const { status: newStatus } =
          await Notifications.requestPermissionsAsync();
        finalStatus = newStatus;
      }

      if (finalStatus !== "granted") {
        console.log("Notification permissions not granted");
        return false;
      }

      // Configure Android notification channel for medication reminders
      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync(
          "medication-reminders",
          {
            name: "Medication Reminders",
            importance: Notifications.AndroidImportance.HIGH,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: "#FF231F7C",
            sound: "default",
          }
        );
      }

      console.log("Medication notifications configured successfully");
      return true;
    } catch (error) {
      console.error("Error configuring medication notifications:", error);
      return false;
    }
  }

  /**
   * Cancel all existing medication notifications
   */
  async cancelAllMedicationNotifications() {
    try {
      const scheduledNotifications =
        await Notifications.getAllScheduledNotificationsAsync();
      const medicationNotifications = scheduledNotifications.filter(
        (notification) =>
          notification.content.data?.type === "medication_reminder"
      );

      for (const notification of medicationNotifications) {
        await Notifications.cancelScheduledNotificationAsync(
          notification.identifier
        );
      }

      console.log(
        `Cancelled ${medicationNotifications.length} medication notifications`
      );
    } catch (error) {
      console.error("Error cancelling medication notifications:", error);
    }
  }

  /**
   * Group medications by notification times
   */
  groupMedicationsByTime(medications) {
    const timeGroups = {};

    medications.forEach((medication) => {
      const dosingType = medication.dosingInstructionsType;

      if (!this.supportedTypes.includes(dosingType)) {
        return; // Skip unsupported dosing types
      }

      const times = this.notificationTimes[dosingType];

      times.forEach((time) => {
        if (!timeGroups[time]) {
          timeGroups[time] = [];
        }
        timeGroups[time].push(medication);
      });
    });

    return timeGroups;
  }

  /**
   * Create notification content for grouped medications
   */
  createNotificationContent(medications, time) {
    const medicationNames = medications.map((med) => med.drugName).join(", ");
    const count = medications.length;

    let title, body;

    if (count === 1) {
      title = "Medication Reminder";
      body = `Time to take ${medicationNames}`;
    } else {
      title = "Medication Reminders";
      body = `Time to take ${count} medications: ${medicationNames}`;
    }

    return {
      title,
      body,
      data: {
        type: "medication_reminder",
        time,
        medications: medications.map((med) => ({
          id: med.id,
          drugName: med.drugName,
          doseSize: med.doseSize,
        })),
      },
      sound: "default",
      priority: Notifications.AndroidImportance.HIGH,
    };
  }

  /**
   * Calculate next notification date/time
   */
  getNextNotificationDate(timeString) {
    const [hours, minutes] = timeString.split(":").map(Number);
    const now = new Date();
    const notificationDate = new Date();

    notificationDate.setHours(hours, minutes, 0, 0);

    // If the time has already passed today, schedule for tomorrow
    if (notificationDate <= now) {
      notificationDate.setDate(notificationDate.getDate() + 1);
    }

    return notificationDate;
  }

  /**
   * Schedule a recurring notification for a specific time
   */
  async scheduleTimeNotification(time, medications) {
    try {
      const content = this.createNotificationContent(medications, time);
      const [hours, minutes] = time.split(":").map(Number);

      const identifier = `medication_${time.replace(":", "")}`;

      const trigger = {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        hour: hours,
        minute: minutes,
        repeats: true,
      };

      await Notifications.scheduleNotificationAsync({
        identifier,
        content: {
          ...content,
          categoryIdentifier: "medication-reminders",
        },
        trigger,
      });

      console.log(
        `Scheduled daily notification for ${time}: ${medications.length} medications`
      );
      return identifier;
    } catch (error) {
      console.error(`Error scheduling notification for ${time}:`, error);
      throw error;
    }
  }

  /**
   * Schedule all medication notifications
   */
  async scheduleAllMedicationNotifications(medications) {
    try {
      // Initialize if not already done
      const initialized = await this.initialize();
      if (!initialized) {
        throw new Error("Failed to initialize notifications");
      }

      // Cancel existing medication notifications
      await this.cancelAllMedicationNotifications();

      // Filter medications that have supported dosing instructions
      const validMedications = medications.filter((med) =>
        this.supportedTypes.includes(med.dosingInstructionsType)
      );

      if (validMedications.length === 0) {
        console.log("No medications with supported dosing schedules found");
        return [];
      }

      // Group medications by notification times
      const timeGroups = this.groupMedicationsByTime(validMedications);
      const scheduledNotifications = [];

      // Schedule notifications for each time group
      for (const [time, meds] of Object.entries(timeGroups)) {
        const identifier = await this.scheduleTimeNotification(time, meds);
        scheduledNotifications.push({
          identifier,
          time,
          medicationCount: meds.length,
          medications: meds.map((med) => med.drugName),
        });
      }

      console.log(
        `Scheduled ${scheduledNotifications.length} medication notification times for ${validMedications.length} medications`
      );
      return scheduledNotifications;
    } catch (error) {
      console.error("Error scheduling medication notifications:", error);
      throw error;
    }
  }

  /**
   * Get summary of scheduled medication notifications
   */
  async getScheduledMedicationNotifications() {
    try {
      const scheduledNotifications =
        await Notifications.getAllScheduledNotificationsAsync();
      const medicationNotifications = scheduledNotifications.filter(
        (notification) =>
          notification.content.data?.type === "medication_reminder"
      );

      return medicationNotifications.map((notification) => ({
        identifier: notification.identifier,
        time: notification.content.data?.time,
        title: notification.content.title,
        body: notification.content.body,
        medications: notification.content.data?.medications || [],
      }));
    } catch (error) {
      console.error("Error getting scheduled notifications:", error);
      return [];
    }
  }

  /**
   * Update notifications when medications change
   */
  async updateMedicationNotifications(medications) {
    try {
      console.log("Updating medication notifications...");
      const result = await this.scheduleAllMedicationNotifications(medications);
      console.log("Medication notifications updated successfully");
      return result;
    } catch (error) {
      console.error("Error updating medication notifications:", error);
      throw error;
    }
  }
}

// Create singleton instance
const medicationNotificationService = new MedicationNotificationService();

export default medicationNotificationService;
