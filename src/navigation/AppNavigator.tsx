import {
    DarkTheme,
    DefaultTheme,
    NavigationContainer,
} from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { StatusBar } from "expo-status-bar";
import { Moon, Sun } from "lucide-react-native";
import React from "react";
import { TouchableOpacity } from "react-native";
import { useTheme } from "../components/ThemeProvider";
import AddEntryScreen from "../screens/AddEntry";
import HomeScreen from "../screens/Home";

const Stack = createStackNavigator();

export default function AppNavigator() {
  const { colors, isDark, toggleTheme } = useTheme();

  const AppNavigationTheme = {
    ...(isDark ? DarkTheme : DefaultTheme),
    colors: {
      ...(isDark ? DarkTheme.colors : DefaultTheme.colors),
      background: colors.bg,
      card: colors.card,
      text: colors.text,
      border: colors.border,
    },
  };

  return (
    <>
      <StatusBar style={isDark ? "light" : "dark"} />
      <NavigationContainer theme={AppNavigationTheme}>
        <Stack.Navigator
          screenOptions={{
            headerStyle: {
              backgroundColor: colors.card,
              elevation: 0,
              shadowOpacity: 0,
            },
            headerTintColor: colors.text,
            headerTitleStyle: { fontWeight: "800" },
            headerRight: () => (
              <TouchableOpacity
                onPress={toggleTheme}
                style={{ marginRight: 20 }}
              >
                {isDark ? (
                  <Sun color={colors.primary} size={24} />
                ) : (
                  <Moon color={colors.primary} size={24} />
                )}
              </TouchableOpacity>
            ),
          }}
        >
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ title: "Sojourn" }}
          />
          <Stack.Screen
            name="AddEntry"
            component={AddEntryScreen}
            options={{ title: "Entry Details" }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}
