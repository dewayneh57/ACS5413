import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from "react-native";
import { useDatabase } from "../context/DatabaseContext";
import InsuranceForm from "../forms/InsuranceForm";
import Insurance from "../models/Insurance";

export default function InsuranceScreen() {
  const {
    insurance,
    addInsurance,
    updateInsurance,
    deleteInsurance,
    isInitialized,
  } = useDatabase();
  // For now, we'll just display the data - full CRUD operations can be added later
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingInsurance, setEditingInsurance] = useState(null);

  // Ensure insurance is always an array to prevent map errors
  const insuranceList = insurance || [];

  const handleAddInsurance = () => {
    setEditingInsurance(null);
    setIsFormVisible(true);
  };

  const handleEditInsurance = (insuranceItem) => {
    setEditingInsurance(insuranceItem);
    setIsFormVisible(true);
  };

  const handleSaveInsurance = async (insuranceData) => {
    try {
      if (editingInsurance) {
        // Update existing insurance
        await updateInsurance(editingInsurance.id, insuranceData);
      } else {
        // Add new insurance
        const newInsurance = {
          id: Date.now().toString(),
          ...insuranceData,
        };
        await addInsurance(newInsurance);
      }

      setIsFormVisible(false);
      setEditingInsurance(null);
    } catch (error) {
      console.error("Error saving insurance:", error);
      // You might want to show an error message to the user here
    }
  };

  const handleDeleteInsurance = async (insuranceToDelete) => {
    try {
      await deleteInsurance(insuranceToDelete.id);
      setIsFormVisible(false);
      setEditingInsurance(null);
    } catch (error) {
      console.error("Error deleting insurance:", error);
      // You might want to show an error message to the user here
    }
  };

  const renderPhoneNumbers = (insuranceItem) => {
    const phones = insuranceItem.getAllPhoneNumbers() || [];
    return phones.slice(0, 3).map((phone, index) => (
      <Text key={index} style={styles.phoneNumber}>
        {phone.type}: {phone.number}
      </Text>
    ));
  };

  const renderInsuranceItem = ({ item }) => {
    // Safety check to ensure item is valid
    if (!item) return null;

    return (
      <TouchableOpacity
        style={styles.insuranceItem}
        onPress={() => handleEditInsurance(item)}
      >
        <View style={styles.insuranceHeader}>
          <Text style={styles.providerName}>{item.getDisplayName()}</Text>
          <Text style={styles.policyInfo}>{item.getPolicyInfo()}</Text>
        </View>

        {item.agentName && (
          <Text style={styles.agentInfo}>Agent: {item.agentName}</Text>
        )}

        {item.getAgentFullAddress() && (
          <Text style={styles.address}>{item.getAgentFullAddress()}</Text>
        )}

        <View style={styles.phoneContainer}>{renderPhoneNumbers(item)}</View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Insurance</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddInsurance}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      {insuranceList.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No insurance policies recorded</Text>
          <Text style={styles.emptySubtext}>
            Tap the + button to add your first insurance policy
          </Text>
        </View>
      ) : (
        <FlatList
          data={insuranceList}
          renderItem={renderInsuranceItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}

      <InsuranceForm
        visible={isFormVisible}
        onClose={() => {
          setIsFormVisible(false);
          setEditingInsurance(null);
        }}
        onSave={handleSaveInsurance}
        onDelete={editingInsurance ? handleDeleteInsurance : null}
        initialValues={editingInsurance}
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
  insuranceItem: {
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
  insuranceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  providerName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    flex: 1,
    marginRight: 8,
  },
  policyInfo: {
    fontSize: 12,
    color: "#007AFF",
    fontWeight: "500",
  },
  agentInfo: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
    fontWeight: "500",
  },
  address: {
    fontSize: 12,
    color: "#888",
    marginBottom: 8,
  },
  phoneContainer: {
    marginTop: 4,
  },
  phoneNumber: {
    fontSize: 12,
    color: "#666",
    marginBottom: 2,
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
