import React from "react";
import {
  FlatList,
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import Card from "../components/Card";

const cards = [
  {
    id: "1",
    label: "Contacts",
    icon: require("../assets/icons/contacts.png"),
    screen: "Contacts",
  },
  {
    id: "2",
    label: "Doctors",
    icon: require("../assets/icons/doctors.png"),
    screen: "Doctors",
  },
  {
    id: "3",
    label: "Family",
    icon: require("../assets/icons/family.png"),
    screen: "Family",
  },
  {
    id: "4",
    label: "History",
    icon: require("../assets/icons/history.png"),
    screen: "History",
  },
  {
    id: "5",
    label: "Hospital",
    icon: require("../assets/icons/hospital.png"),
    screen: "Hospital",
  },
  {
    id: "6",
    label: "Medications",
    icon: require("../assets/icons/medications.png"),
    screen: "Medications",
  },
  {
    id: "7",
    label: "Pharmacy",
    icon: require("../assets/icons/prescriptions.png"),
    screen: "Pharmacy",
  },
  {
    id: "8",
    label: "Insurance",
    icon: require("../assets/icons/insurance.png"),
    screen: "Insurance",
  },
  {
    id: "9",
    label: "Documents",
    icon: require("../assets/icons/documents.png"),
    screen: "Documents",
  },
  {
    id: "10",
    label: "Allergies",
    icon: require("../assets/icons/allergy.png"),
    screen: "Allergies",
  },
];

export default function CardsGridList({ navigation, viewStyle }) {
  const renderItem = ({ item }) => {
    if (viewStyle === "list") {
      return (
        <View style={styles.listItem}>
          <TouchableOpacity onPress={() => navigation.navigate(item.screen)}>
            <Card>
              <View style={styles.listContent}>
                <Image source={item.icon} style={styles.listImage} />
                <Text style={styles.listLabel}>{item.label}</Text>
              </View>
            </Card>
          </TouchableOpacity>
        </View>
      );
    }
    return (
      <View style={styles.gridContent}>
        <TouchableOpacity onPress={() => navigation.navigate(item.screen)}>
          <Card>
            <Image source={item.icon} style={styles.cardImage} />
            <Text style={styles.cardImageLabel}>{item.label}</Text>
          </Card>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <FlatList
      data={cards}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      numColumns={viewStyle === "list" ? 1 : 2}
      key={viewStyle} // This forces FlatList to re-render when viewStyle changes
      contentContainerStyle={
        viewStyle === "list" ? styles.listContainer : styles.container
      }
    />
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "blue",
    width: "100%",
    height: "100%",
  },
  gridContent: {
    flex: 1,
    margin: 0,
    padding: 0,
  },
  cardImage: {
    width: 48,
    height: 48,
    marginBottom: 4,
  },
  cardImageLabel: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  listContainer: {
    paddingVertical: 8,
    backgroundColor: "blue",
  },
  listItem: {
    flex: 1,
    marginVertical: 6,
    marginHorizontal: 12,
  },
  listContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
  },
  listImage: {
    width: 48,
    height: 48,
    marginRight: 24,
  },
  listLabel: {
    fontSize: 18,
    fontWeight: "600",
  },
});
