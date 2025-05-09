import React from "react";
import { Typography } from "@mui/material";

const HomePage = () => {
  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Welcome to Movie Explorer
      </Typography>
      <Typography variant="body1">
        Search for movies or discover trending ones!
      </Typography>
    </div>
  );
};

export default HomePage;
