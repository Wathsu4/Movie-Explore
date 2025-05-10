import React, { useContext } from "react";
import { Typography, Grid, Container, Alert } from "@mui/material";
import { FavoritesContext } from "../contexts/FavoritesContext";
import MovieCard from "../components/MovieCard/MovieCard";

const FavoritesPage = () => {
  const { favorites } = useContext(FavoritesContext);

  return (
    <Container sx={{ py: 2 }}>
      {" "}
      {/* py is padding top/bottom */}
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Your Favorite Movies
      </Typography>
      {favorites.length === 0 ? (
        <Alert severity="info">
          You haven't added any movies to your favorites yet. Start exploring
          and add some!
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {favorites.map((movie) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={movie.id}>
              <MovieCard movie={movie} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default FavoritesPage;
