import React from "react";
import { useState, useEffect } from "react";
import axios from "./axios";
import "./Row.css";
import Youtube from "react-youtube";
import movieTrailer from "movie-trailer";

const base_URL = "https://image.tmdb.org/t/p/original/";

function Row({ title, fetchUrl, isLargeRow }) {
  const [movies, setMovies] = useState([]);
  const [trailerUrl, setTrailerURL] = useState("");

  useEffect(() => {
    async function fetchData() {
      const request = await axios.get(fetchUrl);
      setMovies(request.data.results);
      return request;
    }
    fetchData();
  }, [fetchUrl]);

  const opts = {
    heigth: "390",
    width: "100%",
    playerVars: {
      //https://
      autoplay: 1,
    },
  };

  const handleClick = (movie) => {
    console.log("full m ", movie);
    console.log("movie", movie.name);
    if (trailerUrl) {
      setTrailerURL("");
    } else {
      // Search for movie trailer full url
      movieTrailer(movie?.name || movie.title || "")
        .then((url) => {
          // https://www.youtube.com/watch?v=aSØDÆømlsdæ
          const urlParams = new URLSearchParams(new URL(url).search); // urlParams gives us everthing after the ?
          setTrailerURL(urlParams.get("v")); //urlParams gives us everything after v=
          // Displays error message if unable to find url
        })
        .catch((error) => console.log("catch", error));
    }
  };

  return (
    <div className="row">
      <button onClick={() => console.log(trailerUrl)}>show url</button>
      <h2>{title}</h2>
      <div className="row_posters">
        {movies.map((movie) => (
          <img
            key={movies.id}
            onClick={() => handleClick(movie)}
            className={`row_poster ${isLargeRow && "row_posterLarge"}`}
            src={`${base_URL}${
              isLargeRow ? movie.poster_path : movie.backdrop_path
            }`}
            alt={movie.name}
          />
        ))}
      </div>
      {trailerUrl && <Youtube videoId={trailerUrl} opts={opts} />}
    </div>
  );
}

export default Row;
