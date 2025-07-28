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
    id: "10",
    label: "Allergies",
    icon: require("../assets/icons/allergy.png"),
    screen: "Allergies",
  },
];

export default function CardsGridList({ navigation, viewStyle, orientation }) {
  const numColumns =
    viewStyle === "list" ? 1 : orientation === "landscape" ? 4 : 2;
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
    // Portrait: icon above label; Landscape: icon left, label right, less height
    return (
      <View style={styles.gridContent}>
        <TouchableOpacity onPress={() => navigation.navigate(item.screen)}>
          <Card>
            {orientation === "landscape" ? (
              <View style={styles.landscapeCardContent}>
                <Image source={item.icon} style={styles.landscapeCardImage} />
                <Text style={styles.landscapeCardLabel}>{item.label}</Text>
              </View>
            ) : (
              <>
                <Image source={item.icon} style={styles.cardImage} />
                <Text style={styles.cardImageLabel}>{item.label}</Text>
              </>
            )}
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
      numColumns={numColumns}
      key={viewStyle + numColumns}
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
    flexGrow: 1, // Allow FlatList to fill vertical space
    justifyContent: "center", // Center cards vertically if not enough to fill
    paddingBottom: 24, // Add some bottom padding for scroll
  },
  gridContent: {
    flex: 1,
    margin: 0,
    padding: 0,
    maxWidth: "130%", // Make cards even wider in landscape
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
  landscapeCardContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    height: 64, // 25% less than 84 (from Card.js landscape height)
    paddingHorizontal: 0, // Remove horizontal padding
    width: "100%", // Make the card content fill the card width
  },
  landscapeCardImage: {
    width: 48,
    height: 48,
    marginRight: 16,
    marginLeft: 0, // Ensure icon is at far left
  },
  landscapeCardLabel: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "left",
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
  landscapeCardContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    height: 64, // 25% less than 84 (from Card.js landscape height)
    paddingHorizontal: 0, // Remove horizontal padding
    width: "100%", // Make the card content fill the card width
  },
  landscapeCardImage: {
    width: 48,
    height: 48,
    marginRight: 16,
    marginLeft: 0, // Ensure icon is at far left
  },
  landscapeCardLabel: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "left",
  },
});
