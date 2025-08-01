/**
 * ACS5413 Assignment 5 - Personal Health Management
 * Dewayne Hafenstein - HAFE0010
 *
 * This project extends the previous assignment by adding form input to the contacts screen.  The other
 * screens will have similar capabilities added in the future.  For now, the contacts screen constitutes
 * the submission for this assignment.
 *
 * This application is the forerunner to my final project for this course, which will be a full-featured
 * personal health record management application.  It will enable a user to record their medical
 * information, contacts, documentation, and more.  It will also track their medication and provide
 * reminders when to take doses and when to refill prescriptions.
 */
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { useWindowDimensions } from "react-native";
import { DatabaseProvider } from "./context/DatabaseContext";
import Settings from "./models/Settings";
import MainTabsComponent from "./components/MainTabsComponent";
import * as Notifications from "expo-notifications";
import { useEffect } from "react";
import { Platform } from "react-native";
import firebaseSyncService from "./services/FirebaseSyncService";
import { MEDICAL_DOSING_INSTRUCTIONS } from "./utils/MedicalDosingInstructions";
import { getDosingInstructionDisplay } from "./utils/MedicalDosingInstructions";

// Configure local notification handler.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

function OrientationProvider({ children }) {
  useEffect(() => {
    // Configure notification permissions
    async function configureNotifications() {
      const { status } = await Notifications.getPermissionsAsync();
      let finalStatus = status;

      if (finalStatus !== "granted") {
        const { status: newStatus } =
          await Notifications.requestPermissionsAsync();
        finalStatus = newStatus;
      }

      if (finalStatus !== "granted") {
        console.log("Local notification permissions not granted");
        return;
      }

      // Configure Android notification channel for local notifications
      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
          name: "Local Notifications",
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#FF231F7C",
        });
      }

      console.log("Local notifications configured successfully");
    }

    configureNotifications();

    const subscription1 = Notifications.addNotificationReceivedListener(
      (notification) => {
        const receivedTime = new Date().toLocaleString();
        console.log("=== NOTIFICATION RECEIVED ===");
        console.log("Time received:", receivedTime);
        console.log(
          "Notification data:",
          JSON.stringify(notification, null, 2)
        );

        // Safely access the userName data
        const userName = notification?.request?.content?.data?.userName;
        if (userName) {
          console.log("User name:", userName);
        }
      }
    );

    const subscription2 = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const responseTime = new Date().toLocaleString();
        console.log("=== NOTIFICATION RESPONSE RECEIVED ===");
        console.log("Time responded:", responseTime);
        console.log("Response data:", JSON.stringify(response, null, 2));

        // Safely access the userName data
        const userName =
          response?.notification?.request?.content?.data?.userName;
        if (userName) {
          console.log("User name:", userName);
        }
      }
    );

    return () => {
      subscription1.remove();
      subscription2.remove();
    };
  }, []);

  const { width, height } = useWindowDimensions();
  const orientation = width < height ? "portrait" : "landscape";
  console.log("Orientation:", orientation);
  return children(orientation);
}

export default function App() {
  return (
    <DatabaseProvider>
      <OrientationProvider>
        {(orientation) => (
          <NavigationContainer>
            <MainTabsComponent orientation={orientation} />
          </NavigationContainer>
        )}
      </OrientationProvider>
    </DatabaseProvider>
  );
}
