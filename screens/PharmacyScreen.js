/**
 * ACS5413 - Personal Health Management
 * Dewayne Hafenstein - HAFE0010
 *
 * This screen displays a list of pharmacies, allowing the user to add, edit, and delete pharmacies.
 * It operates similarly to the ContactsScreen, DoctorsScreen, and HospitalScreen but with pharmacy-specific
 * fields including name, address, phone number, and network status. Each pharmacy entry includes a
 * placeholder for future map functionality.
 */
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  Dimensions,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useDatabase } from "../context/DatabaseContext";
import PharmacyForm from "../forms/PharmacyForm";
import Pharmacy from "../models/Pharmacy";
import MapButton from "../components/MapButton";

/**
 *
 * @returns The PharmacyScreen component, which displays a list of pharmacies.
 * It allows the user to add, edit, and delete pharmacies using a modal form.
 */
export default function PharmacyScreen() {
  const {
    pharmacies,
    addPharmacy,
    updatePharmacy,
    deletePharmacy,
    isInitialized,
  } = useDatabase();
  const [formVisible, setFormVisible] = React.useState(false);
  const [editingPharmacy, setEditingPharmacy] = React.useState(null);
  const [windowWidth, setWindowWidth] = useState(
    Dimensions.get("window").width
  );

  useEffect(() => {
    const onChange = ({ window }) => setWindowWidth(window.width);
    const sub = Dimensions.addEventListener("change", onChange);
    return () => {
      if (sub?.remove) sub.remove();
      else Dimensions.removeEventListener("change", onChange);
    };
  }, []);
  const isPortrait = windowWidth < 500;
  const numColumns = isPortrait ? 1 : 2;

  const handleAddPharmacy = () => {
    setEditingPharmacy(null);
    setFormVisible(true);
  };

  const handleSavePharmacy = async (form) => {
    if (editingPharmacy) {
      // Update existing pharmacy
      await updatePharmacy(editingPharmacy.id, form);
    } else {
      // Add new pharmacy
      const newPharmacy = {
        id: Date.now().toString(),
        ...form,
      };
      await addPharmacy(newPharmacy);
    }
    setFormVisible(false);
    setEditingPharmacy(null);
  };

  const handleEditPharmacy = (pharmacy) => {
    setEditingPharmacy(pharmacy);
    setFormVisible(true);
  };

  const handleDeletePharmacy = async (form) => {
    await deletePharmacy(form.id || editingPharmacy.id);
    setFormVisible(false);
    setEditingPharmacy(null);
  };

  // Show loading state while database initializes
  if (!isInitialized) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Pharmacies</Text>
        </View>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Sort pharmacies alphabetically by name
  const sortedPharmacies = [...(pharmacies || [])].sort((a, b) => {
    const aName = a.name || "";
    const bName = b.name || "";
    return aName.localeCompare(bName);
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Pharmacies</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddPharmacy}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={sortedPharmacies}
        keyExtractor={(item) => item.id}
        numColumns={numColumns}
        renderItem={({ item }) => {
          const pharmacy = item instanceof Pharmacy ? item : new Pharmacy(item);
          return (
            <TouchableOpacity
              style={[styles.pharmacyRow, { flex: 1 / numColumns }]}
              onPress={() => handleEditPharmacy(item)}
            >
              <View style={styles.pharmacyInfo}>
                <Text style={styles.pharmacyName}>
                  {pharmacy.name || "Unknown Pharmacy"}
                </Text>
                <Text style={styles.pharmacyPhone}>
                  {pharmacy.getDisplayPhone() || "No phone"}
                </Text>
                {pharmacy.getFullAddress() && (
                  <Text style={styles.pharmacyAddress} numberOfLines={2}>
                    {pharmacy.getFullAddress()}
                  </Text>
                )}
                <Text
                  style={[
                    styles.networkStatus,
                    { color: pharmacy.inNetwork ? "#28a745" : "#dc3545" },
                  ]}
                >
                  {pharmacy.getNetworkStatus()}
                </Text>
              </View>
              <MapButton
                address={pharmacy.getFullAddress()}
                entityName="pharmacy"
                entityTitle={pharmacy.name || "Unknown Pharmacy"}
                style={styles.mapButton}
                width={80}
                height={60}
                zoom={16}
              />
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No pharmacies found.</Text>
        }
        contentContainerStyle={{ paddingBottom: 24 }}
      />
      <PharmacyForm
        visible={formVisible}
        onClose={() => {
          setFormVisible(false);
          setEditingPharmacy(null);
        }}
        onSave={handleSavePharmacy}
        onDelete={editingPharmacy ? handleDeletePharmacy : undefined}
        initialValues={editingPharmacy}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
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
  pharmacyRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eeeeee",
    minHeight: 90,
  },
  pharmacyInfo: {
    flex: 1,
    marginRight: 12,
  },
  pharmacyName: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 2,
  },
  pharmacyPhone: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
  pharmacyAddress: {
    fontSize: 14,
    color: "#888",
    fontStyle: "italic",
    marginBottom: 4,
  },
  networkStatus: {
    fontSize: 14,
    fontWeight: "600",
  },
  mapButton: {
    marginLeft: 8,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 32,
    color: "#888888",
    fontSize: 16,
  },
});
