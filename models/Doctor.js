import { formatPhoneNumber } from "../utils/FormatUtils";

// Model for Doctors
export default class Doctor {
  constructor(props = {}) {
    const {
      id,
      firstName = "",
      middleName = "",
      lastName = "",
      specialty = "",
      street1 = "",
      street2 = "",
      city = "",
      state = "",
      zip = "",
      phone = "",
      createdAt = "",
      updatedAt = "",
    } = props;

    this.id = id;
    this.firstName = firstName;
    this.middleName = middleName;
    this.lastName = lastName;
    this.specialty = specialty;
    this.street1 = street1;
    this.street2 = street2;
    this.city = city;
    this.state = state;
    this.zip = zip;
    this.phone = phone;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  getFullName() {
    return `${this.firstName} ${this.middleName} ${this.lastName}`
      .replace(/  +/g, " ")
      .trim();
  }

  getDisplayPhone() {
    return formatPhoneNumber(this.phone);
  }

  getFullAddress() {
    const parts = [];
    if (this.street1) parts.push(this.street1);
    if (this.street2) parts.push(this.street2);
    if (this.city || this.state || this.zip) {
      const cityStateZip = [this.city, this.state, this.zip]
        .filter(Boolean)
        .join(", ");
      if (cityStateZip) parts.push(cityStateZip);
    }
    return parts.join(", ");
  }
}
