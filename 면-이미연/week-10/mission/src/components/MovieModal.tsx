import type { Movie } from "../types/movie";

interface MovieModalProps {
    movie: Movie;
    onClose: () => void;
}

export const MovieModal = ({ movie, onClose }: MovieModalProps) => {
    const imageBaseUrl = "https://image.tmdb.org/t/p/w500";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
            <div className="relative w-full max-w-4xl overflow-hidden rounded-xl bg-white shadow-2xl">
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 z-10 text-2xl text-white"
                >
                    ✕
                </button>

                <div className="h-64 w-full bg-black">
                    <img
                        src={
                        movie.backdrop_path
                            ? `${imageBaseUrl}${movie.backdrop_path}`
                            : `${imageBaseUrl}${movie.poster_path}`
                        }
                        alt={movie.title}
                        className="h-full w-full object-cover opacity-80"
                    />
                </div>

                <div className="flex gap-6 p-6">
                    <img
                        src={`${imageBaseUrl}${movie.poster_path}`}
                        alt={movie.title}
                        className="w-48 rounded-lg shadow-lg"
                    />

                    <div className="flex-1 space-y-3">
                        <h2 className="text-2xl font-bold">{movie.title}</h2>
                        <p className="text-gray-600">{movie.release_date}</p>

                        <div className="flex gap-4 text-sm">
                            <span>⭐ {movie.vote_average}</span>
                            <span>🌐 {movie.original_language.toUpperCase()}</span>
                        </div>

                        <p className="pt-2 text-gray-700 leading-relaxed">
                            {movie.overview}
                        </p>

                        <div className="pt-4 flex gap-3">
                            <a
                                href={`https://www.imdb.com/find?q=${movie.title}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="rounded bg-gray-400 px-4 py-2 font-bold text-gray-800 hover:bg-gray-400 transition"
                            >
                                IMDb에서 검색
                            </a>


                            <button
                                onClick={onClose}
                                className="rounded bg-gray-200 px-4 py-2"
                            >
                                닫기
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};