/**
 * Firebase Sync Se      if (!wasOnline && this.isOnline) {
        console.log('Network restored, running intelligent sync and processing pending operations...');
        // Run intelligent sync first to merge all data
        this.triggerIntelligentSyncOnReconnect();
        // Then process any pending operations
        this.syncPendingOperations();
      }e
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
   * Intelligent bidirectional sync - preserves data on both sides
   * Loads Firebase data that doesn't exist locally, uploads local data that doesn't exist in Firebase
   */
  async intelligentBidirectionalSync(databaseService, userId = "default") {
    if (!this.isOnline || this.syncInProgress) {
      console.log("Sync skipped: offline or sync in progress");
      return;
    }

    this.syncInProgress = true;

    try {
      console.log("Starting intelligent bidirectional sync...");

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
        await this.intelligentSyncTable(table, databaseService, userId);
      }

      console.log("Intelligent bidirectional sync completed successfully");
    } catch (error) {
      console.error("Error during intelligent sync:", error);
      throw error;
    } finally {
      this.syncInProgress = false;
    }
  }

  /**
   * Intelligent sync for a specific table - merges data from both sources
   */
  async intelligentSyncTable(tableName, databaseService, userId = "default") {
    try {
      console.log(`Starting intelligent sync for ${tableName}...`);

      // Get data from both sources
      const localData = await databaseService.getAll(tableName);
      const firebaseData = await this.getFirebaseTableData(tableName, userId);

      // Create maps for easier comparison
      const localDataMap = {};
      const firebaseDataMap = {};

      localData.forEach((item) => {
        localDataMap[item.id] = item;
      });

      Object.keys(firebaseData).forEach((id) => {
        firebaseDataMap[id] = firebaseData[id];
      });

      // Find items that exist in Firebase but not locally
      const firebaseOnlyItems = Object.keys(firebaseDataMap).filter(
        (id) => !localDataMap[id]
      );

      // Find items that exist locally but not in Firebase
      const localOnlyItems = Object.keys(localDataMap).filter(
        (id) => !firebaseDataMap[id]
      );

      // Find items that exist in both (for conflict resolution)
      const commonItems = Object.keys(localDataMap).filter(
        (id) => firebaseDataMap[id]
      );

      console.log(`${tableName} sync analysis:`);
      console.log(`- Firebase only: ${firebaseOnlyItems.length} items`);
      console.log(`- Local only: ${localOnlyItems.length} items`);
      console.log(`- Common items: ${commonItems.length} items`);

      // 1. Add Firebase-only items to local database
      for (const id of firebaseOnlyItems) {
        try {
          const firebaseItem = firebaseDataMap[id];
          console.log(`Adding Firebase item to local: ${tableName}/${id}`);
          await this.insertToLocal(tableName, firebaseItem, databaseService);
        } catch (error) {
          console.error(
            `Error adding Firebase item to local (${tableName}/${id}):`,
            error
          );
        }
      }

      // 2. Add local-only items to Firebase
      for (const id of localOnlyItems) {
        try {
          const localItem = localDataMap[id];
          console.log(`Adding local item to Firebase: ${tableName}/${id}`);
          await this.syncItemToFirebase(tableName, localItem, userId);
        } catch (error) {
          console.error(
            `Error adding local item to Firebase (${tableName}/${id}):`,
            error
          );
        }
      }

      // 3. Resolve conflicts for common items (use most recent timestamp)
      for (const id of commonItems) {
        try {
          const localItem = localDataMap[id];
          const firebaseItem = firebaseDataMap[id];

          await this.resolveConflict(
            tableName,
            id,
            localItem,
            firebaseItem,
            databaseService,
            userId
          );
        } catch (error) {
          console.error(
            `Error resolving conflict for ${tableName}/${id}:`,
            error
          );
        }
      }

      console.log(`Intelligent sync completed for ${tableName}`);
    } catch (error) {
      console.error(`Error during intelligent sync for ${tableName}:`, error);
      throw error;
    }
  }

  /**
   * Get table data from Firebase
   */
  async getFirebaseTableData(tableName, userId = "default") {
    try {
      const tableRef = ref(database, `users/${userId}/${tableName}`);
      const snapshot = await get(tableRef);

      if (snapshot.exists()) {
        return snapshot.val();
      } else {
        return {};
      }
    } catch (error) {
      console.error(`Error getting Firebase data for ${tableName}:`, error);
      return {};
    }
  }

  /**
   * Resolve conflicts between local and Firebase data
   */
  async resolveConflict(
    tableName,
    id,
    localItem,
    firebaseItem,
    databaseService,
    userId = "default"
  ) {
    try {
      // Get timestamps for comparison
      const localTimestamp = this.getItemTimestamp(localItem);
      const firebaseTimestamp = this.getItemTimestamp(firebaseItem);

      console.log(`Resolving conflict for ${tableName}/${id}:`);
      console.log(`- Local timestamp: ${localTimestamp}`);
      console.log(`- Firebase timestamp: ${firebaseTimestamp}`);

      if (firebaseTimestamp > localTimestamp) {
        // Firebase version is newer, update local
        console.log(
          `Firebase version is newer, updating local ${tableName}/${id}`
        );
        await this.updateLocal(tableName, id, firebaseItem, databaseService);
      } else if (localTimestamp > firebaseTimestamp) {
        // Local version is newer, update Firebase
        console.log(
          `Local version is newer, updating Firebase ${tableName}/${id}`
        );
        await this.syncItemToFirebase(tableName, localItem, userId);
      } else {
        // Same timestamp, no action needed
        console.log(`Same timestamp for ${tableName}/${id}, no action needed`);
      }
    } catch (error) {
      console.error(`Error resolving conflict for ${tableName}/${id}:`, error);
    }
  }

  /**
   * Get timestamp from item for comparison
   */
  getItemTimestamp(item) {
    // Priority: updatedAt > lastSyncedAt > createdAt > 0
    if (item.updatedAt) {
      return new Date(item.updatedAt).getTime();
    } else if (item.lastSyncedAt) {
      return new Date(item.lastSyncedAt).getTime();
    } else if (item.createdAt) {
      return new Date(item.createdAt).getTime();
    } else if (item.created_at) {
      return new Date(item.created_at).getTime();
    } else {
      return 0; // Fallback for items without timestamps
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
   * Insert item to local database (or update if it already exists)
   */
  async insertToLocal(tableName, item, databaseService) {
    try {
      // First check if the item already exists locally
      const existingItem = await databaseService.getById(tableName, item.id);

      if (existingItem) {
        // Item already exists, update instead of insert
        console.log(
          `Item ${item.id} already exists locally, updating instead of inserting`
        );
        await this.updateLocal(tableName, item.id, item, databaseService);
      } else {
        // Item doesn't exist, safe to insert
        const methodName = `add${
          tableName.charAt(0).toUpperCase() + tableName.slice(1, -1)
        }`;
        if (typeof databaseService[methodName] === "function") {
          await databaseService[methodName](item);
        } else {
          await databaseService.insert(tableName, item);
        }
      }
    } catch (error) {
      console.error(`Error inserting ${tableName} item locally:`, error);
      // If insert fails, try update as fallback
      try {
        console.log(
          `Insert failed, trying update as fallback for ${tableName}/${item.id}`
        );
        await this.updateLocal(tableName, item.id, item, databaseService);
      } catch (updateError) {
        console.error(
          `Update fallback also failed for ${tableName}/${item.id}:`,
          updateError
        );
      }
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
   * Trigger intelligent sync when connection is restored
   * This ensures data is properly merged after being offline
   */
  async triggerIntelligentSyncOnReconnect() {
    // This will be called by external services that have access to DatabaseService
    // For now, we'll emit an event or use a callback mechanism
    if (this.onReconnectCallback) {
      try {
        await this.onReconnectCallback();
      } catch (error) {
        console.error("Error during reconnect sync:", error);
      }
    }
  }

  /**
   * Set callback for when connection is restored
   */
  setReconnectCallback(callback) {
    this.onReconnectCallback = callback;
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
