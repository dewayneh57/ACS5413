/**
 * ACS5413 - Personal Health Management
 * Dewayne Hafenstein - HAFE0010
 *
 * This screen displays a list of contacts, allowing the user to add, edit, and delete contacts.
 * It uses a SectionList to group contacts by the first letter of their last name. This paradigm
 * is relatively common in contact management applications, as it allows for easier navigation
 * and organization of contacts.
 */
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  Dimensions,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useGlobalState } from "../context/GlobalStateContext";
import ContactForm from "../forms/ContactForm";
import Contact from "../models/Contact";

/**
 *
 * @returns The ContactsScreen component, which displays a list of contacts.
 * It allows the user to add, edit, and delete contacts using a modal form.
 */
export default function ContactsScreen() {
  const { contacts, setContacts } = useGlobalState();
  const [formVisible, setFormVisible] = React.useState(false);
  const [editingContact, setEditingContact] = React.useState(null);
  const [windowWidth, setWindowWidth] = useState(
    Dimensions.get("window").width
  );

  useEffect(() => {
    const onChange = ({ window }) => setWindowWidth(window.width);
    const sub = Dimensions.addEventListener("change", onChange);
    return () => {
      if (sub?.remove) sub.remove();
      else Dimensions.removeEventListener("change", onChange);
    };
  }, []);
  const isPortrait = windowWidth < 500;
  const numColumns = isPortrait ? 2 : 4;

  const handleAddContact = () => {
    setEditingContact(null);
    setFormVisible(true);
  };

  const handleSaveContact = (form) => {
    if (editingContact) {
      // Update existing contact
      setContacts((prev) =>
        prev.map((c) =>
          c.id === editingContact.id
            ? new Contact({ ...c, ...form, id: editingContact.id })
            : c
        )
      );
    } else {
      // Add new contact
      const newContact = new Contact({
        id: Date.now().toString(),
        ...form,
      });
      setContacts((prev) => [...prev, newContact]);
    }
    setFormVisible(false);
    setEditingContact(null);
  };

  const handleEditContact = (contact) => {
    setEditingContact(contact);
    setFormVisible(true);
  };

  const handleDeleteContact = (form) => {
    setContacts((prev) =>
      prev.filter((c) => c.id !== (form.id || editingContact.id))
    );
    setFormVisible(false);
    setEditingContact(null);
  };

  // Sort contacts alphabetically by last name, fallback to first name
  const sortedContacts = [...contacts].sort((a, b) => {
    const aName = a.lastName || a.firstName || "";
    const bName = b.lastName || b.firstName || "";
    return aName.localeCompare(bName);
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Contacts</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddContact}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={sortedContacts}
        keyExtractor={(item) => item.id}
        numColumns={numColumns}
        renderItem={({ item }) => {
          const contact = item instanceof Contact ? item : new Contact(item);
          return (
            <TouchableOpacity
              style={[styles.contactRow, { flex: 1 / numColumns }]}
              onPress={() => handleEditContact(item)}
            >
              <View style={{ flex: 1 }}>
                <Text style={styles.contactName}>{contact.getFullName()}</Text>
                <Text style={styles.contactPhone}>
                  {contact.getDisplayPhone() || "No phone"}
                </Text>
              </View>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No contacts found.</Text>
        }
        contentContainerStyle={{ paddingBottom: 24 }}
      />
      <ContactForm
        visible={formVisible}
        onClose={() => {
          setFormVisible(false);
          setEditingContact(null);
        }}
        onSave={handleSaveContact}
        onDelete={editingContact ? handleDeleteContact : undefined}
        initialValues={editingContact}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  header: {
    backgroundColor: "#007AFF",
    paddingTop: StatusBar.currentHeight || 44,
    paddingBottom: 16,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  addButton: {
    backgroundColor: "rgba(255,255,255,0.2)",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "300",
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eeeeee",
  },
  contactName: { fontSize: 18, fontWeight: "500" },
  contactPhone: { fontSize: 16, color: "#888" },
  deleteBtn: { backgroundColor: "#FF3B30", padding: 12, borderRadius: 4 },
  emptyText: {
    textAlign: "center",
    marginTop: 32,
    color: "#888888",
    fontSize: 16,
  },
});
