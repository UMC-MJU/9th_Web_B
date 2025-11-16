import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import useGetLpDetail from "../hooks/queries/useGetLpDetail";
import { useGetMyInfo } from "../hooks/queries/useGetMyInfo";
import { useDeleteLpMutation } from "../hooks/queries/useDeleteLpMutation";
import { useToggleLikeMutation } from "../hooks/queries/useToggleLikeMutation";
import LoadingSpinner from "../components/common/LoadingFallback";
import ErrorFallback from "../components/common/ErrorFallback";
import { Edit, Trash2, Heart } from "lucide-react";

const LpDetailPage = () => {
    const { lpId } = useParams<{ lpId: string }>();
    const id = Number(lpId);
    const navigate = useNavigate();

    const { data: myInfo } = useGetMyInfo();
    const currentUserId = myInfo?.data?.id;

    const { data: lp, isPending, isError, error } = useGetLpDetail(id);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const { mutate: deleteMutate, isPending: isDeleting } = useDeleteLpMutation();

    if (!lpId || Number.isNaN(id)) {
        return <ErrorFallback message="잘못된 LP ID 입니다." />;
    }

    if (isPending) return <LoadingSpinner />;
    if (isError) return <ErrorFallback message={(error as any)?.message} />;
    if (!lp) return <ErrorFallback message="LP 정보를 찾을 수 없습니다." />;

    // 유저 권한 체크
    const isLikedByMe = currentUserId
        ? lp.likes.some((like) => like.id === currentUserId)
        : false;

    const isOwner = currentUserId ? lp.authorId === currentUserId : false;

    // 좋아요 API
    const { mutate: toggleLikeMutate } = useToggleLikeMutation(id, isLikedByMe);

    const handleEditClick = () => navigate(`/lp/${id}/edit`);

    const handleDeleteClick = () => setIsModalOpen(true);

    const handleConfirmDelete = () => {
        if (!isDeleting) deleteMutate(id);
    };

    const handleLikeClick = () => {
        if (!currentUserId) {
            alert("로그인이 필요합니다.");
            navigate("/login");
            return;
        }
        toggleLikeMutate();
    };

    return (
        <>
            <div className="max-w-4xl mx-auto py-8 px-4">
                <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden p-6 md:p-8">
                    <div className="flex justify-end items-start mb-6">
                        <div className="flex items-center gap-4 text-gray-400 text-sm">
                            <span>
                                {new Date(lp.createdAt).toLocaleDateString("ko-KR")}
                            </span>

                            {isOwner && (
                                <>
                                    <button
                                        onClick={handleEditClick}
                                        className="text-gray-400 hover:text-white"
                                    >
                                        <Edit size={18} />
                                    </button>
                                    <button
                                        onClick={handleDeleteClick}
                                        className="text-gray-400 hover:text-white"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    {/* 좋아요 */}
                    <div className="flex flex-col items-center gap-2 mb-4">
                        <button
                            onClick={handleLikeClick}
                            className={`p-3 bg-gray-700 rounded-full hover:bg-gray-600 transition-colors ${isLikedByMe ? "text-pink-500" : "text-gray-400"
                                }`}
                        >
                            <Heart
                                size={24}
                                fill={isLikedByMe ? "currentColor" : "none"}
                            />
                        </button>
                        <p className="font-medium text-lg text-white">
                            {lp.likes?.length || 0}
                        </p>
                    </div>
                </div>
            </div>

            {/* 삭제 모달 */}
            {isModalOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70"
                    onClick={() => setIsModalOpen(false)}
                >
                    <div
                        className="bg-gray-800 rounded-lg p-8 shadow-xl w-80"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <p className="text-white text-center text-lg mb-6">
                            게시글을 삭제하시겠습니까?
                        </p>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={handleConfirmDelete}
                                disabled={isDeleting}
                                className="px-6 py-2 rounded font-bold text-black bg-gray-200 hover:bg-white disabled:opacity-70"
                            >
                                {isDeleting ? "삭제 중..." : "예"}
                            </button>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-6 py-2 rounded font-bold text-white bg-pink-500 hover:bg-pink-600"
                            >
                                아니오
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default LpDetailPage;
