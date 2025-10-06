import { useEffect, useState } from "react";
import axios from "axios";
import type { Movie, MovieResponse } from "../types/movie";

const MoviesPage = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const { data } = await axios.get<MovieResponse>(
          "https://api.themoviedb.org/3/movie/popular?language=ko-KR&page=1",
          {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_TMDB_API_KEY}`,
            },
          }
        );
        setMovies(data.results);
      } catch (error) {
        console.error("영화 데이터 호출 실패:", error);
      }
    };

    fetchMovies();
  }, []);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 p-6">
      {movies.map((movie) => (
        <div
          key={movie.id}
          className="relative rounded-xl overflow-hidden shadow-lg transform transition duration-300 hover:scale-105 cursor-pointer"
        >
          <img
            src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
            alt={movie.title}
            className="w-full h-auto"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent text-white opacity-0 hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 backdrop-blur-sm">
            <h2 className="text-lg font-bold">{movie.title}</h2>
            <p className="text-sm text-gray-300 line-clamp-4">{movie.overview}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MoviesPage;
