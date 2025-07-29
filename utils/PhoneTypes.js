// Phone types utility - reusable across different entities
// This contains common phone types that can be used for contact information
// across various forms and models in the application

export const PHONE_TYPES = [
  "Work",
  "Cell",
  "Pager",
  "Virtual Care",
  "Find a Doctor",
  "Healthcare Team",
  "Other",
];

// Helper function to get default phone type
export const getDefaultPhoneType = () => "Other";

// Helper function to validate phone type
export const isValidPhoneType = (type) => {
  return PHONE_TYPES.includes(type);
};

// Helper function to get phone type options for form dropdowns
export const getPhoneTypeOptions = () => {
  return PHONE_TYPES.map((type) => ({
    label: type,
    value: type,
    key: type,
  }));
};
