import { useParams } from "react-router-dom"

export default function MovieDetailPage() {
    const { id } = useParams<{ id: string }>()

    return (
        <div>
            MovieDetailPage
            <h1>{id}번 영화 상세 페이지</h1>
        </div>
    )
}