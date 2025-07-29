/**
 * Medical History Models
 * Handles different types of medical history entries including surgeries,
 * diagnoses, tests, illnesses, injuries, and immunizations.
 */

// Base class for all medical history items
export class MedicalHistoryItem {
  constructor({ id, type, date, notes, doctor }) {
    this.id =
      id || Date.now().toString() + Math.random().toString(36).substr(2, 9);
    this.type = type; // surgery, diagnosis, test, illness, injury, immunization
    this.date = date; // Date when this occurred/was reported
    this.notes = notes || "";
    this.doctor = doctor || ""; // Doctor associated with this entry
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  getDisplayDate() {
    if (!this.date) return "Date not specified";
    try {
      return new Date(this.date).toLocaleDateString();
    } catch {
      return this.date;
    }
  }

  getTitle() {
    return "Medical History Item";
  }

  getSubtitle() {
    return this.notes
      ? this.notes.substring(0, 100) + (this.notes.length > 100 ? "..." : "")
      : "";
  }
}

// Surgery history
export class Surgery extends MedicalHistoryItem {
  constructor({
    id,
    date,
    procedure,
    surgeon,
    hospital,
    complications,
    outcome,
    notes,
  }) {
    super({ id, type: "surgery", date, notes, doctor: surgeon });
    this.procedure = procedure || "";
    this.surgeon = surgeon || "";
    this.hospital = hospital || "";
    this.complications = complications || "";
    this.outcome = outcome || "";
  }

  getTitle() {
    return this.procedure || "Surgery";
  }

  getSubtitle() {
    const parts = [];
    if (this.surgeon) parts.push(`Dr. ${this.surgeon}`);
    if (this.hospital) parts.push(this.hospital);
    return parts.join(" • ");
  }
}

// Diagnosis history
export class Diagnosis extends MedicalHistoryItem {
  constructor({
    id,
    date,
    condition,
    diagnosingDoctor,
    severity,
    status,
    treatment,
    notes,
  }) {
    super({ id, type: "diagnosis", date, notes, doctor: diagnosingDoctor });
    this.condition = condition || "";
    this.diagnosingDoctor = diagnosingDoctor || "";
    this.severity = severity || ""; // mild, moderate, severe
    this.status = status || ""; // active, resolved, chronic, monitoring
    this.treatment = treatment || "";
  }

  getTitle() {
    return this.condition || "Diagnosis";
  }

  getSubtitle() {
    const parts = [];
    if (this.status) parts.push(this.status);
    if (this.severity) parts.push(this.severity);
    if (this.diagnosingDoctor) parts.push(`Dr. ${this.diagnosingDoctor}`);
    return parts.join(" • ");
  }
}

// Medical test history
export class MedicalTest extends MedicalHistoryItem {
  constructor({
    id,
    date,
    testName,
    testType,
    results,
    normalRange,
    orderingDoctor,
    facility,
    notes,
  }) {
    super({ id, type: "test", date, notes, doctor: orderingDoctor });
    this.testName = testName || "";
    this.testType = testType || ""; // blood, imaging, diagnostic, screening
    this.results = results || "";
    this.normalRange = normalRange || "";
    this.orderingDoctor = orderingDoctor || "";
    this.facility = facility || "";
  }

  getTitle() {
    return this.testName || "Medical Test";
  }

  getSubtitle() {
    const parts = [];
    if (this.results) parts.push(`Result: ${this.results}`);
    if (this.facility) parts.push(this.facility);
    return parts.join(" • ");
  }

  isAbnormal() {
    return (
      (this.results &&
        this.normalRange &&
        this.results.toLowerCase().includes("abnormal")) ||
      this.results.toLowerCase().includes("high") ||
      this.results.toLowerCase().includes("low")
    );
  }
}

// Illness history
export class Illness extends MedicalHistoryItem {
  constructor({
    id,
    onsetDate,
    resolutionDate,
    illness,
    symptoms,
    treatment,
    doctor,
    notes,
  }) {
    super({ id, type: "illness", date: onsetDate, notes, doctor });
    this.onsetDate = onsetDate;
    this.resolutionDate = resolutionDate;
    this.illness = illness || "";
    this.symptoms = symptoms || "";
    this.treatment = treatment || "";
  }

  getTitle() {
    return this.illness || "Illness";
  }

  getSubtitle() {
    const parts = [];
    if (this.resolutionDate) {
      parts.push("Resolved");
    } else {
      parts.push("Ongoing");
    }
    if (this.treatment) parts.push(this.treatment);
    return parts.join(" • ");
  }

