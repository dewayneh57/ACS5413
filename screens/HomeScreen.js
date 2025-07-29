/**
 * ACS5413 - Personal Health Management
 * Dewayne Hafenstein - HAFE0010
 */
import React from "react";
import { useDatabase } from "../context/DatabaseContext";
import CardsGridList from "../components/CardsGridList";

export default function HomeScreen({ navigation, orientation }) {
  // For now, use default settings until we add settings to database
  const defaultSettings = { viewStyle: "cards" };

  return (
    <CardsGridList
      navigation={navigation}
      viewStyle={defaultSettings.viewStyle}
      orientation={orientation}
    />
  );
}
