import React from "react";
import { useGlobalState } from "../context/GlobalStateContext";
import CardsGridList from "../components/CardsGridList";

export default function HomeScreen({ navigation }) {
  const { settings } = useGlobalState();
  return (
    <CardsGridList navigation={navigation} viewStyle={settings.viewStyle} />
  );
}
