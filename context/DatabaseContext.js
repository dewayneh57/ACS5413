/**
 * ACS5413 - Personal Health Management
 * Dewayne Hafenstein - HAFE0010
 *
 * DatabaseContext - React Context for SQLite database operations
 * Provides database operations to all components via hooks
 */

import React, { createContext, useContext, useEffect, useState } from "react";
import databaseService from "../services/DatabaseService";
import medicationNotificationService from "../services/MedicationNotificationService";
import Contact from "../models/Contact";
import Doctor from "../models/Doctor";
import Hospital from "../models/Hospital";
import Pharmacy from "../models/Pharmacy";
import Medication from "../models/Medication";
import Insurance from "../models/Insurance";
import Allergy from "../models/Allergy";
import MedicalHistory from "../models/MedicalHistory";
import MedicalDevice from "../models/MedicalHistory";

const DatabaseContext = createContext();

export const DatabaseProvider = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [pharmacies, setPharmacies] = useState([]);
  const [medications, setMedications] = useState([]);
  const [insurance, setInsurance] = useState([]);
  const [allergies, setAllergies] = useState([]);
  const [medicalHistory, setMedicalHistory] = useState([]);
  const [medicalDevices, setMedicalDevices] = useState([]);

  useEffect(() => {
    initializeDatabase();
  }, []);

  const initializeDatabase = async () => {
    try {
      await databaseService.initDatabase();
      await loadAllData();
      setIsInitialized(true);
    } catch (error) {
      console.error("Failed to initialize database:", error);
    }
  };

  // Firebase sync methods
  const syncWithFirebase = async () => {
    try {
      const result = await databaseService.syncWithFirebase();
      if (result.success) {
        // Reload all data after successful sync
        await loadAllData();
      }
      return result;
    } catch (error) {
      console.error("Error syncing with Firebase:", error);
      return { success: false, message: error.message };
    }
  };

  const getSyncStatus = async () => {
    return await databaseService.getSyncStatus();
  };

  const setAutoSync = (enabled) => {
    databaseService.setAutoSync(enabled);
  };

  const setUserId = (userId) => {
    databaseService.setUserId(userId);
  };

  const loadAllData = async () => {
    try {
      const [
        contactsData,
        doctorsData,
        hospitalsData,
        pharmaciesData,
        medicationsData,
        insuranceData,
        allergiesData,
        historyData,
        devicesData,
      ] = await Promise.all([
        databaseService.getContacts(),
        databaseService.getDoctors(),
        databaseService.getHospitals(),
        databaseService.getPharmacies(),
        databaseService.getMedications(),
        databaseService.getInsurance(),
        databaseService.getAllergies(),
        databaseService.getMedicalHistory(),
        databaseService.getMedicalDevices(),
      ]);

      setContacts(contactsData.map((c) => new Contact(c)));
      setDoctors(doctorsData.map((d) => new Doctor(d)));
      setHospitals(hospitalsData.map((h) => new Hospital(h)));
      setPharmacies(pharmaciesData.map((p) => new Pharmacy(p)));
      const medicationModels = medicationsData.map((m) => new Medication(m));
      setMedications(medicationModels);
      setInsurance(insuranceData.map((i) => new Insurance(i)));
      setAllergies(allergiesData.map((a) => new Allergy(a)));
      setMedicalHistory(historyData.map((h) => new MedicalHistory(h)));
      setMedicalDevices(devicesData.map((d) => new MedicalDevice(d)));

      // Initialize medication notifications after loading medications
      if (medicationModels.length > 0) {
        try {
          await medicationNotificationService.updateMedicationNotifications(
            medicationModels
          );
        } catch (error) {
          console.error("Error initializing medication notifications:", error);
          // Don't throw - notifications are supplementary functionality
        }
      }

      // No sample data population - start with empty database
    } catch (error) {
      console.error("Failed to load data:", error);
    }
  };

  const populateInitialSampleData = async () => {
    // Sample data population removed - database starts empty
    console.log("No sample data to populate");
  };

  // Contact operations
  const addContact = async (contactData) => {
    try {
      await databaseService.addContact(contactData);
      const updatedContacts = await databaseService.getContacts();
      setContacts(updatedContacts.map((c) => new Contact(c)));
    } catch (error) {
      console.error("Error adding contact:", error);
    }
  };

  const updateContact = async (id, contactData) => {
    try {
      await databaseService.updateContact(id, contactData);
      const updatedContacts = await databaseService.getContacts();
      setContacts(updatedContacts.map((c) => new Contact(c)));
    } catch (error) {
      console.error("Error updating contact:", error);
    }
  };

  const deleteContact = async (id) => {
    try {
      await databaseService.deleteContact(id);
      const updatedContacts = await databaseService.getContacts();
      setContacts(updatedContacts.map((c) => new Contact(c)));
    } catch (error) {
      console.error("Error deleting contact:", error);
    }
  };

  // Doctor operations
  const addDoctor = async (doctorData) => {
    try {
      await databaseService.addDoctor(doctorData);
      const updatedDoctors = await databaseService.getDoctors();
      setDoctors(updatedDoctors.map((d) => new Doctor(d)));
    } catch (error) {
      console.error("Error adding doctor:", error);
    }
  };

  const updateDoctor = async (id, doctorData) => {
    try {
      await databaseService.updateDoctor(id, doctorData);
      const updatedDoctors = await databaseService.getDoctors();
      setDoctors(updatedDoctors.map((d) => new Doctor(d)));
    } catch (error) {
      console.error("Error updating doctor:", error);
    }
  };

  const deleteDoctor = async (id) => {
    try {
      await databaseService.deleteDoctor(id);
      const updatedDoctors = await databaseService.getDoctors();
      setDoctors(updatedDoctors.map((d) => new Doctor(d)));
    } catch (error) {
      console.error("Error deleting doctor:", error);
    }
  };

  // Hospital operations
  const addHospital = async (hospitalData) => {
    try {
      await databaseService.addHospital(hospitalData);
      const updatedHospitals = await databaseService.getHospitals();
      setHospitals(updatedHospitals.map((h) => new Hospital(h)));
    } catch (error) {
      console.error("Error adding hospital:", error);
    }
  };

  const updateHospital = async (id, hospitalData) => {
    try {
      await databaseService.updateHospital(id, hospitalData);
      const updatedHospitals = await databaseService.getHospitals();
      setHospitals(updatedHospitals.map((h) => new Hospital(h)));
    } catch (error) {
      console.error("Error updating hospital:", error);
    }
  };

  const deleteHospital = async (id) => {
    try {
      await databaseService.deleteHospital(id);
      const updatedHospitals = await databaseService.getHospitals();
      setHospitals(updatedHospitals.map((h) => new Hospital(h)));
    } catch (error) {
      console.error("Error deleting hospital:", error);
    }
  };

  // Pharmacy operations
  const addPharmacy = async (pharmacyData) => {
    try {
      await databaseService.addPharmacy(pharmacyData);
      const updatedPharmacies = await databaseService.getPharmacies();
      setPharmacies(updatedPharmacies.map((p) => new Pharmacy(p)));
    } catch (error) {
      console.error("Error adding pharmacy:", error);
    }
  };

  const updatePharmacy = async (id, pharmacyData) => {
    try {
      await databaseService.updatePharmacy(id, pharmacyData);
      const updatedPharmacies = await databaseService.getPharmacies();
      setPharmacies(updatedPharmacies.map((p) => new Pharmacy(p)));
    } catch (error) {
      console.error("Error updating pharmacy:", error);
    }
  };

  const deletePharmacy = async (id) => {
    try {
      await databaseService.deletePharmacy(id);
      const updatedPharmacies = await databaseService.getPharmacies();
      setPharmacies(updatedPharmacies.map((p) => new Pharmacy(p)));
    } catch (error) {
      console.error("Error deleting pharmacy:", error);
    }
  };

  // Allergy operations
  const addAllergy = async (allergyData) => {
    try {
      await databaseService.addAllergy(allergyData);
      const updatedAllergies = await databaseService.getAllergies();
      setAllergies(updatedAllergies.map((a) => new Allergy(a)));
    } catch (error) {
      console.error("Error adding allergy:", error);
    }
  };

  const updateAllergy = async (id, allergyData) => {
    try {
      await databaseService.updateAllergy(id, allergyData);
      const updatedAllergies = await databaseService.getAllergies();
      setAllergies(updatedAllergies.map((a) => new Allergy(a)));
    } catch (error) {
      console.error("Error updating allergy:", error);
    }
  };

  const deleteAllergy = async (id) => {
    try {
      await databaseService.deleteAllergy(id);
      const updatedAllergies = await databaseService.getAllergies();
      setAllergies(updatedAllergies.map((a) => new Allergy(a)));
    } catch (error) {
      console.error("Error deleting allergy:", error);
    }
  };

  // Insurance operations
  const addInsurance = async (insuranceData) => {
    try {
      await databaseService.addInsurance(insuranceData);
      const updatedInsurance = await databaseService.getInsurance();
      setInsurance(updatedInsurance.map((i) => new Insurance(i)));
    } catch (error) {
      console.error("Error adding insurance:", error);
    }
  };

  const updateInsurance = async (id, insuranceData) => {
    try {
      await databaseService.updateInsurance(id, insuranceData);
      const updatedInsurance = await databaseService.getInsurance();
      setInsurance(updatedInsurance.map((i) => new Insurance(i)));
    } catch (error) {
      console.error("Error updating insurance:", error);
    }
  };

  const deleteInsurance = async (id) => {
    try {
      await databaseService.deleteInsurance(id);
      const updatedInsurance = await databaseService.getInsurance();
      setInsurance(updatedInsurance.map((i) => new Insurance(i)));
    } catch (error) {
      console.error("Error deleting insurance:", error);
    }
  };

  // Helper function to update medication notifications
  const updateMedicationNotifications = async () => {
    try {
      await medicationNotificationService.updateMedicationNotifications(
        medications
      );
    } catch (error) {
      console.error("Error updating medication notifications:", error);
      // Don't throw - notifications are supplementary functionality
    }
  };

  // Medication operations
  const addMedication = async (medicationData) => {
    try {
      await databaseService.addMedication(medicationData);
      const updatedMedications = await databaseService.getMedications();
      const medicationModels = updatedMedications.map((m) => new Medication(m));
      setMedications(medicationModels);

      // Update notifications with the new medication list
      await medicationNotificationService.updateMedicationNotifications(
        medicationModels
      );
    } catch (error) {
      console.error("Error adding medication:", error);
    }
  };

  const updateMedication = async (id, medicationData) => {
    try {
      await databaseService.updateMedication(id, medicationData);
      const updatedMedications = await databaseService.getMedications();
      const medicationModels = updatedMedications.map((m) => new Medication(m));
      setMedications(medicationModels);

      // Update notifications with the updated medication list
      await medicationNotificationService.updateMedicationNotifications(
        medicationModels
      );
    } catch (error) {
      console.error("Error updating medication:", error);
    }
  };

  const deleteMedication = async (id) => {
    try {
      await databaseService.deleteMedication(id);
      const updatedMedications = await databaseService.getMedications();
      const medicationModels = updatedMedications.map((m) => new Medication(m));
      setMedications(medicationModels);

      // Update notifications with the updated medication list
      await medicationNotificationService.updateMedicationNotifications(
        medicationModels
      );
    } catch (error) {
      console.error("Error deleting medication:", error);
    }
  };

  // Medical History operations
  const addMedicalHistory = async (historyData) => {
    try {
      await databaseService.addMedicalHistory(historyData);
      const updatedHistory = await databaseService.getMedicalHistory();
      setMedicalHistory(updatedHistory.map((h) => new MedicalHistory(h)));
    } catch (error) {
      console.error("Error adding medical history:", error);
    }
  };

  const updateMedicalHistory = async (id, historyData) => {
    try {
      await databaseService.updateMedicalHistory(id, historyData);
      const updatedHistory = await databaseService.getMedicalHistory();
      setMedicalHistory(updatedHistory.map((h) => new MedicalHistory(h)));
    } catch (error) {
      console.error("Error updating medical history:", error);
    }
  };

  const deleteMedicalHistory = async (id) => {
    try {
      await databaseService.deleteMedicalHistory(id);
      const updatedHistory = await databaseService.getMedicalHistory();
      setMedicalHistory(updatedHistory.map((h) => new MedicalHistory(h)));
    } catch (error) {
      console.error("Error deleting medical history:", error);
    }
  };

  const value = {
    isInitialized,
    // Data
    contacts,
    doctors,
    hospitals,
    pharmacies,
    medications,
    insurance,
    allergies,
    medicalHistory,
    medicalDevices,
    // Contact operations
    addContact,
    updateContact,
    deleteContact,
    // Doctor operations
    addDoctor,
    updateDoctor,
    deleteDoctor,
    // Hospital operations
    addHospital,
    updateHospital,
    deleteHospital,
    // Pharmacy operations
    addPharmacy,
    updatePharmacy,
    deletePharmacy,
    // Allergy operations
    addAllergy,
    updateAllergy,
    deleteAllergy,
    // Insurance operations
    addInsurance,
    updateInsurance,
    deleteInsurance,
    // Medication operations
    addMedication,
    updateMedication,
    deleteMedication,
    // Medical History operations
    addMedicalHistory,
    updateMedicalHistory,
    deleteMedicalHistory,
    // Data management operations
    clearAllData: async () => {
      try {
        await databaseService.clearAllData();
        // Cancel all medication notifications since all data is cleared
        await medicationNotificationService.cancelAllMedicationNotifications();
        await loadAllData(); // Reload to reflect cleared state
      } catch (error) {
        console.error("Error clearing all data:", error);
      }
    },
    // Firebase sync operations
    syncWithFirebase,
    getSyncStatus,
    setAutoSync,
    setUserId,
    // Medication notification operations
    getScheduledMedicationNotifications: () =>
      medicationNotificationService.getScheduledMedicationNotifications(),
    cancelAllMedicationNotifications: () =>
      medicationNotificationService.cancelAllMedicationNotifications(),
    updateMedicationNotifications: () => updateMedicationNotifications(),
    // Legacy setters for compatibility (these will be replaced)
    setContacts: (contacts) => setContacts(contacts),
    setDoctors: (doctors) => setDoctors(doctors),
    setHospitals: (hospitals) => setHospitals(hospitals),
    setPharmacies: (pharmacies) => setPharmacies(pharmacies),
    setMedications: (medications) => setMedications(medications),
    setInsurance: (insurance) => setInsurance(insurance),
    setAllergies: (allergies) => setAllergies(allergies),
    setMedicalHistory: (history) => setMedicalHistory(history),
  };

  return (
    <DatabaseContext.Provider value={value}>
      {children}
    </DatabaseContext.Provider>
  );
};

export const useDatabase = () => {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error("useDatabase must be used within a DatabaseProvider");
  }
  return context;
};
