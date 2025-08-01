import { formatPhoneNumber } from "../utils/FormatUtils";
import { PHONE_TYPES } from "../utils/PhoneTypes";

// Model for Insurance
export default class Insurance {
  constructor(props = {}) {
    const {
      id,
      providerName = "",
      groupNumber = "",
      identificationNumber = "",
      agentName = "",
      agentStreet1 = "",
      agentStreet2 = "",
      agentCity = "",
      agentState = "",
      agentZip = "",
      agentPhone = "",
      customerSupportPhone = "",
      preauthorizationPhone = "",
      additionalPhone1 = "",
      additionalPhone1Type = "Other",
      additionalPhone2 = "",
      additionalPhone2Type = "Other",
      createdAt = "",
      updatedAt = "",
    } = props;

    this.id =
      id || Date.now().toString() + Math.random().toString(36).substr(2, 9);
    this.providerName = providerName;
    this.groupNumber = groupNumber;
    this.identificationNumber = identificationNumber;
    this.agentName = agentName;
    this.agentStreet1 = agentStreet1;
    this.agentStreet2 = agentStreet2;
    this.agentCity = agentCity;
    this.agentState = agentState;
    this.agentZip = agentZip;
    this.agentPhone = agentPhone;
    this.customerSupportPhone = customerSupportPhone;
    this.preauthorizationPhone = preauthorizationPhone;
    this.additionalPhone1 = additionalPhone1;
    this.additionalPhone1Type = additionalPhone1Type;
    this.additionalPhone2 = additionalPhone2;
    this.additionalPhone2Type = additionalPhone2Type;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  getDisplayName() {
    return this.providerName;
  }

  getAgentFullAddress() {
    const parts = [];
    if (this.agentStreet1) parts.push(this.agentStreet1);
    if (this.agentStreet2) parts.push(this.agentStreet2);
    if (this.agentCity || this.agentState || this.agentZip) {
      const cityStateZip = [this.agentCity, this.agentState, this.agentZip]
        .filter(Boolean)
        .join(", ");
      if (cityStateZip) parts.push(cityStateZip);
    }
    return parts.join(", ");
  }

  getFormattedPhone(phoneType) {
    let phone = "";
    switch (phoneType) {
      case "agent":
        phone = this.agentPhone;
        break;
      case "customerSupport":
        phone = this.customerSupportPhone;
        break;
      case "preauthorization":
        phone = this.preauthorizationPhone;
        break;
      case "additional1":
        phone = this.additionalPhone1;
        break;
      case "additional2":
        phone = this.additionalPhone2;
        break;
      default:
        return "";
    }
    return formatPhoneNumber(phone);
  }

  getPolicyInfo() {
    const parts = [];
    if (this.groupNumber) parts.push(`Group: ${this.groupNumber}`);
    if (this.identificationNumber)
      parts.push(`ID: ${this.identificationNumber}`);
    return parts.join(" | ");
  }

  getAllPhoneNumbers() {
    const phones = [];

    if (this.agentPhone) {
      phones.push({
        type: "Agent",
        number: this.getFormattedPhone("agent"),
        raw: this.agentPhone,
      });
    }

    if (this.customerSupportPhone) {
      phones.push({
        type: "Customer Support",
        number: this.getFormattedPhone("customerSupport"),
        raw: this.customerSupportPhone,
      });
    }

    if (this.preauthorizationPhone) {
      phones.push({
        type: "Preauthorization",
        number: this.getFormattedPhone("preauthorization"),
        raw: this.preauthorizationPhone,
      });
    }

    if (this.additionalPhone1) {
      phones.push({
        type: this.additionalPhone1Type,
        number: this.getFormattedPhone("additional1"),
        raw: this.additionalPhone1,
      });
    }

    if (this.additionalPhone2) {
      phones.push({
        type: this.additionalPhone2Type,
        number: this.getFormattedPhone("additional2"),
        raw: this.additionalPhone2,
      });
    }

    return phones;
  }
}
