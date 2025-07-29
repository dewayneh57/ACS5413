/**
 * Firebase Sync Status Component
 * ACS5413 - Personal Health Management
 * Dewayne Hafenstein - HAFE0010
 *
 * Displays Firebase sync status and provides manual sync controls
 */

import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { useDatabase } from "../context/DatabaseContext";

const SyncStatusComponent = () => {
  const { syncWithFirebase, getSyncStatus, setAutoSync } = useDatabase();
  const [syncStatus, setSyncStatus] = useState({
    isOnline: false,
    autoSyncEnabled: true,
    pendingOperations: 0,
    userId: "default",
  });
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    loadSyncStatus();

    // Update status every 30 seconds
    const interval = setInterval(loadSyncStatus, 30000);

    return () => clearInterval(interval);
  }, []);

  const loadSyncStatus = async () => {
    try {
      const status = await getSyncStatus();
      setSyncStatus(status);
    } catch (error) {
      console.error("Error loading sync status:", error);
    }
  };

  const handleManualSync = async () => {
    if (isSyncing) return;

    setIsSyncing(true);
    try {
      const result = await syncWithFirebase();

      if (result.success) {
        Alert.alert(
          "Sync Successful",
          "Your data has been synchronized with Firebase.",
          [{ text: "OK" }]
        );
      } else {
        Alert.alert("Sync Failed", `Sync failed: ${result.message}`, [
          { text: "OK" },
        ]);
      }

      // Refresh status after sync attempt
      await loadSyncStatus();
    } catch (error) {
      Alert.alert("Sync Error", "An error occurred during synchronization.", [
        { text: "OK" },
      ]);
    } finally {
      setIsSyncing(false);
    }
  };

  const toggleAutoSync = () => {
    const newValue = !syncStatus.autoSyncEnabled;
    setAutoSync(newValue);
    setSyncStatus((prev) => ({ ...prev, autoSyncEnabled: newValue }));

    Alert.alert(
      "Auto-Sync Changed",
      `Auto-sync has been ${newValue ? "enabled" : "disabled"}.`,
      [{ text: "OK" }]
    );
  };

  const getStatusColor = () => {
    if (!syncStatus.isOnline) return "#ff6b6b"; // Red for offline
    if (syncStatus.pendingOperations > 0) return "#ffa726"; // Orange for pending
    return "#4caf50"; // Green for online and synced
  };

  const getStatusText = () => {
    if (!syncStatus.isOnline) return "Offline";
    if (syncStatus.pendingOperations > 0)
      return `${syncStatus.pendingOperations} pending`;
    return "Synced";
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Firebase Sync</Text>

      <View style={styles.statusRow}>
        <View
          style={[
            styles.statusIndicator,
            { backgroundColor: getStatusColor() },
          ]}
        />
        <Text style={styles.statusText}>{getStatusText()}</Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Auto-sync:</Text>
        <TouchableOpacity onPress={toggleAutoSync} style={styles.toggleButton}>
          <Text
            style={[
              styles.toggleText,
              { color: syncStatus.autoSyncEnabled ? "#4caf50" : "#666" },
            ]}
          >
            {syncStatus.autoSyncEnabled ? "ON" : "OFF"}
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={handleManualSync}
        style={[styles.syncButton, { opacity: isSyncing ? 0.6 : 1 }]}
        disabled={isSyncing}
      >
        <Text style={styles.syncButtonText}>
          {isSyncing ? "Syncing..." : "Sync Now"}
        </Text>
      </TouchableOpacity>

      <Text style={styles.userIdText}>User: {syncStatus.userId}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f8f9fa",
    padding: 15,
    borderRadius: 8,
    marginVertical: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  statusText: {
    fontSize: 16,
    color: "#333",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  infoLabel: {
    fontSize: 16,
    color: "#333",
  },
  toggleButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    backgroundColor: "#e0e0e0",
  },
  toggleText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  syncButton: {
    backgroundColor: "#2196f3",
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: "center",
    marginBottom: 10,
  },
  syncButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  userIdText: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
});

export default SyncStatusComponent;
