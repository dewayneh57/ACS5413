/**
 * ACS5413 - Personal Health Management
 * Dewayne Hafenstein - HAFE0010
 *
 * Medical Dosing Instructions - Standardized dosing frequency options
 * Provides common medical dosing instructions with descriptions
 */

export const MEDICAL_DOSING_INSTRUCTIONS = [
  {
    value: "once_daily",
    label: "Once Daily",
    description: "Take once every 24 hours",
    abbreviation: "QD",
  },
  {
    value: "twice_daily",
    label: "Twice Daily",
    description: "Take twice every 24 hours (every 12 hours)",
    abbreviation: "BID",
  },
  {
    value: "three_times_daily",
    label: "Three Times Daily",
    description: "Take three times every 24 hours (every 8 hours)",
    abbreviation: "TID",
  },
  {
    value: "four_times_daily",
    label: "Four Times Daily",
    description: "Take four times every 24 hours (every 6 hours)",
    abbreviation: "QID",
  },
  {
    value: "every_other_day",
    label: "Every Other Day",
    description: "Take once every 48 hours",
    abbreviation: "QOD",
  },
  {
    value: "every_third_day",
    label: "Every Third Day",
    description: "Take once every 72 hours",
    abbreviation: "Q3D",
  },
  {
    value: "weekly",
    label: "Weekly",
    description: "Take once every week",
    abbreviation: "QW",
  },
  {
    value: "monthly",
    label: "Monthly",
    description: "Take once every month",
    abbreviation: "QM",
  },
  {
    value: "as_needed",
    label: "As Needed",
    description: "Take only when symptoms occur or as directed",
    abbreviation: "PRN",
  },
  {
    value: "with_meals",
    label: "With Meals",
    description: "Take with food to reduce stomach upset",
    abbreviation: "PC",
  },
  {
    value: "before_meals",
    label: "Before Meals",
    description: "Take 30-60 minutes before eating",
    abbreviation: "AC",
  },
  {
    value: "at_bedtime",
    label: "At Bedtime",
    description: "Take before going to sleep",
    abbreviation: "HS",
  },
  {
    value: "in_morning",
    label: "In Morning",
    description: "Take in the morning, preferably same time daily",
    abbreviation: "AM",
  },
  {
    value: "in_evening",
    label: "In Evening",
    description: "Take in the evening, preferably same time daily",
    abbreviation: "PM",
  },
  {
    value: "every_4_hours",
    label: "Every 4 Hours",
    description: "Take every 4 hours around the clock",
    abbreviation: "Q4H",
  },
  {
    value: "every_6_hours",
    label: "Every 6 Hours",
    description: "Take every 6 hours around the clock",
    abbreviation: "Q6H",
  },
  {
    value: "every_8_hours",
    label: "Every 8 Hours",
    description: "Take every 8 hours around the clock",
    abbreviation: "Q8H",
  },
  {
    value: "every_12_hours",
    label: "Every 12 Hours",
    description: "Take every 12 hours around the clock",
    abbreviation: "Q12H",
  },
  {
    value: "custom",
    label: "Custom Instructions",
    description: "Enter custom dosing instructions",
    abbreviation: "CUSTOM",
  },
];

/**
 * Get dosing instruction by value
 */
export const getDosingInstructionByValue = (value) => {
  return MEDICAL_DOSING_INSTRUCTIONS.find(
    (instruction) => instruction.value === value
  );
};

/**
 * Get display text for dosing instruction
 */
export const getDosingInstructionDisplay = (value) => {
  const instruction = getDosingInstructionByValue(value);
  return instruction
    ? `${instruction.label} (${instruction.abbreviation})`
    : value;
};

/**
 * Get full description for dosing instruction
 */
export const getDosingInstructionDescription = (value) => {
  const instruction = getDosingInstructionByValue(value);
  return instruction ? instruction.description : "";
};
