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
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { SEVERITY_LEVELS } from "../models/Allergy";

export default function AllergyForm({
  visible,
  onClose,
  onSave,
  onDelete,
  initialValues,
}) {
  const [form, setForm] = useState(
    initialValues || {
      allergy: "",
      severity: "",
      remediation: "",
      description: "",
    }
  );
  const [errors, setErrors] = useState({});

  React.useEffect(() => {
    if (visible) {
      let initial = initialValues || {
        allergy: "",
        severity: "",
        remediation: "",
        description: "",
      };
      setForm(initial);
      setErrors({});
    }
  }, [visible, initialValues]);

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: false }));
  };

  const handleSave = () => {
    let newErrors = {};

    // Required fields
    if (!form.allergy.trim()) newErrors.allergy = true;
    if (!form.severity) newErrors.severity = true;

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    // Save with trimmed values
    onSave({
      ...form,
      allergy: form.allergy.trim(),
      remediation: form.remediation.trim(),
      description: form.description.trim(),
    });

    setForm({
      allergy: "",
      severity: "",
      remediation: "",
      description: "",
    });
  };

  const handleDelete = () => {
    if (onDelete) onDelete(form);
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
            {initialValues ? "Edit Allergy" : "New Allergy"}
          </Text>

          <TextInput
            style={[styles.input, errors.allergy && styles.inputError]}
            placeholder="Allergy/Allergen (e.g., Peanuts, Penicillin)*"
            value={form.allergy}
            onChangeText={(v) => handleChange("allergy", v)}
            keyboardType="default"
          />

          <View
            style={[
              styles.pickerContainer,
              errors.severity && styles.inputError,
            ]}
          >
            <Text style={styles.pickerLabel}>Severity Level*</Text>
            <Picker
              selectedValue={form.severity}
              onValueChange={(v) => handleChange("severity", v)}
              style={styles.picker}
            >
              <Picker.Item label="Select Severity Level" value="" />
              {SEVERITY_LEVELS.map((level) => (
                <Picker.Item
                  key={level}
                  label={level}
                  value={level}
                  color={getSeverityColor(level)}
                />
              ))}
            </Picker>
          </View>

          {form.severity && (
            <View
              style={[
                styles.severityIndicator,
                { backgroundColor: getSeverityColor(form.severity) },
              ]}
            >
              <Text style={styles.severityText}>
                {form.severity}
                {form.severity === "Life-threatening" && " ⚠️"}
                {form.severity === "Severe" && " ⚠️"}
                {form.severity === "Shock" && " ⚠️"}
              </Text>
            </View>
          )}

          <Text style={styles.sectionHeader}>Remediation</Text>

          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Treatment/Remediation (if known)"
            value={form.remediation}
            onChangeText={(v) => handleChange("remediation", v)}
            keyboardType="default"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />

          <Text style={styles.sectionHeader}>Description</Text>

          <TextInput
            style={[styles.input, styles.textArea, styles.descriptionArea]}
            placeholder="Additional details about this allergy (up to 500 words)"
            value={form.description}
            onChangeText={(v) => {
              // Limit to roughly 500 words (approximately 3000 characters)
              if (v.length <= 3000) {
                handleChange("description", v);
              }
            }}
            keyboardType="default"
            multiline
            numberOfLines={6}
            textAlignVertical="top"
            maxLength={3000}
          />

          {form.description && (
            <Text style={styles.characterCount}>
              {form.description.length}/3000 characters
            </Text>
          )}

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
  textArea: {
    minHeight: 100,
  },
  descriptionArea: {
    minHeight: 120,
  },
  characterCount: {
    fontSize: 12,
    color: "#666",
    textAlign: "right",
    marginBottom: 8,
    marginTop: -4,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    marginBottom: 8,
    backgroundColor: "#fff",
  },
  pickerLabel: {
    fontSize: 12,
    color: "#666",
    paddingHorizontal: 12,
    paddingTop: 8,
  },
  picker: {
    height: 50,
  },
  severityIndicator: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: "center",
  },
  severityText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
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
