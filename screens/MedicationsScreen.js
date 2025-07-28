import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from "react-native";
import { useGlobalState } from "../context/GlobalStateContext";
import MedicationForm from "../forms/MedicationForm";
import Medication from "../models/Medication";

export default function MedicationsScreen() {
  const { medications, setMedications } = useGlobalState();
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingMedication, setEditingMedication] = useState(null);

  // Ensure medications is always an array to prevent map errors
  const medicationsList = medications || [];

  const handleAddMedication = () => {
    setEditingMedication(null);
    setIsFormVisible(true);
  };

  const handleEditMedication = (medication) => {
    setEditingMedication(medication);
    setIsFormVisible(true);
  };

  const handleSaveMedication = (medicationData) => {
    let updatedMedications;

    if (editingMedication) {
      // Update existing medication
      updatedMedications = medicationsList.map((med) =>
        med.id === editingMedication.id
          ? new Medication({ ...medicationData, id: editingMedication.id })
          : med
      );
    } else {
      // Add new medication
      const newMedication = new Medication(medicationData);
      updatedMedications = [...medicationsList, newMedication];
    }

    setMedications(updatedMedications);
    setIsFormVisible(false);
    setEditingMedication(null);
  };

  const handleDeleteMedication = (medicationToDelete) => {
    const updatedMedications = medicationsList.filter(
      (med) => med.id !== medicationToDelete.id
    );
    setMedications(updatedMedications);
    setIsFormVisible(false);
    setEditingMedication(null);
  };

  const renderMedicationItem = ({ item }) => (
    <TouchableOpacity
      style={styles.medicationItem}
      onPress={() => handleEditMedication(item)}
    >
      <View style={styles.medicationHeader}>
        <Text style={styles.drugName}>{item.getDisplayName()}</Text>
        <Text style={styles.doseInfo}>{item.getDoseInfo()}</Text>
      </View>
      <Text style={styles.dosingInstructions}>{item.dosingInstructions}</Text>
      {item.rxNumber && <Text style={styles.rxInfo}>{item.getRxInfo()}</Text>}
      {item.manufacturer && (
        <Text style={styles.manufacturer}>Made by: {item.manufacturer}</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Medications</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddMedication}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      {medicationsList.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No medications recorded</Text>
          <Text style={styles.emptySubtext}>
            Tap the + button to add your first medication
          </Text>
        </View>
      ) : (
        <FlatList
          data={medicationsList}
          renderItem={renderMedicationItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}

      <MedicationForm
        visible={isFormVisible}
        onClose={() => {
          setIsFormVisible(false);
          setEditingMedication(null);
        }}
        onSave={handleSaveMedication}
        onDelete={editingMedication ? handleDeleteMedication : null}
        initialValues={editingMedication}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "#007AFF",
    paddingTop: StatusBar.currentHeight || 44,
    paddingBottom: 16,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  addButton: {
    backgroundColor: "rgba(255,255,255,0.2)",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "300",
  },
  listContainer: {
    padding: 16,
  },
  medicationItem: {
    backgroundColor: "#fff",
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  medicationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  drugName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    flex: 1,
    marginRight: 8,
  },
  doseInfo: {
    fontSize: 16,
    fontWeight: "500",
    color: "#007AFF",
  },
  dosingInstructions: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
    fontStyle: "italic",
  },
  rxInfo: {
    fontSize: 12,
    color: "#888",
    marginBottom: 2,
  },
  manufacturer: {
    fontSize: 12,
    color: "#888",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#666",
    marginBottom: 8,
    textAlign: "center",
  },
  emptySubtext: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
    lineHeight: 22,
  },
});
