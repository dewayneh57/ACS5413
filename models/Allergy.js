// Model for Allergies
export default class Allergy {
  constructor(props = {}) {
    const {
      id,
      allergy = "",
      severity = "",
      remediation = "",
      description = "",
    } = props;

    this.id =
      id || Date.now().toString() + Math.random().toString(36).substr(2, 9);
    this.allergy = allergy;
    this.severity = severity;
    this.remediation = remediation;
    this.description = description;
  }

  getDisplayName() {
    return this.allergy;
  }

  getSeverityInfo() {
    return this.severity;
  }

  getRemediationInfo() {
    return this.remediation || "No remediation specified";
  }

  getDescriptionInfo() {
    return this.description || "No description provided";
  }

  hasDescription() {
    return this.description && this.description.trim().length > 0;
  }

  getSeverityLevel() {
    // Return numeric severity for sorting (higher = more severe)
    const severityLevels = {
      Rash: 1,
      Itching: 2,
      Discomfort: 3,
      Pain: 4,
      Shock: 5,
      Severe: 6,
      "Life-threatening": 7,
    };
    return severityLevels[this.severity] || 0;
  }

  isLifeThreatening() {
    return (
      this.severity === "Life-threatening" ||
      this.severity === "Severe" ||
      this.severity === "Shock"
    );
  }
}

// Available severity levels
export const SEVERITY_LEVELS = [
  "Rash",
  "Itching",
  "Discomfort",
  "Pain",
  "Shock",
  "Severe",
  "Life-threatening",
];
