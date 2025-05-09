import React, { useState, useEffect } from "react";
import { Typography, CircularProgress, Alert, Grid } from "@mui/material";
import { fetchTrendingMovies } from "../services/tmdbService";
import MovieCard from "../components/MovieCard/MovieCard";

const HomePage = () => {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getTrending = async () => {
    try {
      setLoading(true);
      setError(null);
      const movies = await fetchTrendingMovies();
      setTrendingMovies(movies);
    } catch (err) {
      setError("Failed to fetch trending movies.Please try again later");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTrending();
  }, []);
  // Empty dependency array means this runs once on mount (Components mount when the page loads or refresh)

  if (loading) {
    return <CircularProgress sx={{ display: "block", margin: "20px auto" }} />;
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}{" "}
      </Alert>
    );
  }

  return (
    <div>
      <Typography variant="h4" gutterBottom sx={{ mt: 2, mb: 3 }}>
        Trending Movies
      </Typography>
      <Grid container spacing={3}>
        {trendingMovies.map((movie) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={movie.id}>
            <MovieCard movie={movie} />
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default HomePage;
