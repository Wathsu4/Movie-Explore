import React from "react";
import { useParams } from "react-router-dom";
import { Typography } from "@mui/material";

const MovieDetailsPage = () => {
  const { id } = useParams(); //Hook to get URL parameters(like movie ID)

  return (
    <div>
      <Typography variant="h4">Movie Details</Typography>
      <Typography variant="body1">Details for Movie ID: {id} </Typography>
    </div>
  );
};

export default MovieDetailsPage;
