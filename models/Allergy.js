// Model for Allergy
export default class Allergy {
  constructor({ id, allergen, reaction, severity, notes }) {
    this.id = id;
    this.allergen = allergen;
    this.reaction = reaction;
    this.severity = severity;
    this.notes = notes;
  }
}
