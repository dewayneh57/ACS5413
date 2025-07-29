/**
 * Firebase Sync Service
 * ACS5413 - Personal Health Management
 * Dewayne Hafenstein - HAFE0010
 *
 * Handles synchronization between local SQLite database and Firebase Realtime Database
 */

import { ref, set, get, push, remove, onValue, off } from "firebase/database";
import { database } from "../config/firebaseConfig";
import NetInfo from "@react-native-community/netinfo";

class FirebaseSyncService {
  constructor() {
    this.isOnline = false;
    this.syncInProgress = false;
    this.pendingOperations = [];
    this.listeners = {};

    // Monitor network connectivity
    this.unsubscribeNetInfo = NetInfo.addEventListener((state) => {
      const wasOnline = this.isOnline;
      this.isOnline = state.isConnected;

      if (!wasOnline && this.isOnline) {
        console.log("Network restored, syncing pending operations...");
        this.syncPendingOperations();
      }
    });
  }

  /**
   * Check if device is online
   */
  async checkConnection() {
    const netInfo = await NetInfo.fetch();
    this.isOnline = netInfo.isConnected;
    return this.isOnline;
  }

  /**
   * Sync all data from SQLite to Firebase
   */
  async syncToFirebase(databaseService, userId = "default") {
    if (!this.isOnline || this.syncInProgress) {
      console.log("Sync skipped: offline or sync in progress");
      return;
    }

    this.syncInProgress = true;

    try {
      console.log("Starting sync to Firebase...");

      const tables = [
        "contacts",
        "doctors",
        "hospitals",
        "pharmacies",
        "medications",
        "insurance",
        "allergies",
        "medical_history",
      ];

      for (const table of tables) {
        const data = await databaseService.getAll(table);
        await this.syncTableToFirebase(table, data, userId);
      }

      console.log("Sync to Firebase completed successfully");
    } catch (error) {
      console.error("Error syncing to Firebase:", error);
      throw error;
    } finally {
      this.syncInProgress = false;
    }
  }

  /**
   * Sync specific table data to Firebase
   */
  async syncTableToFirebase(tableName, data, userId = "default") {
    if (!this.isOnline) {
      this.addPendingOperation("sync", tableName, data, userId);
      return;
    }

    try {
      const tableRef = ref(database, `users/${userId}/${tableName}`);

      // Convert array to object with IDs as keys for Firebase
      const firebaseData = {};
      data.forEach((item) => {
        firebaseData[item.id] = {
          ...item,
          lastSyncedAt: Date.now(),
        };
      });

      await set(tableRef, firebaseData);
      console.log(`${tableName} synced to Firebase`);
    } catch (error) {
      console.error(`Error syncing ${tableName} to Firebase:`, error);
      this.addPendingOperation("sync", tableName, data, userId);
      throw error;
    }
  }

  /**
   * Sync data from Firebase to SQLite
   */
  async syncFromFirebase(databaseService, userId = "default") {
    if (!this.isOnline) {
      console.log("Cannot sync from Firebase: offline");
      return;
    }

    try {
      console.log("Starting sync from Firebase...");

      const tables = [
        "contacts",
        "doctors",
        "hospitals",
        "pharmacies",
        "medications",
        "insurance",
        "allergies",
        "medical_history",
      ];

      for (const table of tables) {
        await this.syncTableFromFirebase(table, databaseService, userId);
      }

      console.log("Sync from Firebase completed successfully");
    } catch (error) {
      console.error("Error syncing from Firebase:", error);
      throw error;
    }
  }

  /**
   * Sync specific table from Firebase to SQLite
   */
  async syncTableFromFirebase(tableName, databaseService, userId = "default") {
    try {
      const tableRef = ref(database, `users/${userId}/${tableName}`);
      const snapshot = await get(tableRef);

      if (snapshot.exists()) {
        const firebaseData = snapshot.val();

        // Get current local data for comparison
        const localData = await databaseService.getAll(tableName);
        const localDataMap = {};
        localData.forEach((item) => {
          localDataMap[item.id] = item;
        });

        // Sync each item from Firebase
        for (const [id, firebaseItem] of Object.entries(firebaseData)) {
          const localItem = localDataMap[id];

          if (!localItem) {
            // Item doesn't exist locally, add it
            await this.insertToLocal(tableName, firebaseItem, databaseService);
          } else {
            // Item exists, check if Firebase version is newer
            const firebaseUpdated = new Date(
              firebaseItem.updatedAt || firebaseItem.createdAt
            );
            const localUpdated = new Date(
              localItem.updatedAt || localItem.createdAt
            );

            if (firebaseUpdated > localUpdated) {
              await this.updateLocal(
                tableName,
                id,
                firebaseItem,
                databaseService
              );
            }
          }
        }

        console.log(`${tableName} synced from Firebase`);
      }
    } catch (error) {
      console.error(`Error syncing ${tableName} from Firebase:`, error);
      throw error;
    }
  }

