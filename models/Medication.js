// Model for Medications
export default class Medication {
  constructor(props = {}) {
    const {
      id,
      drugName = "",
      genericName = "",
      manufacturer = "",
      doseSize = "",
      dosingInstructionsType = "",
      dosingInstructions = "",
      customDosingInstructions = "",
      rxNumber = "",
      prescriptionQuantity = "",
      pillImage = null, // URI or require path for pill image
      createdAt = "",
      updatedAt = "",
    } = props;

    this.id =
      id || Date.now().toString() + Math.random().toString(36).substr(2, 9);
    this.drugName = drugName;
    this.genericName = genericName;
    this.manufacturer = manufacturer;
    this.doseSize = doseSize;
    this.dosingInstructionsType = dosingInstructionsType;
    this.dosingInstructions = dosingInstructions;
    this.customDosingInstructions = customDosingInstructions;
    this.rxNumber = rxNumber;
    this.prescriptionQuantity = prescriptionQuantity;
    this.pillImage = pillImage;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  getDisplayName() {
    // Show brand name first, then generic in parentheses if different
    if (this.genericName && this.drugName !== this.genericName) {
      return `${this.drugName} (${this.genericName})`;
    }
    return this.drugName;
  }

  getDoseInfo() {
    const parts = [];
    if (this.doseSize) parts.push(this.doseSize);

    // Use custom instructions if type is custom, otherwise use standard dosing instructions
    const instructions =
      this.dosingInstructionsType === "custom"
        ? this.customDosingInstructions
        : this.dosingInstructions;

    if (instructions) parts.push(instructions);
    return parts.join(" - ");
  }

  getRxInfo() {
    const parts = [];
    if (this.rxNumber) parts.push(`Rx: ${this.rxNumber}`);
    if (this.prescriptionQuantity)
      parts.push(`Qty: ${this.prescriptionQuantity}`);
    return parts.join(" | ");
  }
}
