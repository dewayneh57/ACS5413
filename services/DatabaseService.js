/**
 * ACS5413 - Personal Health Management
 * Dewayne Hafenstein - HAFE0010
 *
 * DatabaseService - SQLite database operations for all health management data
 * Handles initialization, CRUD operations, and data persistence for:
 * - Contacts, Doctors, Hospitals, Pharmacies, Medications, Insurance, Allergies, Medical History
 * - Firebase synchronization for offline/online data sync
 */

import * as SQLite from "expo-sqlite";
import firebaseSyncService from "./FirebaseSyncService";

class DatabaseService {
  constructor() {
    this.db = null;
    this.userId = "default"; // You can make this dynamic based on user authentication
    this.autoSyncEnabled = true;
  }

  async initDatabase() {
    try {
      this.db = await SQLite.openDatabaseAsync("health_management.db");

      // Create tables if they don't exist
      await this.createTables();

      // Set up reconnect callback for intelligent sync
      firebaseSyncService.setReconnectCallback(async () => {
        console.log("Running intelligent sync after reconnection...");
        await firebaseSyncService.intelligentBidirectionalSync(
          this,
          this.userId
        );
      });

      // Check Firebase connectivity and sync if online
      await this.initializeFirebaseSync();

      console.log("Database initialized successfully");
    } catch (error) {
      console.error("Error initializing database:", error);
      throw error;
    }
  }

  /**
   * Initialize Firebase sync with intelligent bidirectional merging
   */
  async initializeFirebaseSync() {
    try {
      const isOnline = await firebaseSyncService.checkConnection();

      if (isOnline) {
        console.log("Online - setting up intelligent Firebase sync...");

        // Use intelligent bidirectional sync that preserves data on both sides
        await firebaseSyncService.intelligentBidirectionalSync(
          this,
          this.userId
        );

        // Set up real-time listeners
        firebaseSyncService.setupRealtimeSync(this, this.userId);

        console.log("Intelligent Firebase sync initialized");
      } else {
        console.log(
          "Offline - Firebase sync will activate when connection is restored"
        );
      }
    } catch (error) {
      console.error("Error initializing Firebase sync:", error);
      // Don't throw error - allow app to work offline
    }
  }

  /**
   * Manual sync trigger with intelligent bidirectional merging
   */
  async syncWithFirebase() {
    try {
      const isOnline = await firebaseSyncService.checkConnection();

      if (!isOnline) {
        console.log("Cannot sync: device is offline");
        return { success: false, message: "Device is offline" };
      }

      // Use intelligent bidirectional sync
      await firebaseSyncService.intelligentBidirectionalSync(this, this.userId);

      return {
        success: true,
        message: "Intelligent sync completed successfully",
      };
    } catch (error) {
      console.error("Error during manual sync:", error);
      return { success: false, message: error.message };
    }
  }

  async dropAndRecreateAllTables() {
    try {
      // Drop all tables
      const tables = [
        "contacts",
        "doctors",
        "hospitals",
        "pharmacies",
        "medications",
        "insurance",
        "allergies",
        "medical_history",
        "medical_devices",
      ];

      for (const table of tables) {
        await this.db.execAsync(`DROP TABLE IF EXISTS ${table}`);
      }

      console.log("All tables dropped");

      // Recreate tables with correct schema
      await this.createTables();

      console.log("All tables recreated with model-matching schema");
    } catch (error) {
      console.error("Error dropping and recreating tables:", error);
      throw error;
    }
  }

