/**
 * ACS5413 - Personal Health Management
 * Dewayne Hafenstein - HAFE0010
 */
import React from "react";
import { useGlobalState } from "../context/GlobalStateContext";
import CardsGridList from "../components/CardsGridList";

export default function HomeScreen({ navigation, orientation }) {
  const { settings } = useGlobalState();
  return (
    <CardsGridList
      navigation={navigation}
      viewStyle={settings.viewStyle}
      orientation={orientation}
    />
  );
}