  /**
   * Insert item to local database
   */
  async insertToLocal(tableName, item, databaseService) {
    try {
      const methodName = `add${
        tableName.charAt(0).toUpperCase() + tableName.slice(1, -1)
      }`;
      if (typeof databaseService[methodName] === "function") {
        await databaseService[methodName](item);
      } else {
        await databaseService.insert(tableName, item);
      }
    } catch (error) {
      console.error(`Error inserting ${tableName} item locally:`, error);
    }
  }

  /**
   * Update item in local database
   */
  async updateLocal(tableName, id, item, databaseService) {
    try {
      const methodName = `update${
        tableName.charAt(0).toUpperCase() + tableName.slice(1, -1)
      }`;
      if (typeof databaseService[methodName] === "function") {
        await databaseService[methodName](id, item);
      } else {
        await databaseService.update(tableName, id, item);
      }
    } catch (error) {
      console.error(`Error updating ${tableName} item locally:`, error);
    }
  }

  /**
   * Sync single item to Firebase
   */
  async syncItemToFirebase(tableName, item, userId = "default") {
    if (!this.isOnline) {
      this.addPendingOperation("item", tableName, item, userId);
      return;
    }

    try {
      const itemRef = ref(database, `users/${userId}/${tableName}/${item.id}`);
      await set(itemRef, {
        ...item,
        lastSyncedAt: Date.now(),
      });
      console.log(`${tableName} item ${item.id} synced to Firebase`);
    } catch (error) {
      console.error(`Error syncing ${tableName} item to Firebase:`, error);
      this.addPendingOperation("item", tableName, item, userId);
    }
  }

  /**
   * Delete item from Firebase
   */
  async deleteItemFromFirebase(tableName, itemId, userId = "default") {
    if (!this.isOnline) {
      this.addPendingOperation("delete", tableName, { id: itemId }, userId);
      return;
    }

    try {
      const itemRef = ref(database, `users/${userId}/${tableName}/${itemId}`);
      await remove(itemRef);
      console.log(`${tableName} item ${itemId} deleted from Firebase`);
    } catch (error) {
      console.error(`Error deleting ${tableName} item from Firebase:`, error);
      this.addPendingOperation("delete", tableName, { id: itemId }, userId);
    }
  }

  /**
   * Add operation to pending queue for when connection is restored
   */
  addPendingOperation(type, tableName, data, userId) {
    this.pendingOperations.push({
      type,
      tableName,
      data,
      userId,
      timestamp: Date.now(),
    });
  }

  /**
   * Process all pending operations when connection is restored
   */
  async syncPendingOperations() {
    if (!this.isOnline || this.pendingOperations.length === 0) {
      return;
    }

    console.log(
      `Processing ${this.pendingOperations.length} pending operations...`
    );

    const operations = [...this.pendingOperations];
    this.pendingOperations = [];

    for (const operation of operations) {
      try {
        switch (operation.type) {
          case "item":
            await this.syncItemToFirebase(
              operation.tableName,
              operation.data,
              operation.userId
            );
            break;
          case "delete":
            await this.deleteItemFromFirebase(
              operation.tableName,
              operation.data.id,
              operation.userId
            );
            break;
          case "sync":
            await this.syncTableToFirebase(
              operation.tableName,
              operation.data,
              operation.userId
            );
            break;
        }
      } catch (error) {
        console.error("Error processing pending operation:", error);
        // Re-add failed operation to queue
        this.pendingOperations.push(operation);
      }
    }
  }

  /**
   * Set up real-time listeners for Firebase changes
   */
  setupRealtimeSync(databaseService, userId = "default") {
    if (!this.isOnline) {
      return;
    }

    const tables = [
      "contacts",
      "doctors",
      "hospitals",
      "pharmacies",
      "medications",
      "insurance",
      "allergies",
      "medical_history",
    ];

    tables.forEach((tableName) => {
      const tableRef = ref(database, `users/${userId}/${tableName}`);

      const listener = onValue(tableRef, (snapshot) => {
        if (snapshot.exists()) {
          console.log(`Received real-time update for ${tableName}`);
          this.handleRealtimeUpdate(tableName, snapshot.val(), databaseService);
        }
      });

      this.listeners[tableName] = { ref: tableRef, listener };
    });
  }

  /**
   * Handle real-time updates from Firebase
   */
  async handleRealtimeUpdate(tableName, firebaseData, databaseService) {
    // Only process if we're not currently syncing to avoid conflicts
    if (this.syncInProgress) {
      return;
    }

    try {
      // This would be more sophisticated in a production app
      // For now, we'll just log the update
      console.log(`Real-time update available for ${tableName}`);
    } catch (error) {
      console.error(`Error handling real-time update for ${tableName}:`, error);
    }
  }

  /**
   * Stop all real-time listeners
   */
  stopRealtimeSync() {
    Object.values(this.listeners).forEach(({ ref, listener }) => {
      off(ref, "value", listener);
    });
    this.listeners = {};
  }

  /**
   * Cleanup resources
   */
  cleanup() {
    this.stopRealtimeSync();
    if (this.unsubscribeNetInfo) {
      this.unsubscribeNetInfo();
    }
  }
}

// Create singleton instance
const firebaseSyncService = new FirebaseSyncService();

export default firebaseSyncService;
