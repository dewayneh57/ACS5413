import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import {
  MEDICAL_DOSING_INSTRUCTIONS,
  getDosingInstructionDisplay,
} from "../utils/MedicalDosingInstructions";

export default function MedicationForm({
  visible,
  onClose,
  onSave,
  onDelete,
  initialValues,
}) {
  const [form, setForm] = useState(
    initialValues || {
      drugName: "",
      genericName: "",
      manufacturer: "",
      doseSize: "",
      dosingInstructionsType: "",
      dosingInstructions: "",
      customDosingInstructions: "",
      rxNumber: "",
      prescriptionQuantity: "",
      pillImage: null,
    }
  );
  const [errors, setErrors] = useState({});

  React.useEffect(() => {
    if (visible) {
      let initial = initialValues || {
        drugName: "",
        genericName: "",
        manufacturer: "",
        doseSize: "",
        dosingInstructionsType: "",
        dosingInstructions: "",
        customDosingInstructions: "",
        rxNumber: "",
        prescriptionQuantity: "",
        pillImage: null,
      };
      setForm(initial);
      setErrors({});
    }
  }, [visible, initialValues]);

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: false }));
  };

  const handleAddImage = () => {
    // Placeholder for future image picker functionality
    Alert.alert(
      "Add Pill Image",
      "Image picker functionality will be added later to allow users to take or select a photo of their medication."
    );
  };

  const handleSave = () => {
    let newErrors = {};

    // Required fields
    if (!form.drugName.trim()) newErrors.drugName = true;
    if (!form.doseSize.trim()) newErrors.doseSize = true;

    // Validate dosing instructions
    if (!form.dosingInstructionsType) {
      newErrors.dosingInstructions = true;
    } else if (
      form.dosingInstructionsType === "custom" &&
      !form.customDosingInstructions.trim()
    ) {
      newErrors.customDosingInstructions = true;
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    // Save with trimmed values
    const saveData = {
      ...form,
      drugName: form.drugName.trim(),
      genericName: form.genericName.trim(),
      manufacturer: form.manufacturer.trim(),
      doseSize: form.doseSize.trim(),
      dosingInstructionsType: form.dosingInstructionsType,
      rxNumber: form.rxNumber.trim(),
      prescriptionQuantity: form.prescriptionQuantity.trim(),
    };

    // Set the appropriate dosing instructions based on type
    if (form.dosingInstructionsType === "custom") {
      saveData.dosingInstructions = "";
      saveData.customDosingInstructions = form.customDosingInstructions.trim();
    } else {
      const selectedInstruction = MEDICAL_DOSING_INSTRUCTIONS.find(
        (inst) => inst.value === form.dosingInstructionsType
      );
      saveData.dosingInstructions = selectedInstruction
        ? getDosingInstructionDisplay(form.dosingInstructionsType)
        : "";
      saveData.customDosingInstructions = "";
    }

    onSave(saveData);

    setForm({
      drugName: "",
      genericName: "",
      manufacturer: "",
      doseSize: "",
      dosingInstructionsType: "",
      dosingInstructions: "",
      customDosingInstructions: "",
      rxNumber: "",
      prescriptionQuantity: "",
      pillImage: null,
    });
  };

  const handleDelete = () => {
    if (onDelete) onDelete(form);
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={80}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.header}>
            {initialValues ? "Edit Medication" : "New Medication"}
          </Text>

          <TextInput
            style={[styles.input, errors.drugName && styles.inputError]}
            placeholder="Drug Name (Brand Name)*"
            value={form.drugName}
            onChangeText={(v) => handleChange("drugName", v)}
            keyboardType="default"
          />

          <TextInput
            style={styles.input}
            placeholder="Generic Name"
            value={form.genericName}
            onChangeText={(v) => handleChange("genericName", v)}
            keyboardType="default"
          />

          <TextInput
            style={styles.input}
            placeholder="Manufacturer"
            value={form.manufacturer}
            onChangeText={(v) => handleChange("manufacturer", v)}
            keyboardType="default"
          />

          <Text style={styles.sectionHeader}>Dosage Information</Text>

          <TextInput
            style={[styles.input, errors.doseSize && styles.inputError]}
            placeholder="Dose Size (e.g., 10mg, 500mg)*"
            value={form.doseSize}
            onChangeText={(v) => handleChange("doseSize", v)}
            keyboardType="default"
          />

          <Text style={styles.label}>Dosing Instructions *</Text>
          <View
            style={[
              styles.pickerContainer,
              errors.dosingInstructions && styles.inputError,
            ]}
          >
            <Picker
              selectedValue={form.dosingInstructionsType}
              onValueChange={(value) =>
                handleChange("dosingInstructionsType", value)
              }
              style={styles.picker}
            >
              <Picker.Item label="Select dosing instructions..." value="" />
              {MEDICAL_DOSING_INSTRUCTIONS.map((instruction) => (
                <Picker.Item
                  key={instruction.value}
                  label={`${instruction.label} (${instruction.abbreviation}) - ${instruction.description}`}
                  value={instruction.value}
                />
              ))}
            </Picker>
          </View>

          {form.dosingInstructionsType === "custom" && (
            <TextInput
              style={[
                styles.input,
                errors.customDosingInstructions && styles.inputError,
              ]}
              placeholder="Enter custom dosing instructions"
              value={form.customDosingInstructions}
              onChangeText={(v) => handleChange("customDosingInstructions", v)}
              keyboardType="default"
              multiline
              numberOfLines={2}
            />
          )}

          <Text style={styles.sectionHeader}>Prescription Information</Text>

          <TextInput
            style={styles.input}
            placeholder="Prescription Number"
            value={form.rxNumber}
            onChangeText={(v) => handleChange("rxNumber", v)}
            keyboardType="default"
          />

          <TextInput
            style={styles.input}
            placeholder="Prescription Quantity (e.g., 30 tablets)"
            value={form.prescriptionQuantity}
            onChangeText={(v) => handleChange("prescriptionQuantity", v)}
            keyboardType="default"
          />

          <Text style={styles.sectionHeader}>Pill Image</Text>

          <View style={styles.imageSection}>
            {form.pillImage ? (
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: form.pillImage }}
                  style={styles.pillImage}
                />
                <TouchableOpacity
                  style={styles.removeImageButton}
                  onPress={() => handleChange("pillImage", null)}
                >
                  <Text style={styles.removeImageText}>Remove</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.addImageButton}
                onPress={handleAddImage}
              >
                <Text style={styles.addImageText}>+ Add Pill Photo</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.buttonContainer}>
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={onClose}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.saveButton]}
                onPress={handleSave}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
            {onDelete && (
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={handleDelete}
              >
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingTop: 48,
    backgroundColor: "#ffffff",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 8,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    padding: 12,
    marginBottom: 8,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  inputError: {
    borderColor: "#ff3333",
  },
  imageSection: {
    marginBottom: 16,
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 8,
  },
  pillImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginBottom: 8,
  },
  removeImageButton: {
    backgroundColor: "#FF3B30",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
  removeImageText: {
    color: "#fff",
    fontSize: 14,
  },
  addImageButton: {
    borderWidth: 2,
    borderColor: "#007AFF",
    borderStyle: "dashed",
    borderRadius: 8,
    padding: 24,
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  addImageText: {
    color: "#007AFF",
    fontSize: 16,
    fontWeight: "500",
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 8,
    marginTop: 16,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#fff",
    marginBottom: 16,
  },
  picker: {
    height: 50,
  },
  buttonContainer: {
    marginTop: 24,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  button: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  saveButton: {
    backgroundColor: "#007AFF",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  cancelButton: {
    backgroundColor: "#8E8E93",
  },
  cancelButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  deleteButton: {
    backgroundColor: "#FF3B30",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
