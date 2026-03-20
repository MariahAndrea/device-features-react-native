import React from "react";
import "react-native-gesture-handler";
import { ThemeProvider } from "./src/components/ThemeProvider";
import AppNavigator from "./src/navigation/AppNavigator";

export default function App() {
  return (
    <ThemeProvider>
      <AppNavigator />
    </ThemeProvider>
  );
}
