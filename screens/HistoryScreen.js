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
import MedicalHistoryForm from "../forms/MedicalHistoryForm";
import { createMedicalHistoryItem } from "../models/MedicalHistory";

export default function HistoryScreen() {
  const {
    medicalHistory,
    addMedicalHistory,
    updateMedicalHistory,
    deleteMedicalHistory,
    isInitialized,
  } = useDatabase();
  // For now, we'll just display the data - full CRUD operations can be added later
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState("all");

  // Ensure medicalHistory is always an array
  const historyList = medicalHistory || [];

  const handleAddHistory = () => {
    setEditingItem(null);
    setIsFormVisible(true);
  };

  const handleEditHistory = (item) => {
    setEditingItem(item);
    setIsFormVisible(true);
  };

  const handleSaveHistory = async (historyData) => {
    try {
      if (editingItem) {
        // Update existing item
        const updatedData = {
          ...historyData,
          createdAt: editingItem.createdAt,
          updatedAt: new Date().toISOString(),
        };
        await updateMedicalHistory(editingItem.id, updatedData);
      } else {
        // Add new item
        const newItem = {
          id: Date.now().toString(),
          ...historyData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        await addMedicalHistory(newItem);
      }

      setIsFormVisible(false);
      setEditingItem(null);
    } catch (error) {
      console.error("Error saving medical history:", error);
      // You might want to show an error message to the user here
    }
  };

  const handleDeleteHistory = async (itemToDelete) => {
    try {
      await deleteMedicalHistory(itemToDelete.id);
      setIsFormVisible(false);
      setEditingItem(null);
    } catch (error) {
      console.error("Error deleting medical history:", error);
      // You might want to show an error message to the user here
    }
  };

  const getTypeIcon = (type) => {
    const icons = {
      surgery: "🔬",
      diagnosis: "📋",
      test: "🧪",
      illness: "🤒",
      injury: "🏥",
      immunization: "💉",
      device: "⚙️",
    };
    return icons[type] || "📄";
  };

  const getTypeColor = (type) => {
    const colors = {
      surgery: "#FF6B35",
      diagnosis: "#007AFF",
      test: "#32D74B",
      illness: "#FF3B30",
      injury: "#FF9500",
      immunization: "#30D158",
      device: "#8A2BE2",
    };
    return colors[type] || "#8E8E93";
  };

  const getFilteredHistory = () => {
    if (selectedFilter === "all") return historyList;
    return historyList.filter((item) => item.type === selectedFilter);
  };

  const filterOptions = [
    { label: "All", value: "all" },
    { label: "Surgery", value: "surgery" },
    { label: "Diagnosis", value: "diagnosis" },
    { label: "Tests", value: "test" },
    { label: "Illness", value: "illness" },
    { label: "Injury", value: "injury" },
    { label: "Immunization", value: "immunization" },
    { label: "Devices", value: "device" },
  ];

  const renderFilterButton = (option) => (
    <TouchableOpacity
      key={option.value}
      style={[
        styles.filterButton,
        selectedFilter === option.value && styles.filterButtonActive,
      ]}
      onPress={() => setSelectedFilter(option.value)}
    >
      <Text
        style={[
          styles.filterButtonText,
          selectedFilter === option.value && styles.filterButtonTextActive,
        ]}
      >
        {option.label}
      </Text>
    </TouchableOpacity>
  );

  const renderHistoryItem = ({ item }) => (
    <TouchableOpacity
      style={styles.historyItem}
      onPress={() => handleEditHistory(item)}
    >
      <View style={styles.historyHeader}>
        <View style={styles.historyTitleRow}>
          <Text style={styles.historyIcon}>{getTypeIcon(item.type)}</Text>
          <View style={styles.historyTitleContainer}>
            <Text style={styles.historyTitle}>{item.getTitle()}</Text>
            <Text style={styles.historySubtitle}>{item.getSubtitle()}</Text>
          </View>
          <View
            style={[
              styles.typeBadge,
              { backgroundColor: getTypeColor(item.type) },
            ]}
          >
            <Text style={styles.typeBadgeText}>
              {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
            </Text>
          </View>
        </View>
        <Text style={styles.historyDate}>{item.getDisplayDate()}</Text>
      </View>

      {item.notes && (
        <View style={styles.notesContainer}>
          <Text style={styles.notesText} numberOfLines={2}>
            {item.notes}
          </Text>
        </View>
      )}

      {/* Special indicators */}
      {item.type === "immunization" && item.isDueForBooster?.() && (
        <View style={styles.warningBanner}>
          <Text style={styles.warningText}>⚠️ Booster Due</Text>
        </View>
      )}

      {item.type === "test" && item.isAbnormal?.() && (
        <View style={[styles.warningBanner, { backgroundColor: "#FF9500" }]}>
          <Text style={styles.warningText}>⚠️ Abnormal Result</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const filteredHistory = getFilteredHistory();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Medical History</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddHistory}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Filter buttons */}
      <View style={styles.filtersContainer}>
        <FlatList
          data={filterOptions}
          renderItem={({ item }) => renderFilterButton(item)}
          keyExtractor={(item) => item.value}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersContent}
        />
      </View>

      {filteredHistory.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            {selectedFilter === "all"
              ? "No medical history recorded"
              : `No ${selectedFilter} records found`}
          </Text>
          <Text style={styles.emptySubtext}>
            Tap the + button to add your first medical history entry
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredHistory}
          renderItem={renderHistoryItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}

      <MedicalHistoryForm
        visible={isFormVisible}
        onClose={() => {
          setIsFormVisible(false);
          setEditingItem(null);
        }}
        onSave={handleSaveHistory}
        onDelete={editingItem ? handleDeleteHistory : null}
        initialValues={editingItem}
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
  filtersContainer: {
    backgroundColor: "#fff",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e1e1e1",
  },
  filtersContent: {
    paddingHorizontal: 16,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: "#f0f0f0",
    marginRight: 8,
  },
  filterButtonActive: {
    backgroundColor: "#007AFF",
  },
  filterButtonText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  filterButtonTextActive: {
    color: "#fff",
  },
  listContainer: {
    padding: 16,
    paddingTop: 8,
  },
  historyItem: {
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
  historyHeader: {
    marginBottom: 8,
  },
  historyTitleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 4,
  },
  historyIcon: {
    fontSize: 20,
    marginRight: 12,
    marginTop: 2,
  },
  historyTitleContainer: {
    flex: 1,
    marginRight: 8,
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 2,
  },
  historySubtitle: {
    fontSize: 14,
    color: "#666",
    lineHeight: 18,
  },
  historyDate: {
    fontSize: 12,
    color: "#999",
    textAlign: "right",
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  typeBadgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  notesContainer: {
    marginTop: 8,
    padding: 12,
    backgroundColor: "#f8f9fa",
    borderRadius: 6,
  },
  notesText: {
    fontSize: 14,
    color: "#333",
    lineHeight: 18,
  },
  warningBanner: {
    backgroundColor: "#FF3B30",
    padding: 8,
    marginTop: 8,
    borderRadius: 6,
  },
  warningText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
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
