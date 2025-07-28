/**
 * ACS5413 - Form Input
 * Dewayne Hafenstein - HAFE0010
 *
 * This screen displays a list of hospitals, allowing the user to add, edit, and delete hospitals.
 * It operates similarly to the ContactsScreen and DoctorsScreen but with hospital-specific fields
 * including name, address, phone number, and network status. Each hospital entry includes a
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
import HospitalForm from "../forms/HospitalForm";
import Hospital from "../models/Hospital";

/**
 *
 * @returns The HospitalScreen component, which displays a list of hospitals.
 * It allows the user to add, edit, and delete hospitals using a modal form.
 */
export default function HospitalScreen() {
  const { hospitals, setHospitals } = useGlobalState();
  const [formVisible, setFormVisible] = React.useState(false);
  const [editingHospital, setEditingHospital] = React.useState(null);
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

  const handleAddHospital = () => {
    setEditingHospital(null);
    setFormVisible(true);
  };

  const handleSaveHospital = (form) => {
    if (editingHospital) {
      // Update existing hospital
      setHospitals((prev) =>
        prev.map((h) =>
          h.id === editingHospital.id
            ? new Hospital({ ...h, ...form, id: editingHospital.id })
            : h
        )
      );
    } else {
      // Add new hospital
      const newHospital = new Hospital({
        id: Date.now().toString(),
        ...form,
      });
      setHospitals((prev) => [...prev, newHospital]);
    }
    setFormVisible(false);
    setEditingHospital(null);
  };

  const handleEditHospital = (hospital) => {
    setEditingHospital(hospital);
    setFormVisible(true);
  };

  const handleDeleteHospital = (form) => {
    setHospitals((prev) =>
      prev.filter((h) => h.id !== (form.id || editingHospital.id))
    );
    setFormVisible(false);
    setEditingHospital(null);
  };

  const handleMapPress = (hospital) => {
    // Placeholder for future map functionality
    Alert.alert(
      "Map Feature",
      `Map functionality will be added later to show the location of ${hospital.name}`
    );
  };

  // Sort hospitals alphabetically by name
  const sortedHospitals = [...(hospitals || [])].sort((a, b) => {
    const aName = a.name || "";
    const bName = b.name || "";
    return aName.localeCompare(bName);
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.header}>Hospitals</Text>
        <TouchableOpacity style={styles.addBtn} onPress={handleAddHospital}>
          <Ionicons name="add-circle" size={48} color="#007AFF" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={sortedHospitals}
        keyExtractor={(item) => item.id}
        numColumns={numColumns}
        renderItem={({ item }) => {
          const hospital = item instanceof Hospital ? item : new Hospital(item);
          return (
            <TouchableOpacity
              style={[styles.hospitalRow, { flex: 1 / numColumns }]}
              onPress={() => handleEditHospital(item)}
            >
              <View style={styles.hospitalInfo}>
                <Text style={styles.hospitalName}>
                  {hospital.name || "Unknown Hospital"}
                </Text>
                <Text style={styles.hospitalPhone}>
                  {hospital.getDisplayPhone() || "No phone"}
                </Text>
                {hospital.getFullAddress() && (
                  <Text style={styles.hospitalAddress} numberOfLines={2}>
                    {hospital.getFullAddress()}
                  </Text>
                )}
                <Text
                  style={[
                    styles.networkStatus,
                    { color: hospital.inNetwork ? "#28a745" : "#dc3545" },
                  ]}
                >
                  {hospital.getNetworkStatus()}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.mapButton}
                onPress={() => handleMapPress(hospital)}
              >
                <Ionicons name="map" size={20} color="#007AFF" />
              </TouchableOpacity>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No hospitals found.</Text>
        }
        contentContainerStyle={{ paddingBottom: 24 }}
      />
      <HospitalForm
        visible={formVisible}
        onClose={() => {
          setFormVisible(false);
          setEditingHospital(null);
        }}
        onSave={handleSaveHospital}
        onDelete={editingHospital ? handleDeleteHospital : undefined}
        initialValues={editingHospital}
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
  hospitalRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eeeeee",
    minHeight: 90,
  },
  hospitalInfo: {
    flex: 1,
    marginRight: 12,
  },
  hospitalName: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 2,
  },
  hospitalPhone: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
  hospitalAddress: {
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
