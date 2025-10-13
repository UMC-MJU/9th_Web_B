import { Link } from "react-router-dom";
import type { MovieResponse } from "../types/movie";
import useCustomFetch from "../hooks/useCustomFetch";

const MoviesPage = () => {
  const { data, loading, error } = useCustomFetch<MovieResponse>(
    "https://api.themoviedb.org/3/movie/popular?language=ko-KR&page=1",
    []
  );

  if (loading)
    return <div className="text-center mt-10 text-lg"> 영화 불러오는 중...</div>;
  if (error)
    return (
      <div className="text-center mt-10 text-red-500 text-lg">{error}</div>
    );

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 p-6">
      {data?.results.map((movie) => (
        <Link
          to={`/movies/${movie.id}`}
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
            <p className="text-sm text-gray-300 line-clamp-4">
              {movie.overview}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default MoviesPage;
