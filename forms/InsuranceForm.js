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
import { PHONE_TYPES } from "../utils/PhoneTypes";
import { US_STATES } from "../utils/USStates";

export default function InsuranceForm({
  visible,
  onClose,
  onSave,
  onDelete,
  initialValues,
}) {
  const [form, setForm] = useState(
    initialValues || {
      providerName: "",
      groupNumber: "",
      identificationNumber: "",
      agentName: "",
      agentStreet1: "",
      agentStreet2: "",
      agentCity: "",
      agentState: "",
      agentZip: "",
      agentPhone: "",
      customerSupportPhone: "",
      preauthorizationPhone: "",
      additionalPhone1: "",
      additionalPhone1Type: "Other",
      additionalPhone2: "",
      additionalPhone2Type: "Other",
    }
  );
  const [errors, setErrors] = useState({});

  React.useEffect(() => {
    if (visible) {
      let initial = initialValues || {
        providerName: "",
        groupNumber: "",
        identificationNumber: "",
        agentName: "",
        agentStreet1: "",
        agentStreet2: "",
        agentCity: "",
        agentState: "",
        agentZip: "",
        agentPhone: "",
        customerSupportPhone: "",
        preauthorizationPhone: "",
        additionalPhone1: "",
        additionalPhone1Type: "Other",
        additionalPhone2: "",
        additionalPhone2Type: "Other",
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
    if (!form.providerName.trim()) newErrors.providerName = true;
    if (!form.identificationNumber.trim())
      newErrors.identificationNumber = true;

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    // Save with trimmed values
    onSave({
      ...form,
      providerName: form.providerName.trim(),
      groupNumber: form.groupNumber.trim(),
      identificationNumber: form.identificationNumber.trim(),
      agentName: form.agentName.trim(),
      agentStreet1: form.agentStreet1.trim(),
      agentStreet2: form.agentStreet2.trim(),
      agentCity: form.agentCity.trim(),
      agentZip: form.agentZip.trim(),
      agentPhone: form.agentPhone.trim(),
      customerSupportPhone: form.customerSupportPhone.trim(),
      preauthorizationPhone: form.preauthorizationPhone.trim(),
      additionalPhone1: form.additionalPhone1.trim(),
      additionalPhone2: form.additionalPhone2.trim(),
    });

    setForm({
      providerName: "",
      groupNumber: "",
      identificationNumber: "",
      agentName: "",
      agentStreet1: "",
      agentStreet2: "",
      agentCity: "",
      agentState: "",
      agentZip: "",
      agentPhone: "",
      customerSupportPhone: "",
      preauthorizationPhone: "",
      additionalPhone1: "",
      additionalPhone1Type: "Other",
      additionalPhone2: "",
      additionalPhone2Type: "Other",
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
            {initialValues ? "Edit Insurance" : "New Insurance"}
          </Text>

          <Text style={styles.sectionHeader}>Provider Information</Text>

          <TextInput
            style={[styles.input, errors.providerName && styles.inputError]}
            placeholder="Insurance Provider Name*"
            value={form.providerName}
            onChangeText={(v) => handleChange("providerName", v)}
            keyboardType="default"
          />

          <TextInput
            style={styles.input}
            placeholder="Group Number"
            value={form.groupNumber}
            onChangeText={(v) => handleChange("groupNumber", v)}
            keyboardType="default"
          />

          <TextInput
            style={[
              styles.input,
              errors.identificationNumber && styles.inputError,
            ]}
            placeholder="Identification Number*"
            value={form.identificationNumber}
            onChangeText={(v) => handleChange("identificationNumber", v)}
            keyboardType="default"
          />

          <Text style={styles.sectionHeader}>Agent Information</Text>

          <TextInput
            style={styles.input}
            placeholder="Agent Name"
            value={form.agentName}
            onChangeText={(v) => handleChange("agentName", v)}
            keyboardType="default"
          />

          <TextInput
            style={styles.input}
            placeholder="Agent Street Address"
            value={form.agentStreet1}
            onChangeText={(v) => handleChange("agentStreet1", v)}
            keyboardType="default"
          />

          <TextInput
            style={styles.input}
            placeholder="Agent Street Address 2"
            value={form.agentStreet2}
            onChangeText={(v) => handleChange("agentStreet2", v)}
            keyboardType="default"
          />

          <TextInput
            style={styles.input}
            placeholder="Agent City"
            value={form.agentCity}
            onChangeText={(v) => handleChange("agentCity", v)}
            keyboardType="default"
          />

          <View style={styles.pickerContainer}>
            <Text style={styles.pickerLabel}>Agent State</Text>
            <Picker
              selectedValue={form.agentState}
              onValueChange={(v) => handleChange("agentState", v)}
              style={styles.picker}
            >
              <Picker.Item label="Select State" value="" />
              {(US_STATES || []).map((state) => (
                <Picker.Item key={state} label={state} value={state} />
              ))}
            </Picker>
          </View>

          <TextInput
            style={styles.input}
            placeholder="Agent ZIP Code"
            value={form.agentZip}
            onChangeText={(v) => handleChange("agentZip", v)}
            keyboardType="numeric"
            maxLength={5}
          />

          <Text style={styles.sectionHeader}>Phone Numbers</Text>

          <TextInput
            style={styles.input}
            placeholder="Agent Phone"
            value={form.agentPhone}
            onChangeText={(v) => handleChange("agentPhone", v)}
            keyboardType="phone-pad"
          />

          <TextInput
            style={styles.input}
            placeholder="Customer Support Phone"
            value={form.customerSupportPhone}
            onChangeText={(v) => handleChange("customerSupportPhone", v)}
            keyboardType="phone-pad"
          />

          <TextInput
            style={styles.input}
            placeholder="Preauthorization Phone"
            value={form.preauthorizationPhone}
            onChangeText={(v) => handleChange("preauthorizationPhone", v)}
            keyboardType="phone-pad"
          />

          <Text style={styles.sectionHeader}>Additional Phone Numbers</Text>

          <View style={styles.phoneRow}>
            <TextInput
              style={[styles.input, styles.phoneInput]}
              placeholder="Additional Phone 1"
              value={form.additionalPhone1}
              onChangeText={(v) => handleChange("additionalPhone1", v)}
              keyboardType="phone-pad"
            />
            <View style={[styles.pickerContainer, styles.phoneTypePicker]}>
              <Picker
                selectedValue={form.additionalPhone1Type}
                onValueChange={(v) => handleChange("additionalPhone1Type", v)}
                style={styles.picker}
              >
                {(PHONE_TYPES || []).map((type) => (
                  <Picker.Item key={type} label={type} value={type} />
                ))}
              </Picker>
            </View>
          </View>

          <View style={styles.phoneRow}>
            <TextInput
              style={[styles.input, styles.phoneInput]}
              placeholder="Additional Phone 2"
              value={form.additionalPhone2}
              onChangeText={(v) => handleChange("additionalPhone2", v)}
              keyboardType="phone-pad"
            />
            <View style={[styles.pickerContainer, styles.phoneTypePicker]}>
              <Picker
                selectedValue={form.additionalPhone2Type}
                onValueChange={(v) => handleChange("additionalPhone2Type", v)}
                style={styles.picker}
              >
                {(PHONE_TYPES || []).map((type) => (
                  <Picker.Item key={type} label={type} value={type} />
                ))}
              </Picker>
            </View>
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
  phoneRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
    marginBottom: 8,
  },
  phoneInput: {
    flex: 2,
    marginBottom: 0,
  },
  phoneTypePicker: {
    flex: 1,
    marginBottom: 0,
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
