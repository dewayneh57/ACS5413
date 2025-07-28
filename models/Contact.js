import { formatPhoneNumber } from "../utils/FormatUtils";

// Model for Contacts
export default class Contact {
  constructor(props = {}) {
    const {
      id,
      firstName = "",
      middleName = "",
      lastName = "",
      homePhone = "",
      workPhone = "",
      cellPhone = "",
      street1 = "",
      street2 = "",
      city = "",
      state = "",
      zip = "",
      email = "",
      notes = "",
      relationship = "",
    } = props;

    this.id = id;
    this.firstName = firstName;
    this.middleName = middleName;
    this.lastName = lastName;
    this.firstName = firstName;
    this.middleName = middleName;
    this.lastName = lastName;
    this.homePhone = homePhone;
    this.workPhone = workPhone;
    this.cellPhone = cellPhone;
    this.street1 = street1;
    this.street2 = street2;
    this.city = city;
    this.state = state;
    this.zip = zip;
    this.email = email;
    this.notes = notes;
    this.relationship = relationship;
  }

  getFullName() {
    return `${this.firstName} ${this.middleName} ${this.lastName}`
      .replace(/  +/g, " ")
      .trim();
  }

  getDisplayPhone() {
    // Prefer cell, then home, then work
    const raw = this.cellPhone || this.homePhone || this.workPhone || "";
    return formatPhoneNumber(raw);
  }
}
