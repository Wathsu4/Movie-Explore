import React, { useState, useEffect, useMemo } from "react";
import {
  Typography,
  CircularProgress,
  Alert,
  Grid,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Slider,
  Button,
  Container,
} from "@mui/material";
import {
  fetchTrendingMovies,
  searchMovies,
  fetchMovieGenres,
} from "../services/tmdbService";
import MovieCard from "../components/MovieCard/MovieCard";
import SearchBar from "../components/SearchBar/SearchBar";
import heroBackground from "../assets/hero-background.jpg";

const HomePage = () => {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [trendingLoading, setTrendingLoading] = useState(true);
  const [trendingError, setTrendingError] = useState(null);

  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);

  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(""); // Store genre ID
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedRating, setSelectedRating] = useState([0, 10]); // MUI Slider range

  const [searchCurrentPage, setSearchCurrentPage] = useState(1);
  const [searchTotalPages, setSearchTotalPages] = useState(0);

  const [isAppendingResults, setIsAppendingResults] = useState(false); // For "Load More" loading state

  const loadMoreMovies = async () => {
    if (
      searchLoading ||
      isAppendingResults ||
      searchCurrentPage >= searchTotalPages
    )
      return;

    setIsAppendingResults(true);
    setSearchError(null);
    const nextPageToFetch = searchCurrentPage + 1;

    try {
      const data = await searchMovies(currentSearchQuery, nextPageToFetch);
      setSearchResults((prevResults) => [...prevResults, ...data.results]); // Append results
      setSearchCurrentPage(nextPageToFetch);
      setSearchTotalPages(data.total_pages);
    } catch (err) {
      setSearchError(err.message || "Failed to load more movies.");
      console.error(err.originalError || err);
    } finally {
      setIsAppendingResults(false);
    }
  };

  const [searchBarQuery, setSearchBarQuery] = useState(() => {
    return localStorage.getItem("lastSearchQuery") || "";
  });

  const [currentSearchQuery, setCurrentSearchQuery] = useState(""); // To know if we are showing search results

  // Fetch Trending Movies or Last Search on Initial Load
  useEffect(() => {
    const initialLastSearch = localStorage.getItem("lastSearchQuery");
    if (initialLastSearch) {
      handleSearch(initialLastSearch, true); // true indicates it's an initial load search
    } else if (!currentSearchQuery) {
      // If no last search, fetch trending
      getTrendingMovies();
    }
  }, []); // Run once on mount

  // Fetch Trending Movies
  const getTrendingMovies = async () => {
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

  useEffect(() => {
    if (!currentSearchQuery && !localStorage.getItem("lastSearchQuery")) {
      getTrendingMovies();
    }
  }, [currentSearchQuery]);

  // Handle Search
  const handleSearch = async (query, isInitialLoad = false) => {
    if (!query.trim()) {
      setCurrentSearchQuery(""); // Clear results if query is empty
      setSearchResults([]);
      localStorage.removeItem("lastSearchQuery"); // Remove from local storage

      setSearchCurrentPage(1);
      setSearchTotalPages(0);
      return;
    }

    setCurrentSearchQuery(query);
    if (!isInitialLoad) {
      setSearchBarQuery(query);
    }
    localStorage.setItem("lastSearchQuery", query); // Save to localStorage

    setSearchLoading(true);
    setSearchError(null);
    setSearchResults([]);

    const newPageToFetch = 1; // Always fetch page 1 for a new search
    setSearchCurrentPage(newPageToFetch);

    try {
      const data = await searchMovies(query, newPageToFetch);
      setSearchResults(data.results);
      setSearchTotalPages(data.total_pages);
      if (data.results.length === 0) {
        setSearchError(
          `No movies found for "${query}". Try a different search term.`
        );
      }
    } catch (err) {
      setSearchError(err.message);
      console.error(err.originalError || err);
    } finally {
      setSearchLoading(false);
    }
  };

  // Fetch genres on mount
  useEffect(() => {
    const getGenres = async () => {
      try {
        const genreData = await fetchMovieGenres();
        setGenres(genreData);
      } catch (error) {
        console.error("Failed to load genres for filtering:", error.message);
      }
    };
    getGenres();
  }, []);

  // Determine what to display (original logic before filtering)
  let baseMoviesToDisplay = currentSearchQuery ? searchResults : trendingMovies;

  // Apply filters
  const filteredMovies = useMemo(() => {
    return baseMoviesToDisplay.filter((movie) => {
      let matchesGenre = true;
      let matchesYear = true;
      let matchesRating = true;

      if (selectedGenre) {
        // movie.genre_ids is an array of numbers from TMDb trending/search
        matchesGenre = movie.genre_ids?.includes(parseInt(selectedGenre));
      }

      if (selectedYear) {
        matchesYear = movie.release_date?.startsWith(selectedYear);
      }

      if (movie.vote_average !== undefined) {
        // Check if vote_average exists
        matchesRating =
          movie.vote_average >= selectedRating[0] &&
          movie.vote_average <= selectedRating[1];
      } else {
        // if no rating, decide if it should be included or not
        matchesRating = selectedRating[0] === 0; // e.g. include if min rating is 0
      }

      return matchesGenre && matchesYear && matchesRating;
    });
  }, [baseMoviesToDisplay, selectedGenre, selectedYear, selectedRating]);

  // Use filteredMovies for display
  const moviesToDisplay = filteredMovies;
  const isLoading = currentSearchQuery ? searchLoading : trendingLoading;
  const errorToShow = currentSearchQuery ? searchError : trendingError;
  // Adjust title or add info if filters are active
  let title = currentSearchQuery
    ? `Search Results for "${currentSearchQuery}"`
    : "Trending Movies";
  if (
    selectedGenre ||
    selectedYear ||
    selectedRating[0] > 0 ||
    selectedRating[1] < 10
  ) {
    title += " (Filtered)";
  }

  console.log("Button debug:", {
    hasQuery: !!currentSearchQuery,
    hasResults: searchResults.length > 0,
    pages: `${searchCurrentPage} of ${searchTotalPages}`,
    isLoading: searchLoading,
    shouldShow:
      currentSearchQuery &&
      searchResults.length > 0 &&
      searchCurrentPage < searchTotalPages &&
      !searchLoading,
  });

  return (
    <div>
      <Box
        sx={{
          background: `linear-gradient(to bottom, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.6)), url(${heroBackground})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "50vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "2rem 0",
          marginBottom: "2rem",
          color: "white",
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            component="h1"
            sx={{
              mb: 3,
              textAlign: "center",
              textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
            }}
          >
            Discover Movies
          </Typography>
          <SearchBar initialQuery={searchBarQuery} onSearch={handleSearch} />
        </Container>
      </Box>

      <Container maxWidth="lg">
        <Box
          sx={{
            my: 3,
            p: 2,
            backgroundColor: "action.hover",
            borderRadius: 1,
            maxWidth: 900,
            mx: "auto",
          }}
        >
          <Typography variant="h6" gutterBottom align="center">
            Filters
          </Typography>
          <Grid
            container
            spacing={2}
            alignItems="center"
            justifyContent="center"
          >
            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth size="small">
                <InputLabel id="genre-filter-label">Genre</InputLabel>
                <Select
                  labelId="genre-filter-label"
                  id="genre-filter"
                  value={selectedGenre}
                  label="Genre"
                  onChange={(e) => setSelectedGenre(e.target.value)}
                  sx={{
                    minWidth: "160px",
                    "& .MuiSelect-select": {
                      width: "100%",
                      textOverflow: "ellipsis",
                    },
                  }}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 300,
                        minWidth: "200px",
                      },
                    },
                  }}
                >
                  <MenuItem value="">
                    <em>All Genres</em>
                  </MenuItem>
                  {genres.map((genre) => (
                    <MenuItem key={genre.id} value={genre.id}>
                      {genre.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={5}>
              <Typography
                gutterBottom
                sx={{ fontSize: "0.8rem" }}
                align="center"
              >
                Rating (TMDb)
              </Typography>
              <Slider
                size="small"
                value={selectedRating}
                onChange={(e, newValue) => setSelectedRating(newValue)}
                valueLabelDisplay="auto"
                min={0}
                max={10}
                step={0.5}
                marks={[
                  { value: 0, label: "0" },
                  { value: 5, label: "5" },
                  { value: 10, label: "10" },
                ]}
              />
            </Grid>
          </Grid>
        </Box>

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

        {currentSearchQuery &&
          searchResults.length > 0 &&
          searchCurrentPage < searchTotalPages &&
          !searchLoading && (
            <Box textAlign="center" sx={{ mt: 3, mb: 2 }}>
              <Button
                variant="contained"
                onClick={loadMoreMovies}
                disabled={isAppendingResults}
              >
                {isAppendingResults ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Load More Results"
                )}
              </Button>
            </Box>
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
      </Container>
    </div>
  );
};

export default HomePage;
