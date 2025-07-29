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

const HISTORY_TYPES = [
  { label: "Surgery", value: "surgery" },
  { label: "Diagnosis", value: "diagnosis" },
  { label: "Medical Test", value: "test" },
  { label: "Illness", value: "illness" },
  { label: "Injury", value: "injury" },
  { label: "Immunization", value: "immunization" },
  { label: "Medical Device", value: "device" },
];

const SEVERITY_LEVELS = ["", "mild", "moderate", "severe"];
const STATUS_OPTIONS = ["", "active", "resolved", "chronic", "monitoring"];
const TEST_TYPES = ["", "blood", "imaging", "diagnostic", "screening"];
const INJURY_SEVERITIES = ["", "minor", "moderate", "severe"];

export default function MedicalHistoryForm({
  visible,
  onClose,
  onSave,
  onDelete,
  initialValues,
}) {
  const [form, setForm] = useState(
    initialValues || {
      type: "diagnosis",
      date: "",
      notes: "",
      doctor: "",
      // Surgery fields
      procedure: "",
      surgeon: "",
      hospital: "",
      complications: "",
      outcome: "",
      // Diagnosis fields
      condition: "",
      diagnosingDoctor: "",
      severity: "",
      status: "",
      treatment: "",
      // Test fields
      testName: "",
      testType: "",
      results: "",
      normalRange: "",
      orderingDoctor: "",
      facility: "",
      // Illness fields
      onsetDate: "",
      resolutionDate: "",
      illness: "",
      symptoms: "",
      // Injury fields
      injuryType: "",
      bodyPart: "",
      cause: "",
      healingTime: "",
      // Immunization fields
      vaccine: "",
      manufacturer: "",
      lotNumber: "",
      administeredBy: "",
      nextDueDate: "",
      reactions: "",
      // Medical device fields
      deviceName: "",
      modelNumber: "",
      serialNumber: "",
      implantDate: "",
      batteryLife: "",
      nextMaintenance: "",
    }
  );
  const [errors, setErrors] = useState({});

  React.useEffect(() => {
    if (visible) {
      let initial = initialValues || {
        type: "diagnosis",
        date: "",
        notes: "",
        doctor: "",
        procedure: "",
        surgeon: "",
        hospital: "",
        complications: "",
        outcome: "",
        condition: "",
        diagnosingDoctor: "",
        severity: "",
        status: "",
        treatment: "",
        testName: "",
        testType: "",
        results: "",
        normalRange: "",
        orderingDoctor: "",
        facility: "",
        onsetDate: "",
        resolutionDate: "",
        illness: "",
        symptoms: "",
        injuryType: "",
        bodyPart: "",
        cause: "",
        healingTime: "",
        vaccine: "",
        manufacturer: "",
        lotNumber: "",
        administeredBy: "",
        nextDueDate: "",
        reactions: "",
        deviceName: "",
        modelNumber: "",
        serialNumber: "",
        implantDate: "",
        batteryLife: "",
        nextMaintenance: "",
      };
      setForm(initial);
      setErrors({});
    }
  }, [visible, initialValues]);

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: false }));
  };

  const validateForm = () => {
    let newErrors = {};

    // Common required fields
    if (!form.type) newErrors.type = true;
    if (!form.date.trim()) newErrors.date = true;

    // Type-specific validation
    switch (form.type) {
      case "surgery":
        if (!form.procedure.trim()) newErrors.procedure = true;
        break;
      case "diagnosis":
        if (!form.condition.trim()) newErrors.condition = true;
        break;
      case "test":
        if (!form.testName.trim()) newErrors.testName = true;
        break;
      case "illness":
        if (!form.illness.trim()) newErrors.illness = true;
        if (!form.onsetDate.trim()) newErrors.onsetDate = true;
        break;
      case "injury":
        if (!form.injuryType.trim()) newErrors.injuryType = true;
        break;
      case "immunization":
        if (!form.vaccine.trim()) newErrors.vaccine = true;
        break;
      case "device":
        if (!form.deviceName.trim()) newErrors.deviceName = true;
        if (!form.manufacturer.trim()) newErrors.manufacturer = true;
        break;
    }

    return newErrors;
  };

  const handleSave = () => {
    const newErrors = validateForm();
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    // Clean up form data - remove empty fields and trim strings
    const cleanedForm = {};
    Object.keys(form).forEach((key) => {
      if (typeof form[key] === "string") {
        const trimmed = form[key].trim();
        if (trimmed) cleanedForm[key] = trimmed;
      } else if (
        form[key] !== null &&
        form[key] !== undefined &&
        form[key] !== ""
      ) {
        cleanedForm[key] = form[key];
      }
    });

    onSave(cleanedForm);
  };

  const handleDelete = () => {
    if (onDelete) onDelete(form);
  };

  const renderTypeSpecificFields = () => {
    switch (form.type) {
      case "surgery":
        return (
          <>
            <Text style={styles.sectionHeader}>Surgery Details</Text>
            <TextInput
              style={[styles.input, errors.procedure && styles.inputError]}
              placeholder="Procedure Name*"
              value={form.procedure}
              onChangeText={(v) => handleChange("procedure", v)}
            />
            <TextInput
              style={styles.input}
              placeholder="Surgeon"
              value={form.surgeon}
              onChangeText={(v) => handleChange("surgeon", v)}
            />
            <TextInput
              style={styles.input}
              placeholder="Hospital/Facility"
              value={form.hospital}
              onChangeText={(v) => handleChange("hospital", v)}
            />
            <TextInput
              style={styles.input}
              placeholder="Complications (if any)"
              value={form.complications}
              onChangeText={(v) => handleChange("complications", v)}
            />
            <TextInput
              style={styles.input}
              placeholder="Outcome"
              value={form.outcome}
              onChangeText={(v) => handleChange("outcome", v)}
            />
          </>
        );

      case "diagnosis":
        return (
          <>
            <Text style={styles.sectionHeader}>Diagnosis Details</Text>
            <TextInput
              style={[styles.input, errors.condition && styles.inputError]}
              placeholder="Condition/Diagnosis*"
              value={form.condition}
              onChangeText={(v) => handleChange("condition", v)}
            />
            <TextInput
              style={styles.input}
              placeholder="Diagnosing Doctor"
              value={form.diagnosingDoctor}
              onChangeText={(v) => handleChange("diagnosingDoctor", v)}
            />
            <View style={styles.pickerContainer}>
              <Text style={styles.pickerLabel}>Severity</Text>
              <Picker
                selectedValue={form.severity}
                onValueChange={(v) => handleChange("severity", v)}
                style={styles.picker}
              >
                {SEVERITY_LEVELS.map((level) => (
                  <Picker.Item
                    key={level}
                    label={level || "Select Severity"}
                    value={level}
                  />
                ))}
              </Picker>
            </View>
            <View style={styles.pickerContainer}>
              <Text style={styles.pickerLabel}>Status</Text>
              <Picker
                selectedValue={form.status}
                onValueChange={(v) => handleChange("status", v)}
                style={styles.picker}
              >
                {STATUS_OPTIONS.map((status) => (
                  <Picker.Item
                    key={status}
                    label={status || "Select Status"}
                    value={status}
                  />
                ))}
              </Picker>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Treatment"
              value={form.treatment}
              onChangeText={(v) => handleChange("treatment", v)}
              multiline
            />
          </>
        );

      case "test":
        return (
          <>
            <Text style={styles.sectionHeader}>Test Details</Text>
            <TextInput
              style={[styles.input, errors.testName && styles.inputError]}
              placeholder="Test Name*"
              value={form.testName}
              onChangeText={(v) => handleChange("testName", v)}
            />
            <View style={styles.pickerContainer}>
              <Text style={styles.pickerLabel}>Test Type</Text>
              <Picker
                selectedValue={form.testType}
                onValueChange={(v) => handleChange("testType", v)}
                style={styles.picker}
              >
                {TEST_TYPES.map((type) => (
                  <Picker.Item
                    key={type}
                    label={type || "Select Type"}
                    value={type}
                  />
                ))}
              </Picker>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Results"
              value={form.results}
              onChangeText={(v) => handleChange("results", v)}
              multiline
            />
            <TextInput
              style={styles.input}
              placeholder="Normal Range"
              value={form.normalRange}
              onChangeText={(v) => handleChange("normalRange", v)}
            />
            <TextInput
              style={styles.input}
              placeholder="Ordering Doctor"
              value={form.orderingDoctor}
              onChangeText={(v) => handleChange("orderingDoctor", v)}
            />
            <TextInput
              style={styles.input}
              placeholder="Testing Facility"
              value={form.facility}
              onChangeText={(v) => handleChange("facility", v)}
            />
          </>
        );

      case "illness":
        return (
          <>
            <Text style={styles.sectionHeader}>Illness Details</Text>
            <TextInput
              style={[styles.input, errors.illness && styles.inputError]}
              placeholder="Illness/Condition*"
              value={form.illness}
              onChangeText={(v) => handleChange("illness", v)}
            />
            <TextInput
              style={[styles.input, errors.onsetDate && styles.inputError]}
              placeholder="Onset Date (YYYY-MM-DD)*"
              value={form.onsetDate}
              onChangeText={(v) => handleChange("onsetDate", v)}
            />
            <TextInput
              style={styles.input}
              placeholder="Resolution Date (YYYY-MM-DD)"
              value={form.resolutionDate}
              onChangeText={(v) => handleChange("resolutionDate", v)}
            />
            <TextInput
              style={styles.input}
              placeholder="Symptoms"
              value={form.symptoms}
              onChangeText={(v) => handleChange("symptoms", v)}
              multiline
            />
            <TextInput
              style={styles.input}
              placeholder="Treatment"
              value={form.treatment}
              onChangeText={(v) => handleChange("treatment", v)}
              multiline
            />
          </>
        );

      case "injury":
        return (
          <>
            <Text style={styles.sectionHeader}>Injury Details</Text>
            <TextInput
              style={[styles.input, errors.injuryType && styles.inputError]}
              placeholder="Injury Type*"
              value={form.injuryType}
              onChangeText={(v) => handleChange("injuryType", v)}
            />
            <TextInput
              style={styles.input}
              placeholder="Body Part Affected"
              value={form.bodyPart}
              onChangeText={(v) => handleChange("bodyPart", v)}
            />
            <TextInput
              style={styles.input}
              placeholder="Cause of Injury"
              value={form.cause}
              onChangeText={(v) => handleChange("cause", v)}
            />
            <View style={styles.pickerContainer}>
              <Text style={styles.pickerLabel}>Severity</Text>
              <Picker
                selectedValue={form.severity}
                onValueChange={(v) => handleChange("severity", v)}
                style={styles.picker}
              >
                {INJURY_SEVERITIES.map((level) => (
                  <Picker.Item
                    key={level}
                    label={level || "Select Severity"}
                    value={level}
                  />
                ))}
              </Picker>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Treatment"
              value={form.treatment}
              onChangeText={(v) => handleChange("treatment", v)}
              multiline
            />
            <TextInput
              style={styles.input}
              placeholder="Healing Time"
              value={form.healingTime}
              onChangeText={(v) => handleChange("healingTime", v)}
            />
          </>
        );

      case "immunization":
        return (
          <>
            <Text style={styles.sectionHeader}>Immunization Details</Text>
            <TextInput
              style={[styles.input, errors.vaccine && styles.inputError]}
              placeholder="Vaccine Name*"
              value={form.vaccine}
              onChangeText={(v) => handleChange("vaccine", v)}
            />
            <TextInput
              style={styles.input}
              placeholder="Manufacturer"
              value={form.manufacturer}
              onChangeText={(v) => handleChange("manufacturer", v)}
            />
            <TextInput
              style={styles.input}
              placeholder="Lot Number"
              value={form.lotNumber}
              onChangeText={(v) => handleChange("lotNumber", v)}
            />
            <TextInput
              style={styles.input}
              placeholder="Administered By"
              value={form.administeredBy}
              onChangeText={(v) => handleChange("administeredBy", v)}
            />
            <TextInput
              style={styles.input}
              placeholder="Next Due Date (YYYY-MM-DD)"
              value={form.nextDueDate}
              onChangeText={(v) => handleChange("nextDueDate", v)}
            />
            <TextInput
              style={styles.input}
              placeholder="Reactions (if any)"
              value={form.reactions}
              onChangeText={(v) => handleChange("reactions", v)}
              multiline
            />
          </>
        );

      case "device":
        return (
          <>
            <Text style={styles.sectionHeader}>Medical Device Details</Text>
            <TextInput
              style={[styles.input, errors.deviceName && styles.inputError]}
              placeholder="Device Name*"
              value={form.deviceName}
              onChangeText={(v) => handleChange("deviceName", v)}
            />
            <TextInput
              style={[styles.input, errors.manufacturer && styles.inputError]}
              placeholder="Manufacturer*"
              value={form.manufacturer}
              onChangeText={(v) => handleChange("manufacturer", v)}
            />
            <TextInput
              style={styles.input}
              placeholder="Model Number"
              value={form.modelNumber}
              onChangeText={(v) => handleChange("modelNumber", v)}
            />
            <TextInput
              style={styles.input}
              placeholder="Serial Number"
              value={form.serialNumber}
              onChangeText={(v) => handleChange("serialNumber", v)}
            />
            <TextInput
              style={styles.input}
              placeholder="Implant Date (YYYY-MM-DD)"
              value={form.implantDate}
              onChangeText={(v) => handleChange("implantDate", v)}
            />
            <TextInput
              style={styles.input}
              placeholder="Battery Life/Duration"
              value={form.batteryLife}
              onChangeText={(v) => handleChange("batteryLife", v)}
            />
            <TextInput
              style={styles.input}
              placeholder="Next Maintenance Date (YYYY-MM-DD)"
              value={form.nextMaintenance}
              onChangeText={(v) => handleChange("nextMaintenance", v)}
            />
            <TextInput
              style={styles.input}
              placeholder="Facility/Hospital"
              value={form.facility}
              onChangeText={(v) => handleChange("facility", v)}
            />
          </>
        );

      default:
        return null;
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
            {initialValues ? "Edit Medical History" : "Add Medical History"}
          </Text>

          <Text style={styles.sectionHeader}>General Information</Text>

          <View style={styles.pickerContainer}>
            <Text style={styles.pickerLabel}>Type*</Text>
            <Picker
              selectedValue={form.type}
              onValueChange={(v) => handleChange("type", v)}
              style={[styles.picker, errors.type && styles.inputError]}
            >
              {HISTORY_TYPES.map((type) => (
                <Picker.Item
                  key={type.value}
                  label={type.label}
                  value={type.value}
                />
              ))}
            </Picker>
          </View>

          <TextInput
            style={[styles.input, errors.date && styles.inputError]}
            placeholder="Date (YYYY-MM-DD)*"
            value={form.date}
            onChangeText={(v) => handleChange("date", v)}
          />

          <TextInput
            style={styles.input}
            placeholder="Doctor/Healthcare Provider"
            value={form.doctor}
            onChangeText={(v) => handleChange("doctor", v)}
          />

          {renderTypeSpecificFields()}

          <Text style={styles.sectionHeader}>Additional Notes</Text>
          <TextInput
            style={[styles.input, styles.notesInput]}
            placeholder="Additional notes..."
            value={form.notes}
            onChangeText={(v) => handleChange("notes", v)}
            multiline
            numberOfLines={4}
          />

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
  notesInput: {
    height: 100,
    textAlignVertical: "top",
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
