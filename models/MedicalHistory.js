// Model for History
export default class MedicalHistory {
  constructor({ id, condition, dateDiagnosed, notes }) {
    this.id = id;
    this.condition = condition;
    this.dateDiagnosed = dateDiagnosed;
    this.notes = notes;
  }
}
