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
    console.error("Error fetching trending movies:", error);
    throw error;
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
    console.error(
      `Error searching movies for query "${query}":`,
      error.response ? error.response.data : error.message
    );
    throw error;
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
    console.error(
      `Error fetching details for movie ID ${movieId}:`,
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

export default tmdbAPI;
