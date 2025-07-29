/**
 * ACS5413 - Personal Health Management
 * Dewayne Hafenstein - HAFE0010
 *
 * MapButton component that displays a static map image for a given address
 * and opens Google Maps when tapped. Uses Google Static Maps API for the preview.
 * Based on Week 6 implementation.
 */
import React from "react";
import { View, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

const GOOGLE_API_KEY = "AIzaSyCNLBGhj_k1UMW4yOOknhennQlGDC-Xihg";

export function getMapPreview(lat, lng) {
  // Alternative: Use OpenStreetMap tiles (no API key required)
  // const imagePreviewUrl = `https://tile.openstreetmap.org/14/${Math.floor((lng + 180) / 360 * Math.pow(2, 14))}/${Math.floor((1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, 14))}.png`;

  // Google Maps Static API
  const imagePreviewUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=14&size=400x200&maptype=roadmap&markers=color:red%7Clabel:S%7C${lat},${lng}&key=${GOOGLE_API_KEY}`;
  console.log("Generated map preview URL:", imagePreviewUrl);
  return imagePreviewUrl;
}

export async function getAddress(lat, lng) {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_API_KEY}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch address!");
  }

  const data = await response.json();
  const address = data.results[0].formatted_address;
  return address;
}

/**
 * MapButton Component
 * @param {string} address - The address to display on the map
 * @param {string} entityName - Name of the entity type (for navigation)
 * @param {string} entityTitle - Title of the specific entity (for display)
 * @param {object} style - Additional styles for the button
 * @param {number} width - Width of the map image (default: 100)
 * @param {number} height - Height of the map image (default: 80)
 * @param {number} zoom - Zoom level for the map (default: 15)
 */
export default function MapButton({
  address,
  entityName = "location",
  entityTitle = "Location",
  style,
  width = 100,
  height = 80,
  zoom = 15,
}) {
  const navigation = useNavigation();

  if (!address) {
    return null;
  }

  const getStaticMapUrl = () => {
    const encodedAddress = encodeURIComponent(address);
    return `https://maps.googleapis.com/maps/api/staticmap?center=${encodedAddress}&zoom=${zoom}&size=${width}x${height}&maptype=roadmap&markers=color:red%7Clabel:A%7C${encodedAddress}&key=${GOOGLE_API_KEY}`;
  };

  const handleMapPress = (e) => {
    e.stopPropagation();
    navigation.navigate("MapScreen", {
      address,
      entityName,
      entityTitle,
    });
  };

  return (
    <TouchableOpacity
      style={style}
      onPress={handleMapPress}
      activeOpacity={0.7}
    >
      <Image
        source={{ uri: getStaticMapUrl() }}
        style={{
          width,
          height,
          borderRadius: 8,
        }}
        resizeMode="cover"
      />
    </TouchableOpacity>
  );
}
