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
import { US_STATES } from "../utils/USStates";
import { isValidEmail, isValidZip, isValidPhoneNumber } from "../utils/ValidationUtils";

export default function ContactForm({
  visible,
  onClose,
  onSave,
  onDelete,
  initialValues,
}) {
  const [form, setForm] = useState(
    initialValues || {
      firstName: "",
      middleName: "",
      lastName: "",
      homePhone: "",
      workPhone: "",
      cellPhone: "",
      street1: "",
      street2: "",
      city: "",
      state: "",
      zip: "",
      email: "",
      notes: "",
    }
  );
  const [errors, setErrors] = useState({});

  React.useEffect(() => {
    if (visible) {
      let initial = initialValues || {
        firstName: "",
        middleName: "",
        lastName: "",
        homePhone: "",
        workPhone: "",
        cellPhone: "",
        street1: "",
        street2: "",
        city: "",
        state: "",
        zip: "",
        email: "",
        notes: "",
      };
      // Format phone fields if present
      initial = {
        ...initial,
        homePhone: initial.homePhone ? formatPhoneInput(initial.homePhone) : "",
        workPhone: initial.workPhone ? formatPhoneInput(initial.workPhone) : "",
        cellPhone: initial.cellPhone ? formatPhoneInput(initial.cellPhone) : "",
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
    // Auto-format phone fields
    if (["homePhone", "workPhone", "cellPhone"].includes(key)) {
      // Accept area code in parenthesis or not, and separators as dash, space, or period
      value = formatPhoneInput(value);
    }
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: false }));
  };

  const handleSave = () => {
    let newErrors = {};
    // Required fields
    if (!form.firstName.trim()) newErrors.firstName = true;
    if (!form.lastName.trim()) newErrors.lastName = true;
    // Phone validation
    [
      { key: "homePhone", label: "Home Phone" },
      { key: "workPhone", label: "Work Phone" },
      { key: "cellPhone", label: "Cell Phone" },
    ].forEach(({ key }) => {
      if (form[key] && !isValidPhoneNumber(form[key])) {
        newErrors[key] = "Invalid format";
      }
    });
    // Street: trim, always valid
    const street1 = form.street1 ? form.street1.trim() : "";
    const street2 = form.street2 ? form.street2.trim() : "";
    // City: trim, always valid
    const city = form.city ? form.city.trim() : "";
    // State: must be blank or a valid US state
    if (form.state && !US_STATES.includes(form.state)) {
      newErrors.state = true;
    }
    // Zip: must be valid if entered
    if (form.zip && !isValidZip(form.zip)) {
      newErrors.zip = true;
    }
    // Email: must be valid if entered
    if (form.email && !isValidEmail(form.email)) {
      newErrors.email = true;
    }
    // Address required logic (undo: remove conditional requirement)
    // const addressFields = [street1, street2, city, form.state, form.zip];
    // const anyAddressEntered = addressFields.some(f => f && f.trim() !== "");
    // if (anyAddressEntered) {
    //   if (!street1) newErrors.street1 = true;
    //   if (!city) newErrors.city = true;
    //   if (!form.state) newErrors.state = true;
    // }
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    // Save with trimmed values
    onSave({
      ...form,
      street1,
      street2,
      city,
      state: form.state,
      zip: form.zip ? form.zip.trim() : "",
      email: form.email ? form.email.trim() : "",
    });
    setForm({
      firstName: "",
      middleName: "",
      lastName: "",
      homePhone: "",
      workPhone: "",
      cellPhone: "",
      street1: "",
      street2: "",
      city: "",
      state: "",
      zip: "",
      email: "",
      notes: "",
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
            {initialValues ? "Edit Contact" : "New Contact"}
          </Text>
          <TextInput
            style={[styles.input, errors.firstName && styles.inputError]}
            placeholder="First Name*"
            value={form.firstName}
            onChangeText={(v) => handleChange("firstName", v)}
            keyboardType="default"
          />
          <TextInput
            style={styles.input}
            placeholder="Middle Name"
            value={form.middleName}
            onChangeText={(v) => handleChange("middleName", v)}
            keyboardType="default"
          />
          <TextInput
            style={[styles.input, errors.lastName && styles.inputError]}
            placeholder="Last Name*"
            value={form.lastName}
            onChangeText={(v) => handleChange("lastName", v)}
            keyboardType="default"
          />
          <Text style={styles.section}>Phone Numbers</Text>
          <TextInput
            style={[styles.input, errors.homePhone && styles.inputError]}
            placeholder="Home"
            value={form.homePhone}
            onChangeText={(v) => handleChange("homePhone", v)}
            keyboardType="numbers-and-punctuation"
          />
          {errors.homePhone && (
            <Text style={{ color: "#FF3B30", marginBottom: 8 }}>
              Format: 999-999-9999 or (999)-999-9999
            </Text>
          )}
          <TextInput
            style={[styles.input, errors.workPhone && styles.inputError]}
            placeholder="Work"
            value={form.workPhone}
            onChangeText={(v) => handleChange("workPhone", v)}
            keyboardType="numbers-and-punctuation"
          />
          {errors.workPhone && (
            <Text style={{ color: "#FF3B30", marginBottom: 8 }}>
              Format: 999-999-9999 or (999)-999-9999
            </Text>
          )}
          <TextInput
            style={[styles.input, errors.cellPhone && styles.inputError]}
            placeholder="Cell"
            value={form.cellPhone}
            onChangeText={(v) => handleChange("cellPhone", v)}
            keyboardType="numbers-and-punctuation"
          />
          {errors.cellPhone && (
            <Text style={{ color: "#FF3B30", marginBottom: 8 }}>
              Format: 999-999-9999 or (999)-999-9999
            </Text>
          )}
          <Text style={styles.section}>Address</Text>
          <TextInput
            style={styles.input}
            placeholder="Street 1"
            value={form.street1}
            onChangeText={(v) => handleChange("street1", v)}
            keyboardType="default"
          />
          <TextInput
            style={styles.input}
            placeholder="Street 2"
            value={form.street2}
            onChangeText={(v) => handleChange("street2", v)}
            keyboardType="default"
          />
          <TextInput
            style={styles.input}
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
              style={{ height: 56 }}
            >
              <Picker.Item label="Select State" value="" />
              {US_STATES.map((abbr) => (
                <Picker.Item key={abbr} label={abbr} value={abbr} />
              ))}
            </Picker>
          </View>
          <TextInput
            style={[styles.input, errors.zip && styles.inputError]}
            placeholder="Zip"
            value={form.zip}
            onChangeText={(v) => handleChange("zip", v)}
            keyboardType="numeric"
          />
          {errors.zip && (
            <Text style={{ color: "#FF3B30", marginBottom: 8 }}>
              Zip must be 5 or 9 digits (optionally with dash or space)
            </Text>
          )}
          <TextInput
            style={[styles.input, errors.email && styles.inputError]}
            placeholder="Email"
            value={form.email}
            onChangeText={(v) => handleChange("email", v)}
            keyboardType="email-address"
          />
          {errors.email && (
            <Text style={{ color: "#FF3B30", marginBottom: 8 }}>
              Invalid email address
            </Text>
          )}
          <TextInput
            style={[styles.input, { height: 80 }]}
            placeholder="Notes"
            value={form.notes}
            onChangeText={(v) => handleChange("notes", v)}
            multiline
            keyboardType="default"
          />
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.btnText}>Cancel</Text>
            </TouchableOpacity>
            {onDelete && initialValues && (
              <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
                <Text style={styles.btnText}>Delete</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
              <Text style={styles.btnText}>Save</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, backgroundColor: "#fff", flexGrow: 1 },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  section: { fontSize: 16, fontWeight: "bold", marginTop: 16, marginBottom: 4 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    marginBottom: 12,
    fontSize: 16,
    height: 44,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    marginBottom: 12,
    backgroundColor: "#fff",
    height: 56,
    justifyContent: "center",
  },
  inputError: {
    borderColor: "#FF3B30",
    backgroundColor: "#FFF0F0",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  cancelBtn: {
    backgroundColor: "#ccc",
    padding: 12,
    borderRadius: 6,
    flex: 1,
    marginRight: 8,
  },
  saveBtn: {
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 6,
    flex: 1,
    marginLeft: 8,
  },
  deleteBtn: {
    backgroundColor: "#FF3B30",
    padding: 12,
    borderRadius: 6,
    flex: 1,
    marginLeft: 8,
  },
  btnText: { color: "#fff", fontWeight: "bold", textAlign: "center" },
});
