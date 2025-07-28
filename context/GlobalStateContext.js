import React, { createContext, useContext, useState } from "react";
import Settings from "../models/Settings";
import Contact from "../models/Contact";
import Doctor from "../models/Doctor";
import Hospital from "../models/Hospital";
import Pharmacy from "../models/Pharmacy";
import Medication from "../models/Medication";
import Insurance from "../models/Insurance";
import Allergy from "../models/Allergy";

// Create the context
const GlobalStateContext = createContext();

export function GlobalStateProvider({ children, value }) {
  // If value is provided (from App.js), use it. Otherwise, create default state here.
  const [user, setUser] = useState(null);
  const [settings, setSettings] = useState(new Settings());
  const [contacts, setContacts] = useState([
    new Contact({
      id: "1",
      firstName: "Dewayne",
      lastName: "Hafenstein",
      cellPhone: "2149013144",
      email: "dewayne@hafenstein.net",
      relationship: "Patient",
    }),
    new Contact({
      id: "2",
      firstName: "Mari",
      lastName: "Hafenstein",
      cellPhone: "2144713218",
      email: "mari@hafenstein.net",
      relationship: "Wife",
    }),
    new Contact({
      id: "3",
      firstName: "Fred",
      lastName: "Flintstone",
      cellPhone: "2145558765",
      email: "fflintstone@bedrock.com",
      relationship: "cartoon character",
    }),
  ]);
  const [doctors, setDoctors] = useState([
    new Doctor({
      id: "1",
      firstName: "John",
      lastName: "Smith",
      specialty: "Family Medicine",
      phone: "2145551234",
      street1: "123 Medical Plaza",
      city: "Dallas",
      state: "TX",
      zip: "75201",
    }),
    new Doctor({
      id: "2",
      firstName: "Sarah",
      lastName: "Johnson",
      specialty: "Cardiology",
      phone: "2145555678",
      street1: "456 Heart Center Dr",
      city: "Plano",
      state: "TX",
      zip: "75024",
    }),
  ]);
  const [hospitals, setHospitals] = useState([
    new Hospital({
      id: "1",
      name: "Dallas Methodist Hospital",
      street1: "1441 N Beckley Ave",
      city: "Dallas",
      state: "TX",
      zip: "75203",
      phone: "2149471000",
      inNetwork: true,
    }),
    new Hospital({
      id: "2",
      name: "Presbyterian Hospital of Dallas",
      street1: "8200 Walnut Hill Ln",
      city: "Dallas",
      state: "TX",
      zip: "75231",
      phone: "2143451000",
      inNetwork: false,
    }),
  ]);
  const [pharmacies, setPharmacies] = useState([
    new Pharmacy({
      id: "1",
      name: "CVS Pharmacy",
      street1: "1234 Main St",
      city: "Dallas",
      state: "TX",
      zip: "75201",
      phone: "2145551234",
      inNetwork: true,
    }),
    new Pharmacy({
      id: "2",
      name: "Walgreens",
      street1: "5678 Oak Ave",
      city: "Plano",
      state: "TX",
      zip: "75024",
      phone: "2145555678",
      inNetwork: false,
    }),
  ]);
  const [medications, setMedications] = useState([
    new Medication({
      id: "1",
      drugName: "Lisinopril",
      genericName: "Lisinopril",
      manufacturer: "Lupin Pharmaceuticals",
      doseSize: "10mg",
      dosingInstructions: "Take once daily in the morning",
      rxNumber: "RX12345",
      prescriptionQuantity: "30 tablets",
    }),
    new Medication({
      id: "2",
      drugName: "Metformin",
      genericName: "Metformin HCl",
      manufacturer: "Teva Pharmaceuticals",
      doseSize: "500mg",
      dosingInstructions: "Take twice daily with meals",
      rxNumber: "RX67890",
      prescriptionQuantity: "60 tablets",
    }),
  ]);
  const [insurance, setInsurance] = useState([
    new Insurance({
      id: "1",
      providerName: "Blue Cross Blue Shield",
      groupNumber: "12345",
      identificationNumber: "ABC123456789",
      agentName: "John Smith",
      agentStreet1: "123 Insurance Way",
      agentCity: "Dallas",
      agentState: "TX",
      agentZip: "75201",
      agentPhone: "2145551234",
      customerSupportPhone: "8005551234",
      preauthorizationPhone: "8005555678",
    }),
    new Insurance({
      id: "2",
      providerName: "Aetna",
      groupNumber: "67890",
      identificationNumber: "XYZ987654321",
      agentName: "Jane Doe",
      agentStreet1: "456 Policy St",
      agentCity: "Plano",
      agentState: "TX",
      agentZip: "75024",
      customerSupportPhone: "8005559876",
      additionalPhone1: "8005554321",
      additionalPhone1Type: "Find a Doctor",
    }),
  ]);
  const [allergies, setAllergies] = useState([
    new Allergy({
      id: "1",
      allergy: "Penicillin",
      severity: "Life-threatening",
      remediation: "Epinephrine injection immediately, call 911",
      description:
        "Severe anaphylactic reaction within minutes of administration. First noticed during childhood when receiving antibiotic treatment for strep throat. Symptoms include rapid swelling of throat and tongue, difficulty breathing, and loss of consciousness. Must avoid all penicillin-based antibiotics including amoxicillin and ampicillin. Always wear medical alert bracelet and carry emergency medication.",
    }),
    new Allergy({
      id: "2",
      allergy: "Peanuts",
      severity: "Severe",
      remediation: "EpiPen available, avoid all nuts",
      description:
        "Developed in early childhood, confirmed through allergy testing. Reaction occurs with both direct consumption and cross-contamination. Symptoms include hives, swelling, digestive issues, and respiratory distress. Must be vigilant about food labels and restaurant preparation. Family members also avoid peanuts at home to prevent accidental exposure.",
    }),
    new Allergy({
      id: "3",
      allergy: "Shellfish",
      severity: "Shock",
      remediation: "Benadryl 50mg, monitor breathing",
      description:
        "Adult-onset allergy that developed around age 25. Affects all crustaceans including shrimp, crab, and lobster. Reaction typically begins 30-60 minutes after consumption with nausea, vomiting, and skin flushing, progressing to more severe symptoms if untreated. Can usually dine at seafood restaurants with proper precautions.",
    }),
    new Allergy({
      id: "4",
      allergy: "Latex",
      severity: "Rash",
      remediation: "Use latex-free gloves and equipment",
      description:
        "Contact dermatitis that developed from occupational exposure in healthcare setting. Primarily affects hands and forearms when in contact with latex gloves or medical equipment. Symptoms include redness, itching, and small blisters that typically resolve within 24-48 hours of removing exposure. No systemic reactions observed.",
    }),
  ]);

  // Merge provided values with defaults
  const contextValue = {
    user: value?.user ?? user,
    setUser: value?.setUser ?? setUser,
    settings: value?.settings ?? settings,
    setSettings: value?.setSettings ?? setSettings,
    contacts: value?.contacts ?? contacts,
    setContacts: value?.setContacts ?? setContacts,
    doctors: value?.doctors ?? doctors,
    setDoctors: value?.setDoctors ?? setDoctors,
    hospitals: value?.hospitals ?? hospitals,
    setHospitals: value?.setHospitals ?? setHospitals,
    pharmacies: value?.pharmacies ?? pharmacies,
    setPharmacies: value?.setPharmacies ?? setPharmacies,
    medications: value?.medications ?? medications,
    setMedications: value?.setMedications ?? setMedications,
    insurance: value?.insurance ?? insurance,
    setInsurance: value?.setInsurance ?? setInsurance,
    allergies: value?.allergies ?? allergies,
    setAllergies: value?.setAllergies ?? setAllergies,
  };

  return (
    <GlobalStateContext.Provider value={contextValue}>
      {children}
    </GlobalStateContext.Provider>
  );
}

export function useGlobalState() {
  return useContext(GlobalStateContext);
}

export { GlobalStateContext };
