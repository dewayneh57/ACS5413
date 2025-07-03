// Model for Insurance
export default class Insurance {
  constructor({ id, provider, policyNumber, groupNumber, phone }) {
    this.id = id;
    this.provider = provider;
    this.policyNumber = policyNumber;
    this.groupNumber = groupNumber;
    this.phone = phone;
  }
}
