import { useParams, Link } from "react-router-dom";
import useCustomFetch from "../hooks/useCustomFetch";

interface MovieDetail {
  id: number;
  title: string;
  overview: string;
  release_date: string;
  runtime: number;
  vote_average: number;
  backdrop_path: string;
  tagline: string;
}

interface CreditResponse {
  cast: {
    id: number;
    name: string;
    character: string;
    profile_path: string | null;
  }[];
}

export default function MovieDetailPage() {
  const { id } = useParams<{ id: string }>();

  const { data: movie, loading, error } = useCustomFetch<MovieDetail>(
    `https://api.themoviedb.org/3/movie/${id}?language=ko-KR`,
    [id]
  );

  const { data: credits } = useCustomFetch<CreditResponse>(
    `https://api.themoviedb.org/3/movie/${id}/credits?language=ko-KR`,
    [id]
  );

  if (loading) return <div className="text-center mt-10 text-white">불러오는 중...</div>;
  if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;
  if (!movie) return null;

  return (
    <div className="min-h-screen bg-black text-white">
      {/* 상단 배경 이미지 영역 */}
      <div
        className="relative h-[500px] w-full bg-cover bg-center"
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
        <div className="absolute bottom-10 left-10">
          <h1 className="text-5xl font-extrabold mb-3 drop-shadow-md">
            {movie.title}
          </h1>
          {movie.tagline && (
            <p className="italic text-gray-300 mb-2">{movie.tagline}</p>
          )}
          <p className="text-sm text-gray-400">
            {movie.release_date?.split("-")[0]} · {movie.runtime}분 ·{" "}
            <span className="text-yellow-400 font-semibold">
              평점 {movie.vote_average.toFixed(1)}
            </span>
          </p>
        </div>
      </div>

      {/* 내용 본문 */}
      <div className="max-w-6xl mx-auto px-6 py-10 space-y-12">
        {/* 줄거리 */}
        <section>
          <h2 className="text-2xl font-bold mb-4 border-l-4 border-yellow-400 pl-3">
            줄거리
          </h2>
          {movie.overview ? (
            <p className="text-gray-300 leading-relaxed">{movie.overview}</p>
          ) : (
            <p className="text-gray-500 italic">줄거리 정보가 없습니다.</p>
          )}
        </section>

        {/* 감독/출연 */}
        <section>
          <h2 className="text-2xl font-bold mb-6 border-l-4 border-yellow-400 pl-3">
            감독 / 출연
          </h2>
          <div className="flex overflow-x-auto gap-6 pb-4 scrollbar-thin scrollbar-thumb-gray-600">
            {credits?.cast.slice(0, 15).map((actor) => (
              <div
                key={actor.id}
                className="flex flex-col items-center min-w-[100px] hover:scale-105 transition-transform"
              >
                <img
                  src={
                    actor.profile_path
                      ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
                      : "https://via.placeholder.com/100x150?text=No+Image"
                  }
                  alt={actor.name}
                  className="w-24 h-24 object-cover rounded-full mb-2 shadow-md border border-gray-700"
                />
                <p className="text-sm font-semibold text-center">
                  {actor.name}
                </p>
                <p className="text-xs text-gray-400 text-center">
                  {actor.character}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 돌아가기 버튼 */}
        <div className="text-center mt-10">
          <Link
            to="/"
            className="inline-block bg-white text-black font-semibold py-2 px-6 rounded-lg hover:bg-gray-200 transition"
          >
            목록으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}