  getDuration() {
    if (!this.onsetDate) return null;
    const start = new Date(this.onsetDate);
    const end = this.resolutionDate
      ? new Date(this.resolutionDate)
      : new Date();
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }
}

// Injury history
export class Injury extends MedicalHistoryItem {
  constructor({
    id,
    date,
    injuryType,
    bodyPart,
    cause,
    severity,
    treatment,
    healingTime,
    doctor,
    notes,
  }) {
    super({ id, type: "injury", date, notes, doctor });
    this.injuryType = injuryType || ""; // fracture, sprain, cut, burn, etc.
    this.bodyPart = bodyPart || "";
    this.cause = cause || "";
    this.severity = severity || ""; // minor, moderate, severe
    this.treatment = treatment || "";
    this.healingTime = healingTime || "";
  }

  getTitle() {
    const parts = [];
    if (this.injuryType) parts.push(this.injuryType);
    if (this.bodyPart) parts.push(this.bodyPart);
    return parts.join(" - ") || "Injury";
  }

  getSubtitle() {
    const parts = [];
    if (this.severity) parts.push(this.severity);
    if (this.cause) parts.push(`Cause: ${this.cause}`);
    return parts.join(" • ");
  }
}

// Immunization history
export class Immunization extends MedicalHistoryItem {
  constructor({
    id,
    date,
    vaccine,
    manufacturer,
    lotNumber,
    administeredBy,
    nextDueDate,
    reactions,
    notes,
  }) {
    super({ id, type: "immunization", date, notes, doctor: administeredBy });
    this.vaccine = vaccine || "";
    this.manufacturer = manufacturer || "";
    this.lotNumber = lotNumber || "";
    this.administeredBy = administeredBy || "";
    this.nextDueDate = nextDueDate;
    this.reactions = reactions || "";
  }

  getTitle() {
    return this.vaccine || "Immunization";
  }

  getSubtitle() {
    const parts = [];
    if (this.nextDueDate) {
      const nextDue = new Date(this.nextDueDate);
      const now = new Date();
      if (nextDue > now) {
        parts.push(`Next due: ${nextDue.toLocaleDateString()}`);
      } else {
        parts.push("Due for booster");
      }
    }
    if (this.manufacturer) parts.push(this.manufacturer);
    return parts.join(" • ");
  }

  isDueForBooster() {
    if (!this.nextDueDate) return false;
    return new Date(this.nextDueDate) <= new Date();
  }
}

// Medical device history
export class MedicalDevice extends MedicalHistoryItem {
  constructor({
    id,
    date,
    deviceName,
    manufacturer,
    modelNumber,
    serialNumber,
    implantDate,
    doctor,
    facility,
    batteryLife,
    nextMaintenance,
    notes,
  }) {
    super({ id, type: "device", date: date || implantDate, notes, doctor });
    this.deviceName = deviceName || "";
    this.manufacturer = manufacturer || "";
    this.modelNumber = modelNumber || "";
    this.serialNumber = serialNumber || "";
    this.implantDate = implantDate || date;
    this.facility = facility || "";
    this.batteryLife = batteryLife || "";
    this.nextMaintenance = nextMaintenance;
  }

  getTitle() {
    return this.deviceName || "Medical Device";
  }

  getSubtitle() {
    const parts = [];
    if (this.manufacturer) parts.push(this.manufacturer);
    if (this.modelNumber) parts.push(`Model: ${this.modelNumber}`);
    if (this.serialNumber) parts.push(`S/N: ${this.serialNumber}`);
    return parts.join(" • ");
  }

  needsMaintenance() {
    if (!this.nextMaintenance) return false;
    return new Date(this.nextMaintenance) <= new Date();
  }

  getMaintenanceStatus() {
    if (!this.nextMaintenance) return null;
    const nextDate = new Date(this.nextMaintenance);
    const now = new Date();
    if (nextDate <= now) {
      return "Maintenance Due";
    } else {
      return `Next maintenance: ${nextDate.toLocaleDateString()}`;
    }
  }
}

// Factory function to create the appropriate history item
export function createMedicalHistoryItem(type, data) {
  switch (type) {
    case "surgery":
      return new Surgery(data);
    case "diagnosis":
      return new Diagnosis(data);
    case "test":
      return new MedicalTest(data);
    case "illness":
      return new Illness(data);
    case "injury":
      return new Injury(data);
    case "immunization":
      return new Immunization(data);
    case "device":
      return new MedicalDevice(data);
    default:
      return new MedicalHistoryItem({ ...data, type });
  }
}

// Default export for backward compatibility
export default MedicalHistoryItem;
