/**
 * ACS5413 - Form Input
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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useGlobalState } from "../context/GlobalStateContext";
import PharmacyForm from "../forms/PharmacyForm";
import Pharmacy from "../models/Pharmacy";

/**
 *
 * @returns The PharmacyScreen component, which displays a list of pharmacies.
 * It allows the user to add, edit, and delete pharmacies using a modal form.
 */
export default function PharmacyScreen() {
  const { pharmacies, setPharmacies } = useGlobalState();
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

  const handleSavePharmacy = (form) => {
    if (editingPharmacy) {
      // Update existing pharmacy
      setPharmacies((prev) =>
        prev.map((p) =>
          p.id === editingPharmacy.id
            ? new Pharmacy({ ...p, ...form, id: editingPharmacy.id })
            : p
        )
      );
    } else {
      // Add new pharmacy
      const newPharmacy = new Pharmacy({
        id: Date.now().toString(),
        ...form,
      });
      setPharmacies((prev) => [...prev, newPharmacy]);
    }
    setFormVisible(false);
    setEditingPharmacy(null);
  };

  const handleEditPharmacy = (pharmacy) => {
    setEditingPharmacy(pharmacy);
    setFormVisible(true);
  };

  const handleDeletePharmacy = (form) => {
    setPharmacies((prev) =>
      prev.filter((p) => p.id !== (form.id || editingPharmacy.id))
    );
    setFormVisible(false);
    setEditingPharmacy(null);
  };

  const handleMapPress = (pharmacy) => {
    // Placeholder for future map functionality
    Alert.alert(
      "Map Feature",
      `Map functionality will be added later to show the location of ${pharmacy.name}`
    );
  };

  // Sort pharmacies alphabetically by name
  const sortedPharmacies = [...(pharmacies || [])].sort((a, b) => {
    const aName = a.name || "";
    const bName = b.name || "";
    return aName.localeCompare(bName);
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.header}>Pharmacies</Text>
        <TouchableOpacity style={styles.addBtn} onPress={handleAddPharmacy}>
          <Ionicons name="add-circle" size={48} color="#007AFF" />
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
              <TouchableOpacity
                style={styles.mapButton}
                onPress={() => handleMapPress(pharmacy)}
              >
                <Ionicons name="map" size={20} color="#007AFF" />
              </TouchableOpacity>
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
  container: { flex: 1, backgroundColor: "#ffffff" },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  header: { fontSize: 28, fontWeight: "bold" },
  addBtn: { marginLeft: 12 },
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
    padding: 8,
    borderRadius: 4,
    backgroundColor: "#f0f0f0",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 32,
    color: "#888888",
    fontSize: 16,
  },
});
