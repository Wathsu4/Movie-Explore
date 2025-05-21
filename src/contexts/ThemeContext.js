import React, { createContext, useState, useMemo, useEffect } from "react";
import {
  ThemeProvider as MuiThemeProvider,
  createTheme,
} from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

// Create the context
export const CustomThemeContext = createContext({
  mode: "light",
  toggleTheme: () => {},
});

// Create the provider component
export const CustomThemeProvider = ({ children }) => {
  // State to hold the current theme mode ('light' or 'dark')
  const [mode, setMode] = useState(() => {
    // Get initial mode from localStorage or default to 'light'
    const storedMode = localStorage.getItem("themeMode");
    return storedMode ? storedMode : "light";
  });

  // Function to toggle the theme
  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  };

  // Store the mode in localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("themeMode", mode);
  }, [mode]);

  // useMemo to recompute the theme only when 'mode' changes
  // This prevents unnecessary re-creations of the theme object
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode, // This tells MUI whether to use the light or dark palette
          ...(mode === "light"
            ? {
                // Palette values for light mode
                primary: { main: "#000" }, // Default MUI blue
                secondary: { main: "#dc004e" }, // Default MUI pink
                background: { default: "#f4f6f8", paper: "#ffffff" },
              }
            : {
                // Palette values for dark mode
                primary: { main: "#90caf9" }, // Lighter blue for dark mode
                secondary: { main: "#f48fb1" }, // Lighter pink
                background: { default: "#121212", paper: "#1e1e1e" }, // Common dark mode bg colors
              }),
        },
        typography: {
          fontFamily: "Roboto, Arial, sans-serif",
        },
      }),
    [mode]
  );

  // The value provided to consuming components
  const contextValue = useMemo(
    () => ({ mode, toggleTheme }),
    [mode, toggleTheme]
  );

  return (
    <CustomThemeContext.Provider value={contextValue}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline /> {children}
      </MuiThemeProvider>
    </CustomThemeContext.Provider>
  );
};
