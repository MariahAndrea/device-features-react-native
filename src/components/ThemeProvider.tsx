import React, { createContext, useContext, useState } from "react";
import { useColorScheme } from "react-native";
import { theme } from "../styles/Style";

const ThemeContext = createContext({
  isDark: false,
  colors: theme.light,
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const systemScheme = useColorScheme();
  const [isDark, setIsDark] = useState(systemScheme === "dark");

  const toggleTheme = () => setIsDark(!isDark);
  const colors = isDark ? theme.dark : theme.light;

  return (
    <ThemeContext.Provider value={{ isDark, colors, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
