// Model for Family
export default class FamilyMember {
  constructor({ id, name, relationship, phone, email }) {
    this.id = id;
    this.name = name;
    this.relationship = relationship;
    this.phone = phone;
    this.email = email;
  }
}
