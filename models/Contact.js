// Model for Contacts
export default class Contact {
  constructor({ id, name, phone, email, relationship }) {
    this.id = id;
    this.name = name;
    this.phone = phone;
    this.email = email;
    this.relationship = relationship;
  }
}
