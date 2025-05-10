import React, { useContext } from "react";
import { AppBar, Toolbar, Typography, Button, IconButton } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { CustomThemeContext } from "../../contexts/ThemeContext";
import Brightness4Icon from "@mui/icons-material/Brightness4"; // Dark mode icon
import Brightness7Icon from "@mui/icons-material/Brightness7"; // Light mode icon

const Navbar = () => {
  const { mode, toggleTheme } = useContext(CustomThemeContext); // Consume the context

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Movie Explorer
        </Typography>
        <Button color="inherit" component={RouterLink} to="/">
          Home
        </Button>
        <Button color="inherit" component={RouterLink} to="/favorites">
          Favorites
        </Button>
        <Button color="inherit" component={RouterLink} to="/login">
          Login
        </Button>
        <IconButton sx={{ ml: 1 }} onClick={toggleTheme} color="inherit">
          {mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
