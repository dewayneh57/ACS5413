// Model for Medications
export default class Medication {
  constructor({ id, name, dosage, frequency, prescribingDoctor, notes }) {
    this.id = id;
    this.name = name;
    this.dosage = dosage;
    this.frequency = frequency;
    this.prescribingDoctor = prescribingDoctor;
    this.notes = notes;
  }
}
