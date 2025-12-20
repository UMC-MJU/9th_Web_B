import { useCallback, useMemo, useState } from "react";
import MovieFilter from "../components/MovieFilter";
import { MovieList } from "../components/MovieList";
import useFetch from "../hooks/useFetch";
import type { Movie, MovieFilters, MovieResponse } from "../types/movie";
import { MovieModal } from "../components/MovieModal";

export default function HomePage() {
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
    const [filters, setFilters] = useState<MovieFilters>({
        query: "어벤져스",
        include_adult: false,
        language: "ko-KR",
    });

    const axiosRequestConfig = useMemo(
        () => ({ params: filters,}), [filters],);

    const { data, error, isLoading } = useFetch<MovieResponse>(
        "/search/movie",
        axiosRequestConfig
    );

    const handleMovieFilters = useCallback((filters: MovieFilters) => {
        setFilters(filters);
    }, [setFilters]);

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="container mx-auto max-w-6xl px-4 py-8">
            <MovieFilter onChange={handleMovieFilters} />
                {isLoading ? (
                    <div className="text-center py-8">로딩 중...</div>
            ) : (
                <MovieList
                    movies={data?.results || []}
                    onSelect={(movie) => setSelectedMovie(movie)}
                />
            )}

            {selectedMovie && (
                <MovieModal
                    movie={selectedMovie}
                    onClose={() => setSelectedMovie(null)}
                />
            )}
        </div>
    );
}