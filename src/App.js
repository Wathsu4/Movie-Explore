import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import MovieDetailsPage from "./pages/MovieDetailsPage";
import FavoritesPage from "./pages/FavoritesPage";
import Navbar from "./components/Navbar/Navbar";
import { Container } from "@mui/material"; // For basic layout centering/padding
import { CustomThemeProvider } from "./contexts/ThemeContext";
import { FavoritesProvider } from "./contexts/FavoritesContext";
import "./App.css";

function App() {
  return (
    <CustomThemeProvider>
      <FavoritesProvider>
        <Router>
          <Navbar />
          <Container sx={{ mt: 4, mb: 4 }}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/movie/:id" element={<MovieDetailsPage />} />
              <Route path="/favorites" element={<FavoritesPage />} />
            </Routes>
          </Container>
        </Router>
      </FavoritesProvider>
    </CustomThemeProvider>
  );
}

export default App;
