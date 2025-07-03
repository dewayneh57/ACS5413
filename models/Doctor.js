// Model for Doctors
export default class Doctor {
  constructor({ id, name, specialty, phone, email, address }) {
    this.id = id;
    this.name = name;
    this.specialty = specialty;
    this.phone = phone;
    this.email = email;
    this.address = address;
  }
}
