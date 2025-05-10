import React, { useState, useEffect } from "react";
import { Typography, CircularProgress, Alert, Grid } from "@mui/material";
import { fetchTrendingMovies, searchMovies } from "../services/tmdbService";
import MovieCard from "../components/MovieCard/MovieCard";
import SearchBar from "../components/SearchBar/SearchBar";

const HomePage = () => {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [trendingLoading, setTrendingLoading] = useState(true);
  const [trendingError, setTrendingError] = useState(null);

  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [currentSearchQuery, setCurrentSearchQuery] = useState(""); // To know if we are showing search results

  // Fetch Trending Movies
  useEffect(() => {
    const getTrending = async () => {
      try {
        setTrendingLoading(true);
        setTrendingError(null);
        const movies = await fetchTrendingMovies();
        setTrendingMovies(movies);
      } catch (err) {
        setTrendingError(
          "Failed to fetch trending movies. Please try again later."
        );
        console.error(err);
      } finally {
        setTrendingLoading(false);
      }
    };
    if (!currentSearchQuery) {
      getTrending();
    }
  }, [currentSearchQuery]);

  // Handle Search
  const handleSearch = async (query) => {
    setCurrentSearchQuery(query); // Set the current query
    setSearchLoading(true);
    setSearchError(null);
    setSearchResults([]); // Clear previous results immediately
    try {
      const data = await searchMovies(query);
      setSearchResults(data.results);
      if (data.results.length === 0) {
        setSearchError(
          `No movies found for "${query}". Try a different search term.`
        );
      }
    } catch (err) {
      setSearchError(`Failed to search for movies. Please try again later.`);
      console.error(err);
    } finally {
      setSearchLoading(false);
    }
  };

  // Determine what to display
  const moviesToDisplay = currentSearchQuery ? searchResults : trendingMovies;
  const isLoading = currentSearchQuery ? searchLoading : trendingLoading;
  const errorToShow = currentSearchQuery ? searchError : trendingError;
  const title = currentSearchQuery
    ? `Search Results for "${currentSearchQuery}"`
    : "Trending Movies";

  return (
    <div>
      <SearchBar onSearch={handleSearch} /> {/* Add SearchBar here */}
      <Typography variant="h4" gutterBottom sx={{ mt: 2, mb: 3 }}>
        {title}
      </Typography>
      {isLoading && (
        <CircularProgress sx={{ display: "block", margin: "20px auto" }} />
      )}
      {errorToShow && !isLoading && (
        <Alert
          severity={
            currentSearchQuery && searchResults.length === 0 && !searchLoading
              ? "info"
              : "error"
          }
          sx={{ mt: 2 }}
        >
          {errorToShow}
        </Alert>
      )}
      {!isLoading &&
        !errorToShow &&
        moviesToDisplay.length === 0 &&
        currentSearchQuery && (
          <Typography sx={{ mt: 2 }}>
            No results found for "{currentSearchQuery}".
          </Typography>
        )}
      {!isLoading &&
        (moviesToDisplay.length > 0 ||
          (currentSearchQuery && searchResults.length > 0)) && (
          <Grid container spacing={3}>
            {moviesToDisplay.map((movie) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={movie.id}>
                <MovieCard movie={movie} />
              </Grid>
            ))}
          </Grid>
        )}
      {/* If not searching and no trending movies and no error (e.g. initial state before trending loads or if trending fails silently) */}
      {!isLoading &&
        !errorToShow &&
        moviesToDisplay.length === 0 &&
        !currentSearchQuery && (
          <Typography sx={{ mt: 2 }}>
            No trending movies to display at the moment.
          </Typography>
        )}
    </div>
  );
};

export default HomePage;
