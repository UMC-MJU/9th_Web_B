import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { LoadingSpinner } from "../components/LoadingSpinner";
import type { MovieDetails, Cast, Crew } from "../types/movie";

const MovieDetailPage = () => {
    const { movieId } = useParams<{ movieId: string }>();
    const [movie, setMovie] = useState<MovieDetails | null>(null);
    const [cast, setCast] = useState<Cast[]>([]);
    const [crew, setCrew] = useState<Crew[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);

        const fetchData = async () => {
            try {
                setLoading(true);
                setError(false);

                const movieRes = await axios.get<MovieDetails>(
                    `https://api.themoviedb.org/3/movie/${movieId}?language=ko-KR`,
                    {
                        headers: {
                            Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
                        },
                    }
                );

                const creditsRes = await axios.get<{ cast: Cast[]; crew: Crew[] }>(
                    `https://api.themoviedb.org/3/movie/${movieId}/credits?language=ko-KR`,
                    {
                        headers: {
                            Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
                        },
                    }
                );

                setMovie(movieRes.data);
                setCast(creditsRes.data.cast.sort((a, b) => b.popularity - a.popularity));
                setCrew(creditsRes.data.crew);
            } catch {
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        if (movieId) fetchData();
    }, [movieId]);

    if (loading) return (
        <div className="flex justify-center items-center h-screen bg-gray-900">
            <LoadingSpinner />
        </div>
    );
    if (error || !movie) return (
        <div className="flex justify-center items-center h-screen bg-gray-900 text-white text-2xl">
            영화 정보를 불러올 수 없습니다.
        </div>
    );

    const director = crew.find((c) => c.job === "Director");
    const backdropUrl = `https://image.tmdb.org/t/p/original${movie.backdrop_path}`;
    const posterUrl = movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : 'https://placehold.co/500x750/1f2937/e5e7eb?text=No+Image';

    return (
        <div className="bg-gray-900 text-white min-h-screen">
            <div
                className="relative h-96 md:h-[500px] bg-cover bg-center"
                style={{ backgroundImage: `url(${backdropUrl})` }}
            >
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent"></div>
            </div>

            <div className="container mx-auto p-4 md:p-8 -mt-48 relative">
                <div className="md:flex gap-8">
                    <div className="w-full md:w-1/3 flex-shrink-0">
                        <img
                            src={posterUrl}
                            alt={movie.title}
                            className="rounded-xl shadow-2xl w-2/3 md:w-full mx-auto"
                        />
                    </div>

                    <div className="md:w-2/3 mt-6 md:mt-0 text-center md:text-left">
                        <h1 className="text-4xl md:text-5xl font-bold">{movie.title}</h1>
                        <div className="flex flex-wrap justify-center md:justify-start gap-x-4 gap-y-2 mt-4 text-gray-300">
                            <span>{movie.release_date.split('-')[0]}</span>
                            <span>•</span>
                            <span>{movie.genres.map(g => g.name).join(', ')}</span>
                            {movie.runtime > 0 && <><span>•</span><span>{movie.runtime}분</span></>}
                        </div>

                        <div className="flex items-center justify-center md:justify-start gap-4 mt-4">
                            <div className="flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                                <span className="text-2xl font-bold">{movie.vote_average.toFixed(1)}</span>
                            </div>
                        </div>

                        <p className="mt-6 text-gray-300 leading-relaxed">{movie.overview}</p>

                        {director && (
                            <div className="mt-6">
                                <p className="text-lg font-semibold">감독</p>
                                <p className="text-gray-300">{director.name}</p>
                            </div>
                        )}
                    </div>
                </div>
                
                <div className="mt-12">
                    <h2 className="text-3xl font-bold mb-6 border-l-4 border-yellow-400 pl-4">주요 출연진</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                        {cast.slice(0, 12).map((actor) => (
                            <div key={actor.id} className="text-center group">
                                <div className="rounded-full overflow-hidden w-28 h-28 mx-auto shadow-lg border-2 border-transparent group-hover:border-yellow-400 transition-all duration-300">
                                    <img
                                        src={actor.profile_path ? `https://image.tmdb.org/t/p/w200${actor.profile_path}` : 'https://placehold.co/200x200/1f2937/e5e7eb?text=N/A'}
                                        alt={actor.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <p className="font-medium mt-3">{actor.name}</p>
                                <p className="text-sm text-gray-400">({actor.character})</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MovieDetailPage;