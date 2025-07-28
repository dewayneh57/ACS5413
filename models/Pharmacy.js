import { formatPhoneNumber } from "../utils/FormatUtils";

// Model for Pharmacies
export default class Pharmacy {
  constructor(props = {}) {
    const {
      id,
      name = "",
      street1 = "",
      street2 = "",
      city = "",
      state = "",
      zip = "",
      phone = "",
      inNetwork = false,
    } = props;

    this.id = id;
    this.name = name;
    this.street1 = street1;
    this.street2 = street2;
    this.city = city;
    this.state = state;
    this.zip = zip;
    this.phone = phone;
    this.inNetwork = inNetwork;
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

  getNetworkStatus() {
    return this.inNetwork ? "In Network" : "Out of Network";
  }
}
