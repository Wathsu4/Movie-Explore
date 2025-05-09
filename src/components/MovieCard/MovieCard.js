import React from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Button,
  Rating,
  Box,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

const MovieCard = ({ movie }) => {
  const posterBaseUrl = "https://image.tmdb.org/t/p/w500";

  if (!movie || !movie.id || !movie.title) {
    return null;
  }

  return (
    <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <CardMedia
        component="img"
        height="300"
        image={
          movie.poster_path
            ? `${posterBaseUrl}${movie.poster_path}`
            : "https://via.placeholder.com/500x750?text=No+Image"
        }
        alt={movie.title}
        sx={{ objectFit: "cover" }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h6" component="div" noWrap>
          {movie.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Release:{" "}
          {movie.release_date
            ? new Date(movie.release_date).getFullYear()
            : "N/A"}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
          <Rating
            name="read-only"
            value={movie.vote_avarage / 2}
            precision={0.1}
            readOnly
            size="small"
          />
          <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
            ({movie.vote_avarage ? movie.vote_avarage.toFixed(1) : "N/A"})
          </Typography>
        </Box>
      </CardContent>
      <CardActions>
        <Button size="small" component={RouterLink} to={`/movie/${movie.id}`}>
          View Details
        </Button>
      </CardActions>
    </Card>
  );
};

export default MovieCard;
