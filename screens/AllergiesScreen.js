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
import AllergyForm from "../forms/AllergyForm";
import Allergy from "../models/Allergy";

export default function AllergiesScreen() {
  const { allergies, addAllergy, updateAllergy, deleteAllergy, isInitialized } =
    useDatabase();
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingAllergy, setEditingAllergy] = useState(null);

  // Ensure allergies is always an array to prevent map errors
  const allergiesList = allergies || [];

  const handleAddAllergy = () => {
    setEditingAllergy(null);
    setIsFormVisible(true);
  };

  const handleEditAllergy = (allergy) => {
    setEditingAllergy(allergy);
    setIsFormVisible(true);
  };

  const handleSaveAllergy = async (allergyData) => {
    if (editingAllergy) {
      // Update existing allergy
      await updateAllergy(editingAllergy.id, allergyData);
    } else {
      // Add new allergy
      const newAllergy = {
        id: Date.now().toString(),
        ...allergyData,
      };
      await addAllergy(newAllergy);
    }
    setIsFormVisible(false);
    setEditingAllergy(null);
  };

  const handleDeleteAllergy = async (allergyToDelete) => {
    await deleteAllergy(allergyToDelete.id);
    setIsFormVisible(false);
    setEditingAllergy(null);
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "Life-threatening":
        return "#FF3B30";
      case "Severe":
        return "#FF6B35";
      case "Shock":
        return "#FF9500";
      case "Pain":
        return "#FFCC00";
      case "Discomfort":
        return "#34C759";
      case "Itching":
        return "#32D74B";
      case "Rash":
        return "#30D158";
      default:
        return "#8E8E93";
    }
  };

  const renderAllergyItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.allergyItem,
        item.isLifeThreatening() && styles.criticalAllergyItem,
      ]}
      onPress={() => handleEditAllergy(item)}
    >
      <View style={styles.allergyHeader}>
        <Text style={styles.allergyName}>{item.getDisplayName()}</Text>
        <View
          style={[
            styles.severityBadge,
            { backgroundColor: getSeverityColor(item.severity) },
          ]}
        >
          <Text style={styles.severityText}>
            {item.getSeverityInfo()}
            {item.isLifeThreatening() && " ⚠️"}
          </Text>
        </View>
      </View>

      {item.remediation && (
        <View style={styles.remediationContainer}>
          <Text style={styles.remediationLabel}>Treatment:</Text>
          <Text style={styles.remediationText}>{item.remediation}</Text>
        </View>
      )}

      {item.hasDescription() && (
        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionLabel}>Description:</Text>
          <Text style={styles.descriptionText} numberOfLines={3}>
            {item.description}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );

  // Show loading state while database initializes
  if (!isInitialized) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Allergies</Text>
        </View>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text>Loading...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Allergies</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddAllergy}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      {allergiesList.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No allergies recorded</Text>
          <Text style={styles.emptySubtext}>
            Tap the + button to add your first allergy
          </Text>
        </View>
      ) : (
        <>
          {allergiesList.some((allergy) => allergy.isLifeThreatening()) && (
            <View style={styles.warningBanner}>
              <Text style={styles.warningText}>
                ⚠️ You have critical allergies - inform all healthcare providers
              </Text>
            </View>
          )}
          <FlatList
            data={allergiesList}
            renderItem={renderAllergyItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
        </>
      )}

      <AllergyForm
        visible={isFormVisible}
        onClose={() => {
          setIsFormVisible(false);
          setEditingAllergy(null);
        }}
        onSave={handleSaveAllergy}
        onDelete={editingAllergy ? handleDeleteAllergy : null}
        initialValues={editingAllergy}
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
  warningBanner: {
    backgroundColor: "#FF3B30",
    padding: 12,
    margin: 16,
    marginBottom: 8,
    borderRadius: 8,
  },
  warningText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  listContainer: {
    padding: 16,
    paddingTop: 8,
  },
  allergyItem: {
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
  criticalAllergyItem: {
    borderLeftWidth: 4,
    borderLeftColor: "#FF3B30",
  },
  allergyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  allergyName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    flex: 1,
    marginRight: 8,
  },
  severityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  severityText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  remediationContainer: {
    marginTop: 8,
    padding: 12,
    backgroundColor: "#f8f9fa",
    borderRadius: 6,
  },
  remediationLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#666",
    marginBottom: 4,
  },
  remediationText: {
    fontSize: 14,
    color: "#333",
    lineHeight: 18,
  },
  descriptionContainer: {
    marginTop: 8,
    padding: 12,
    backgroundColor: "#f0f8ff",
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: "#007AFF",
  },
  descriptionLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#007AFF",
    marginBottom: 4,
  },
  descriptionText: {
    fontSize: 14,
    color: "#333",
    lineHeight: 18,
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
