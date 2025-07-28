import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Image } from "react-native";
import HomeStack from "./HomeStack";
import SettingsScreen from "../screens/SettingsScreen";

const Tab = createBottomTabNavigator();

export default function MainTabsComponent({ orientation }) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          if (route.name === "Settings") {
            return (
              <Image
                source={require("../assets/icons/settings.png")}
                style={{ width: size, height: size, tintColor: color }}
                resizeMode="contain"
              />
            );
          }
          return (
            <Image
              source={require("../assets/icons/home.png")}
              style={{ width: size, height: size, tintColor: color }}
              resizeMode="contain"
            />
          );
        },
        tabBarActiveTintColor: "blue",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen
        name="Home"
        children={(props) => <HomeStack {...props} orientation={orientation} />}
        options={{ headerShown: false }}
      />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}
