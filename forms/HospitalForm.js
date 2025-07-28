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
  Switch,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { US_STATES } from "../utils/USStates";
import { isValidZip, isValidPhoneNumber } from "../utils/ValidationUtils";

export default function HospitalForm({
  visible,
  onClose,
  onSave,
  onDelete,
  initialValues,
}) {
  const [form, setForm] = useState(
    initialValues || {
      name: "",
      street1: "",
      street2: "",
      city: "",
      state: "",
      zip: "",
      phone: "",
      inNetwork: false,
    }
  );
  const [errors, setErrors] = useState({});

  React.useEffect(() => {
    if (visible) {
      let initial = initialValues || {
        name: "",
        street1: "",
        street2: "",
        city: "",
        state: "",
        zip: "",
        phone: "",
        inNetwork: false,
      };
      // Format phone field if present
      initial = {
        ...initial,
        phone: initial.phone ? formatPhoneInput(initial.phone) : "",
      };
      setForm(initial);
      setErrors({});
    }
  }, [visible, initialValues]);

  // Enhanced helper to format phone numbers as (999) 999-9999
  function formatPhoneInput(value) {
    // Accepts: (999) 999-9999, 999-999-9999, 999.999.9999, 999 999 9999, (999)-999-9999, etc.
    // Extract digits
    const digits = value.replace(/\D/g, "");
    if (digits.length === 10) {
      return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
    }
    return value;
  }

  const handleChange = (key, value) => {
    // Auto-format phone field
    if (key === "phone") {
      value = formatPhoneInput(value);
    }
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: false }));
  };

  const handleSave = () => {
    let newErrors = {};

    // Required fields
    if (!form.name.trim()) newErrors.name = true;

    // Phone validation
    if (form.phone && !isValidPhoneNumber(form.phone)) {
      newErrors.phone = "Invalid format";
    }

    // Address fields: trim, always valid
    const street1 = form.street1 ? form.street1.trim() : "";
    const street2 = form.street2 ? form.street2.trim() : "";
    const city = form.city ? form.city.trim() : "";

    // State: must be blank or a valid US state
    if (form.state && !US_STATES.includes(form.state)) {
      newErrors.state = true;
    }

    // Zip: must be valid if entered
    if (form.zip && !isValidZip(form.zip)) {
      newErrors.zip = true;
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    // Save with trimmed values
    onSave({
      ...form,
      name: form.name.trim(),
      street1,
      street2,
      city,
      state: form.state,
      zip: form.zip ? form.zip.trim() : "",
    });

    setForm({
      name: "",
      street1: "",
      street2: "",
      city: "",
      state: "",
      zip: "",
      phone: "",
      inNetwork: false,
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
            {initialValues ? "Edit Hospital" : "New Hospital"}
          </Text>

          <TextInput
            style={[styles.input, errors.name && styles.inputError]}
            placeholder="Hospital Name*"
            value={form.name}
            onChangeText={(v) => handleChange("name", v)}
            keyboardType="default"
          />

          <TextInput
            style={[
              styles.input,
              typeof errors.phone === "string" && styles.inputError,
            ]}
            placeholder="Phone Number"
            value={form.phone}
            onChangeText={(v) => handleChange("phone", v)}
            keyboardType="phone-pad"
          />

          <Text style={styles.sectionHeader}>Address</Text>

          <TextInput
            style={[styles.input, errors.street1 && styles.inputError]}
            placeholder="Street Address Line 1"
            value={form.street1}
            onChangeText={(v) => handleChange("street1", v)}
            keyboardType="default"
          />

          <TextInput
            style={styles.input}
            placeholder="Street Address Line 2"
            value={form.street2}
            onChangeText={(v) => handleChange("street2", v)}
            keyboardType="default"
          />

          <TextInput
            style={[styles.input, errors.city && styles.inputError]}
            placeholder="City"
            value={form.city}
            onChangeText={(v) => handleChange("city", v)}
            keyboardType="default"
          />

          <View
            style={[styles.pickerContainer, errors.state && styles.inputError]}
          >
            <Picker
              selectedValue={form.state}
              onValueChange={(v) => handleChange("state", v)}
              style={styles.picker}
            >
              <Picker.Item label="Select State" value="" />
              {US_STATES.map((state) => (
                <Picker.Item key={state} label={state} value={state} />
              ))}
            </Picker>
          </View>

          <TextInput
            style={[styles.input, errors.zip && styles.inputError]}
            placeholder="ZIP Code"
            value={form.zip}
            onChangeText={(v) => handleChange("zip", v)}
            keyboardType="numeric"
          />

          <Text style={styles.sectionHeader}>Insurance Network</Text>

          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>In Network</Text>
            <Switch
              value={form.inNetwork}
              onValueChange={(value) => handleChange("inNetwork", value)}
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={form.inNetwork ? "#007AFF" : "#f4f3f4"}
            />
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
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    marginBottom: 8,
    backgroundColor: "#fff",
    minHeight: 50,
  },
  picker: {
    height: 50,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 4,
    marginBottom: 8,
  },
  switchLabel: {
    fontSize: 16,
    color: "#333",
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