  async createTables() {
    const queries = [
      // Contacts table - matches Contact model
      `CREATE TABLE IF NOT EXISTS contacts (
        id TEXT PRIMARY KEY,
        firstName TEXT,
        middleName TEXT,
        lastName TEXT,
        homePhone TEXT,
        workPhone TEXT,
        cellPhone TEXT,
        street1 TEXT,
        street2 TEXT,
        city TEXT,
        state TEXT,
        zip TEXT,
        email TEXT,
        notes TEXT,
        relationship TEXT,
        createdAt TEXT,
        updatedAt TEXT,
        lastSyncedAt TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,

      // Doctors table - matches Doctor model
      `CREATE TABLE IF NOT EXISTS doctors (
        id TEXT PRIMARY KEY,
        firstName TEXT,
        middleName TEXT,
        lastName TEXT,
        specialty TEXT,
        street1 TEXT,
        street2 TEXT,
        city TEXT,
        state TEXT,
        zip TEXT,
        phone TEXT,
        createdAt TEXT,
        updatedAt TEXT,
        lastSyncedAt TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,

      // Hospitals table - matches Hospital model
      `CREATE TABLE IF NOT EXISTS hospitals (
        id TEXT PRIMARY KEY,
        name TEXT,
        street1 TEXT,
        street2 TEXT,
        city TEXT,
        state TEXT,
        zip TEXT,
        phone TEXT,
        inNetwork INTEGER DEFAULT 0,
        createdAt TEXT,
        updatedAt TEXT,
        lastSyncedAt TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,

      // Pharmacies table - matches Pharmacy model
      `CREATE TABLE IF NOT EXISTS pharmacies (
        id TEXT PRIMARY KEY,
        name TEXT,
        street1 TEXT,
        street2 TEXT,
        city TEXT,
        state TEXT,
        zip TEXT,
        phone TEXT,
        inNetwork INTEGER DEFAULT 0,
        createdAt TEXT,
        updatedAt TEXT,
        lastSyncedAt TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,

      // Medications table - matches Medication model
      `CREATE TABLE IF NOT EXISTS medications (
        id TEXT PRIMARY KEY,
        drugName TEXT,
        genericName TEXT,
        manufacturer TEXT,
        doseSize TEXT,
        dosingInstructions TEXT,
        rxNumber TEXT,
        prescriptionQuantity TEXT,
        pillImage TEXT,
        createdAt TEXT,
        updatedAt TEXT,
        lastSyncedAt TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,

      // Insurance table - matches Insurance model
      `CREATE TABLE IF NOT EXISTS insurance (
        id TEXT PRIMARY KEY,
        providerName TEXT,
        groupNumber TEXT,
        identificationNumber TEXT,
        agentName TEXT,
        agentStreet1 TEXT,
        agentStreet2 TEXT,
        agentCity TEXT,
        agentState TEXT,
        agentZip TEXT,
        agentPhone TEXT,
        customerSupportPhone TEXT,
        preauthorizationPhone TEXT,
        additionalPhone1 TEXT,
        additionalPhone1Type TEXT,
        additionalPhone2 TEXT,
        additionalPhone2Type TEXT,
        createdAt TEXT,
        updatedAt TEXT,
        lastSyncedAt TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,

      // Allergies table - matches Allergy model
      `CREATE TABLE IF NOT EXISTS allergies (
        id TEXT PRIMARY KEY,
        allergy TEXT,
        severity TEXT,
        remediation TEXT,
        description TEXT,
        createdAt TEXT,
        updatedAt TEXT,
        lastSyncedAt TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,

      // Medical History table - matches MedicalHistoryItem model with all possible fields
      `CREATE TABLE IF NOT EXISTS medical_history (
        id TEXT PRIMARY KEY,
        type TEXT,
        date TEXT,
        notes TEXT,
        doctor TEXT,
        createdAt TEXT,
        updatedAt TEXT,
        -- Surgery fields
        procedure TEXT,
        surgeon TEXT,
        outcome TEXT,
        hospital TEXT,
        complications TEXT,
        -- Diagnosis fields
        condition TEXT,
        diagnosingDoctor TEXT,
        severity TEXT,
        status TEXT,
        treatment TEXT,
        -- Test fields
        testName TEXT,
        testType TEXT,
        results TEXT,
        normalRange TEXT,
        orderingDoctor TEXT,
        facility TEXT,
        -- Illness fields
        illness TEXT,
        onsetDate TEXT,
        resolutionDate TEXT,
        symptoms TEXT,
        -- Injury fields
        injuryType TEXT,
        bodyPart TEXT,
        cause TEXT,
        healingTime TEXT,
        -- Immunization fields
        vaccine TEXT,
        manufacturer TEXT,
        lotNumber TEXT,
        administeredBy TEXT,
        nextDueDate TEXT,
        reactions TEXT,
        -- Medical device fields
        deviceName TEXT,
        modelNumber TEXT,
        serialNumber TEXT,
        implantDate TEXT,
        batteryLife TEXT,
        nextMaintenance TEXT,
        lastSyncedAt TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,

      // Medical Devices table - matches MedicalDevice model
      `CREATE TABLE IF NOT EXISTS medical_devices (
        id TEXT PRIMARY KEY,
        type TEXT,
        date TEXT,
        notes TEXT,
        doctor TEXT,
        deviceName TEXT,
        manufacturer TEXT,
        modelNumber TEXT,
        serialNumber TEXT,
        implantDate TEXT,
        facility TEXT,
        batteryLife TEXT,
        nextMaintenance TEXT,
        createdAt TEXT,
        updatedAt TEXT,
        lastSyncedAt TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
    ];

    for (const query of queries) {
      await this.db.execAsync(query);
    }
  }

  // Generic CRUD operations with Firebase sync
  async insert(table, data) {
    try {
      // Only filter out null and undefined values, allow empty strings
      const filteredData = {};
      Object.keys(data).forEach((key) => {
        const value = data[key];
        if (value !== null && value !== undefined) {
          filteredData[key] = value;
        }
      });

      // Ensure we have required fields
      if (!filteredData.id) {
        throw new Error(`${table} record must have an id`);
      }

      // Add timestamps
      filteredData.createdAt =
        filteredData.createdAt || new Date().toISOString();
      filteredData.updatedAt = new Date().toISOString();

      // Check for entity-specific required fields
      if (
        table === "doctors" &&
        !filteredData.firstName &&
        !filteredData.lastName
      ) {
        throw new Error("Doctor must have at least firstName or lastName");
      }
      if (
        (table === "hospitals" || table === "pharmacies") &&
        !filteredData.name
      ) {
        throw new Error(`${table.slice(0, -1)} must have a name`);
      }
      if (table === "medications" && !filteredData.drugName) {
        throw new Error("Medication must have a drugName");
      }
      if (table === "allergies" && !filteredData.allergy) {
        throw new Error("Allergy must have an allergy field");
      }
      if (table === "insurance" && !filteredData.providerName) {
        throw new Error("Insurance must have a providerName");
      }

      const columns = Object.keys(filteredData).join(", ");
      const placeholders = Object.keys(filteredData)
        .map(() => "?")
        .join(", ");
      const values = Object.values(filteredData);

      const query = `INSERT INTO ${table} (${columns}) VALUES (${placeholders})`;
      console.log(`Executing query: ${query}`, values);
      const result = await this.db.runAsync(query, values);

      // Sync to Firebase if auto-sync is enabled
      if (this.autoSyncEnabled) {
        await firebaseSyncService.syncItemToFirebase(
          table,
          filteredData,
          this.userId
        );
      }

      return result;
    } catch (error) {
      console.error(`Error inserting into ${table}:`, error);
      console.error(`Data being inserted:`, data);
      throw error;
    }
  }

  async update(table, id, data) {
    try {
      // Only filter out null and undefined values, allow empty strings
      const filteredData = {};
      Object.keys(data).forEach((key) => {
        const value = data[key];
        if (value !== null && value !== undefined) {
          filteredData[key] = value;
        }
      });

      // If no valid data to update, skip the operation
      if (Object.keys(filteredData).length === 0) {
        console.warn(`No valid data to update for ${table} with id ${id}`);
        return { changes: 0 };
      }

      // Add updated timestamp
      filteredData.updatedAt = new Date().toISOString();

      const setPairs = Object.keys(filteredData)
        .map((key) => `${key} = ?`)
        .join(", ");
      const values = [...Object.values(filteredData), id];

      const query = `UPDATE ${table} SET ${setPairs} WHERE id = ?`;
      console.log(`Executing update query: ${query}`, values);
      const result = await this.db.runAsync(query, values);

      // Get the updated record for Firebase sync
      if (this.autoSyncEnabled && result.changes > 0) {
        const updatedRecord = await this.getById(table, id);
        if (updatedRecord) {
          await firebaseSyncService.syncItemToFirebase(
            table,
            updatedRecord,
            this.userId
          );
        }
      }

      return result;
    } catch (error) {
      console.error(`Error updating ${table}:`, error);
      console.error(`Data being updated:`, data);
      throw error;
    }
  }

  async delete(table, id) {
    try {
      const query = `DELETE FROM ${table} WHERE id = ?`;
      const result = await this.db.runAsync(query, [id]);

      // Sync deletion to Firebase if auto-sync is enabled
      if (this.autoSyncEnabled && result.changes > 0) {
        await firebaseSyncService.deleteItemFromFirebase(
          table,
          id,
          this.userId
        );
      }

      return result;
    } catch (error) {
      console.error(`Error deleting from ${table}:`, error);
      throw error;
    }
  }

  async getAll(table) {
    try {
      const query = `SELECT * FROM ${table} ORDER BY created_at DESC`;
      const result = await this.db.getAllAsync(query);
      return result;
    } catch (error) {
      console.error(`Error getting all from ${table}:`, error);
      throw error;
    }
  }

  async getById(table, id) {
    try {
      const query = `SELECT * FROM ${table} WHERE id = ?`;
      const result = await this.db.getFirstAsync(query, [id]);
      return result;
    } catch (error) {
      console.error(`Error getting by id from ${table}:`, error);
      throw error;
    }
  }

  // Specific methods for each entity type
  async getContacts() {
    return await this.getAll("contacts");
  }

  async addContact(contact) {
    return await this.insert("contacts", contact);
  }

  async updateContact(id, contact) {
    return await this.update("contacts", id, contact);
  }

  async deleteContact(id) {
    return await this.delete("contacts", id);
  }

  async getDoctors() {
    return await this.getAll("doctors");
  }

  async addDoctor(doctor) {
    return await this.insert("doctors", doctor);
  }

  async updateDoctor(id, doctor) {
    return await this.update("doctors", id, doctor);
  }

  async deleteDoctor(id) {
    return await this.delete("doctors", id);
  }

  async getHospitals() {
    return await this.getAll("hospitals");
  }

  async addHospital(hospital) {
    return await this.insert("hospitals", hospital);
  }

  async updateHospital(id, hospital) {
    return await this.update("hospitals", id, hospital);
  }

  async deleteHospital(id) {
    return await this.delete("hospitals", id);
  }

  async getPharmacies() {
    return await this.getAll("pharmacies");
  }

  async addPharmacy(pharmacy) {
    return await this.insert("pharmacies", pharmacy);
  }

  async updatePharmacy(id, pharmacy) {
    return await this.update("pharmacies", id, pharmacy);
  }

  async deletePharmacy(id) {
    return await this.delete("pharmacies", id);
  }

  async getMedications() {
    return await this.getAll("medications");
  }

  async addMedication(medication) {
    return await this.insert("medications", medication);
  }

  async updateMedication(id, medication) {
    return await this.update("medications", id, medication);
  }

  async deleteMedication(id) {
    return await this.delete("medications", id);
  }

  async getInsurance() {
    return await this.getAll("insurance");
  }

  async addInsurance(insurance) {
    return await this.insert("insurance", insurance);
  }

  async updateInsurance(id, insurance) {
    return await this.update("insurance", id, insurance);
  }

  async deleteInsurance(id) {
    return await this.delete("insurance", id);
  }

  async getAllergies() {
    return await this.getAll("allergies");
  }

  async addAllergy(allergy) {
    return await this.insert("allergies", allergy);
  }

  async updateAllergy(id, allergy) {
    return await this.update("allergies", id, allergy);
  }

  async deleteAllergy(id) {
    return await this.delete("allergies", id);
  }

  async getMedicalHistory() {
    return await this.getAll("medical_history");
  }

  async addMedicalHistory(history) {
    return await this.insert("medical_history", history);
  }

  async updateMedicalHistory(id, history) {
    return await this.update("medical_history", id, history);
  }

  async deleteMedicalHistory(id) {
    return await this.delete("medical_history", id);
  }

  async getMedicalDevices() {
    return await this.getAll("medical_devices");
  }

  async addMedicalDevice(device) {
    return await this.insert("medical_devices", device);
  }

  async updateMedicalDevice(id, device) {
    return await this.update("medical_devices", id, device);
  }

  async deleteMedicalDevice(id) {
    return await this.delete("medical_devices", id);
  }

  // Method to clear all data from all tables
  async clearAllData() {
    try {
      // Drop and recreate all tables to ensure latest schema
      await this.dropAndRecreateAllTables();

      // Also clear Firebase data if online
      if (this.autoSyncEnabled) {
        const isOnline = await firebaseSyncService.checkConnection();
        if (isOnline) {
          await this.clearFirebaseData();
        }
      }

      console.log(
        "All data cleared successfully and tables recreated with latest schema"
      );
    } catch (error) {
      console.error("Error clearing data:", error);
      throw error;
    }
  }

  /**
   * Clear all user data from Firebase
   */
  async clearFirebaseData() {
    try {
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
        const data = await this.getAll(table); // Should be empty after clearAllData
        await firebaseSyncService.syncTableToFirebase(table, data, this.userId);
      }

      console.log("Firebase data cleared");
    } catch (error) {
      console.error("Error clearing Firebase data:", error);
    }
  }

  /**
   * Get sync status
   */
  async getSyncStatus() {
    const isOnline = await firebaseSyncService.checkConnection();
    return {
      isOnline,
      autoSyncEnabled: this.autoSyncEnabled,
      pendingOperations: firebaseSyncService.pendingOperations.length,
      userId: this.userId,
    };
  }

  /**
   * Toggle auto-sync
   */
  setAutoSync(enabled) {
    this.autoSyncEnabled = enabled;
    console.log(`Auto-sync ${enabled ? "enabled" : "disabled"}`);
  }

  /**
   * Set user ID for Firebase sync
   */
  setUserId(userId) {
    this.userId = userId;
    console.log(`User ID set to: ${userId}`);
  }

  // Migration method to populate database with sample data
  async populateSampleData() {
    try {
      // Check if data already exists
      const contacts = await this.getContacts();
      if (contacts.length > 0) {
        console.log("Sample data already exists, skipping population");
        return;
      }

      console.log("Populating database with sample data...");

      // Add sample data here - we'll populate this based on your existing GlobalStateContext data
      // This will be called once when the database is first created

      console.log("Sample data populated successfully");
    } catch (error) {
      console.error("Error populating sample data:", error);
    }
  }
}

// Create singleton instance
const databaseService = new DatabaseService();

export default databaseService;
