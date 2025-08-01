/**
 * ACS5413 - Personal Health Management
 * Dewayne Hafenstein - HAFE0010
 *
 * PillImagePicker - Component for taking photos or selecting images of pills
 */

import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  StyleSheet,
  Modal,
  Dimensions,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";

export default function PillImagePicker({
  imageUri,
  onImageSelected,
  onImageRemoved,
}) {
  const [modalVisible, setModalVisible] = useState(false);

  const requestPermissions = async () => {
    try {
      // Request camera permissions
      const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
      if (cameraStatus.status !== "granted") {
        Alert.alert(
          "Camera Permission Required",
          "Please enable camera access in your device settings to take photos of your pills.",
          [{ text: "OK" }]
        );
        return { camera: false, mediaLibrary: false };
      }

      // Request media library permissions
      const mediaLibraryStatus =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (mediaLibraryStatus.status !== "granted") {
        Alert.alert(
          "Photo Library Permission Required",
          "Please enable photo library access in your device settings to select pill images.",
          [{ text: "OK" }]
        );
        return { camera: true, mediaLibrary: false };
      }

      return { camera: true, mediaLibrary: true };
    } catch (error) {
      console.error("Error requesting permissions:", error);
      return { camera: false, mediaLibrary: false };
    }
  };

  const takePhoto = async () => {
    try {
      const permissions = await requestPermissions();
      if (!permissions.camera) return;

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        onImageSelected(result.assets[0].uri);
        setModalVisible(false);
      }
    } catch (error) {
      console.error("Error taking photo:", error);
      Alert.alert("Error", "Failed to take photo. Please try again.");
    }
  };

  const pickFromLibrary = async () => {
    try {
      const permissions = await requestPermissions();
      if (!permissions.mediaLibrary) return;

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        onImageSelected(result.assets[0].uri);
        setModalVisible(false);
      }
    } catch (error) {
      console.error("Error picking from library:", error);
      Alert.alert("Error", "Failed to select image. Please try again.");
    }
  };

  const handleRemoveImage = () => {
    Alert.alert(
      "Remove Image",
      "Are you sure you want to remove this pill image?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => onImageRemoved(),
        },
      ]
    );
  };

  const showImageOptions = () => {
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Pill Image</Text>

      {imageUri ? (
        <View style={styles.imageContainer}>
          <Image source={{ uri: imageUri }} style={styles.pillImage} />
          <View style={styles.imageOverlay}>
            <TouchableOpacity
              style={styles.overlayButton}
              onPress={showImageOptions}
            >
              <Ionicons name="camera" size={20} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.overlayButton}
              onPress={handleRemoveImage}
            >
              <Ionicons name="trash" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <TouchableOpacity
          style={styles.addImageButton}
          onPress={showImageOptions}
        >
          <Ionicons name="camera" size={40} color="#007AFF" />
          <Text style={styles.addImageText}>Add Pill Photo</Text>
          <Text style={styles.addImageSubtext}>
            Take a photo or select from library
          </Text>
        </TouchableOpacity>
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Pill Image</Text>

            <TouchableOpacity style={styles.modalButton} onPress={takePhoto}>
              <Ionicons name="camera" size={24} color="#007AFF" />
              <Text style={styles.modalButtonText}>Take Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalButton}
              onPress={pickFromLibrary}
            >
              <Ionicons name="images" size={24} color="#007AFF" />
              <Text style={styles.modalButtonText}>Choose from Library</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={[styles.modalButtonText, styles.cancelButtonText]}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 8,
  },
  imageContainer: {
    position: "relative",
    alignSelf: "center",
  },
  pillImage: {
    width: 120,
    height: 120,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
  },
  imageOverlay: {
    position: "absolute",
    top: 4,
    right: 4,
    flexDirection: "row",
  },
  overlayButton: {
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 4,
  },
  addImageButton: {
    borderWidth: 2,
    borderColor: "#ddd",
    borderStyle: "dashed",
    borderRadius: 8,
    padding: 20,
    alignItems: "center",
    backgroundColor: "#f9f9f9",
  },
  addImageText: {
    color: "#007AFF",
    fontSize: 16,
    fontWeight: "500",
    marginTop: 8,
  },
  addImageSubtext: {
    color: "#666",
    fontSize: 12,
    marginTop: 4,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  modalButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 8,
    backgroundColor: "#f8f8f8",
    marginBottom: 12,
  },
  modalButtonText: {
    fontSize: 16,
    marginLeft: 12,
    color: "#007AFF",
    fontWeight: "500",
  },
  cancelButton: {
    backgroundColor: "#f0f0f0",
    marginTop: 8,
  },
  cancelButtonText: {
    color: "#666",
    textAlign: "center",
    marginLeft: 0,
  },
});
