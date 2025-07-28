import { View, StyleSheet, Dimensions } from "react-native";
import React, { useState, useEffect } from "react";

function Card({ children }) {
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
  // Adjust styles based on orientation
  const cardStyle = [
    styles.card,
    isPortrait
      ? {
          marginTop: 12,
          marginLeft: "5%",
          marginRight: "5%",
          padding: 12,
          alignItems: "center",
          height: 120,
          width: "90%", // 10% less wide in portrait
        }
      : {
          marginTop: 24,
          marginHorizontal: 8, // more space on sides in landscape
          padding: 24,
          alignItems: "flex-start",
          height: 84,
          width: "92%", // less wide for even margins in 4-column grid
        },
  ];
  return <View style={cardStyle}>{children}</View>;
}

export default Card;

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    backgroundColor: "white",
    shadowColor: "darkgray",
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    shadowOpacity: 0.33,
    justifyContent: "center",
    // alignItems and padding/margin now handled in cardStyle
  },
});
