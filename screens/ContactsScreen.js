import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SectionList,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useGlobalState } from "../context/GlobalStateContext";
import ContactForm from "../forms/ContactForm";
import Contact from "../models/Contact";

function groupContacts(contacts) {
  // Group contacts by first letter of name
  if (!Array.isArray(contacts) || contacts.length === 0) return [];
  const groups = {};
  contacts.forEach((contact) => {
    let name =
      typeof contact.getFullName === "function"
        ? contact.getFullName()
        : contact.name || "";
    // If name is empty, try to build from firstName/lastName
    if (!name && contact) {
      name = `${contact.firstName || ""} ${contact.lastName || ""}`.trim();
    }
    const letter = name[0]?.toUpperCase() || "?";
    if (!groups[letter]) groups[letter] = [];
    groups[letter].push({ ...contact, name });
  });
  // Convert to SectionList format
  return Object.keys(groups)
    .sort()
    .map((letter) => ({
      title: letter,
      data: groups[letter].sort((a, b) =>
        (a.name || "").localeCompare(b.name || "")
      ),
    }));
}

export default function ContactsScreen() {
  const { contacts, setContacts } = useGlobalState();
  const [formVisible, setFormVisible] = React.useState(false);
  const [editingContact, setEditingContact] = React.useState(null);

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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.header}>Contacts</Text>
        <TouchableOpacity style={styles.addBtn} onPress={handleAddContact}>
          <Ionicons name="add-circle" size={48} color="#007AFF" />
        </TouchableOpacity>
      </View>
      <SectionList
        sections={groupContacts(contacts)}
        keyExtractor={(item) => item.id}
        renderSectionHeader={({ section: { title } }) => (
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionHeaderText}>{title}</Text>
          </View>
        )}
        renderItem={({ item }) => {
          const contact = item instanceof Contact ? item : new Contact(item);
          return (
            <TouchableOpacity
              style={styles.contactRow}
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
  container: { flex: 1, backgroundColor: "#fff" },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  header: { fontSize: 28, fontWeight: "bold" },
  addBtn: { marginLeft: 12 },
  sectionHeader: {
    backgroundColor: "#f0f0f0",
    paddingVertical: 4,
    paddingHorizontal: 16,
  },
  sectionHeaderText: { fontSize: 18, fontWeight: "bold", color: "#007AFF" },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  contactName: { fontSize: 18, fontWeight: "500" },
  contactPhone: { fontSize: 16, color: "#888" },
  deleteBtn: { backgroundColor: "#FF3B30", padding: 12, borderRadius: 4 },
  emptyText: {
    textAlign: "center",
    marginTop: 32,
    color: "#888",
    fontSize: 16,
  },
});
