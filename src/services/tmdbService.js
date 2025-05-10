import axios from "axios";

const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

const tmdbAPI = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
  },
});

export const fetchTrendingMovies = async (timeWindow = "day") => {
  try {
    const response = await tmdbAPI.get(`/trending/movie/${timeWindow}`);
    console.log("Response from TMDB API: ", response);
    return response.data.results;
  } catch (error) {
    let errorMessage =
      "An unexpected error occurred while fetching trending movies.";
    if (error.response) {
      // Server responded with a status code out of the 2xx range
      console.error(
        "Error fetching trending movies (server response):",
        error.response.data
      );
      errorMessage =
        error.response.data?.status_message ||
        `Server error: ${error.response.status}`;
    } else if (error.request) {
      // Request was made but no response received (e.g., network issue)
      console.error(
        "Error fetching trending movies (no response):",
        error.request
      );
      errorMessage = "Network error. Please check your connection.";
    } else {
      // Something else happened in setting up the request
      console.error(
        "Error fetching trending movies (setup issue):",
        error.message
      );
      errorMessage = error.message;
    }
    // Instead of just throwing error, throw an error object with a user-friendly message
    const customError = new Error(errorMessage);
    customError.originalError = error;
    throw customError;
  }
};

export const searchMovies = async (query, page = 1) => {
  try {
    const response = await tmdbAPI.get("/search/movie", {
      params: {
        query: query,
        page: page,
        include_adult: false,
      },
    });
    return response.data;
  } catch (error) {
    let errorMessage = `An unexpected error occurred while searching for "${query}".`;
    if (error.response) {
      console.error(
        `Error searching movies for query "${query}" (server response):`,
        error.response.data
      );
      errorMessage =
        error.response.data?.status_message ||
        `Server error: ${error.response.status}`;
    } else if (error.request) {
      console.error(
        `Error searching movies for query "${query}" (no response):`,
        error.request
      );
      errorMessage = "Network error. Please check your connection.";
    } else {
      console.error(
        `Error searching movies for query "${query}" (setup issue):`,
        error.message
      );
      errorMessage = error.message;
    }
    const customError = new Error(errorMessage);
    customError.originalError = error;
    throw customError;
  }
};

export const fetchMovieDetails = async (movieId) => {
  try {
    const response = await tmdbAPI.get(`/movie/${movieId}`, {
      params: {
        append_to_response: "videos,credits", // Get videos and credits in the same call
      },
    });
    return response.data; // Full movie object with 'videos' and 'credits' nested
  } catch (error) {
    let errorMessage = `An unexpected error occurred while fetching details for movie ID ${movieId}.`;
    if (error.response) {
      console.error(
        `Error fetching details for movie ID ${movieId} (server response):`,
        error.response.data
      );
      errorMessage =
        error.response.data?.status_message ||
        `Server error: ${error.response.status}`;
      if (error.response.status === 404) {
        errorMessage = `Movie with ID ${movieId} not found. It might have been removed or the ID is incorrect.`;
      }
    } else if (error.request) {
      console.error(
        `Error fetching details for movie ID ${movieId} (no response):`,
        error.request
      );
      errorMessage = "Network error. Please check your connection.";
    } else {
      console.error(
        `Error fetching details for movie ID ${movieId} (setup issue):`,
        error.message
      );
      errorMessage = error.message;
    }
    const customError = new Error(errorMessage);
    customError.originalError = error;
    throw customError;
  }
};

export const fetchMovieGenres = async () => {
  try {
    const response = await tmdbAPI.get("/genre/movie/list");
    return response.data.genres; // Array of {id, name}
  } catch (error) {
    console.error("Error fetching movie genres:", error);
    throw new Error(
      error.response?.data?.status_message || "Could not fetch genres."
    );
  }
};

export default tmdbAPI;
