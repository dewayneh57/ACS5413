/**
 * ACS5413 - Personal Health Management
 * Dewayne Hafenstein - HAFE0010
 *
 * This screen displays a list of doctors, allowing the user to add, edit, and delete doctors.
 * It operates similarly to the ContactsScreen but with doctor-specific fields including
 * name, specialty, address, and phone number. Each doctor entry includes a placeholder
 * for future map functionality.
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
import DoctorForm from "../forms/DoctorForm";
import Doctor from "../models/Doctor";
import MapButton from "../components/MapButton";

/**
 *
 * @returns The DoctorsScreen component, which displays a list of doctors.
 * It allows the user to add, edit, and delete doctors using a modal form.
 */
export default function DoctorsScreen() {
  const { doctors, addDoctor, updateDoctor, deleteDoctor, isInitialized } =
    useDatabase();
  const [formVisible, setFormVisible] = React.useState(false);
  const [editingDoctor, setEditingDoctor] = React.useState(null);
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

  const handleAddDoctor = () => {
    setEditingDoctor(null);
    setFormVisible(true);
  };

  const handleSaveDoctor = async (form) => {
    if (editingDoctor) {
      // Update existing doctor
      await updateDoctor(editingDoctor.id, form);
    } else {
      // Add new doctor
      const newDoctor = {
        id: Date.now().toString(),
        ...form,
      };
      await addDoctor(newDoctor);
    }
    setFormVisible(false);
    setEditingDoctor(null);
  };

  const handleEditDoctor = (doctor) => {
    setEditingDoctor(doctor);
    setFormVisible(true);
  };

  const handleDeleteDoctor = async (form) => {
    await deleteDoctor(form.id || editingDoctor.id);
    setFormVisible(false);
    setEditingDoctor(null);
  };

  // Sort doctors alphabetically by last name, fallback to first name
  const sortedDoctors = [...(doctors || [])].sort((a, b) => {
    const aName = a.lastName || a.firstName || "";
    const bName = b.lastName || b.firstName || "";
    return aName.localeCompare(bName);
  });

  // Show loading state while database initializes
  if (!isInitialized) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Doctors</Text>
        </View>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Doctors</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddDoctor}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={sortedDoctors}
        keyExtractor={(item) => item.id}
        numColumns={numColumns}
        renderItem={({ item }) => {
          const doctor = item instanceof Doctor ? item : new Doctor(item);
          return (
            <TouchableOpacity
              style={[styles.doctorRow, { flex: 1 / numColumns }]}
              onPress={() => handleEditDoctor(item)}
            >
              <View style={styles.doctorInfo}>
                <Text style={styles.doctorName}>{doctor.getFullName()}</Text>
                <Text style={styles.doctorSpecialty}>
                  {doctor.specialty || "No specialty"}
                </Text>
                <Text style={styles.doctorPhone}>
                  {doctor.getDisplayPhone() || "No phone"}
                </Text>
                {doctor.getFullAddress() && (
                  <Text style={styles.doctorAddress} numberOfLines={2}>
                    {doctor.getFullAddress()}
                  </Text>
                )}
              </View>
              <MapButton
                address={doctor.getFullAddress()}
                entityName="doctor"
                entityTitle={doctor.getFullName()}
                style={styles.mapButton}
                width={80}
                height={60}
                zoom={16}
              />
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No doctors found.</Text>
        }
        contentContainerStyle={{ paddingBottom: 24 }}
      />
      <DoctorForm
        visible={formVisible}
        onClose={() => {
          setFormVisible(false);
          setEditingDoctor(null);
        }}
        onSave={handleSaveDoctor}
        onDelete={editingDoctor ? handleDeleteDoctor : undefined}
        initialValues={editingDoctor}
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
  doctorRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eeeeee",
    minHeight: 80,
  },
  doctorInfo: {
    flex: 1,
    marginRight: 12,
  },
  doctorName: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 2,
  },
  doctorSpecialty: {
    fontSize: 16,
    color: "#007AFF",
    marginBottom: 2,
  },
  doctorPhone: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
  doctorAddress: {
    fontSize: 14,
    color: "#888",
    fontStyle: "italic",
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
