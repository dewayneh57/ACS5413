/**
 * Firebase Configuration
 * ACS5413 - Personal Health Management
 * Dewayne Hafenstein - HAFE0010
 */

import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  databaseURL: "https://acs5413-95e60-default-rtdb.firebaseio.com/",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and get a reference to the service
export const database = getDatabase(app);

export default app;
