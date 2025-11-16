import { useEffect, useState } from "react";
import { updateMyInfo } from "../apis/auth";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import type { ResponseMyInfoDto } from "../types/auth";
import { Plus, X, Disc3, ImagePlus } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEY } from "../constants/keys";
import { postLp } from "../apis/lp";
import { useGetMyInfo } from "../hooks/queries/useGetMyInfo";
import useGetMyLpList from "../hooks/queries/useGetMyLpList";
import useGetMyLikedLpList from "../hooks/queries/useGetMyLikedLpList";
import type { PaginationDto } from "../types/common";
import type { Lp } from "../types/lp";

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  name: string;
  bio: string;
  email: string;
  avatarUrl: string;
}

interface LpCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProfileEditModal = ({
  isOpen,
  onClose,
  name: initialName,
  bio: initialBio,
  email,
  avatarUrl,
}: ProfileEditModalProps) => {
  const [name, setName] = useState(initialName);
  const [bio, setBio] = useState(initialBio);
  const [previewUrl, setPreviewUrl] = useState<string | null>(avatarUrl || null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const queryClient = useQueryClient();

  useEffect(() => {
    if (isOpen) {
      setName(initialName);
      setBio(initialBio);
      setPreviewUrl(avatarUrl || null);
      setImageFile(null);
    }
  }, [isOpen, initialName, initialBio, avatarUrl]);

  const profileMutation = useMutation({
    mutationFn: (formData: FormData) => updateMyInfo(formData),

    onMutate: async (formData: FormData) => {
      await queryClient.cancelQueries({ queryKey: [QUERY_KEY.myInfo] });

      const previousMyInfo = queryClient.getQueryData<ResponseMyInfoDto>([
        QUERY_KEY.myInfo,
      ]);

      const newName = formData.get("name") as string;
      const newBio = formData.get("bio") as string;

      if (previousMyInfo) {
        const updated = {
          ...previousMyInfo,
          data: {
            ...(previousMyInfo.data as any),
            name: newName,
            bio: newBio,
          },
        } as ResponseMyInfoDto;

        queryClient.setQueryData<ResponseMyInfoDto>(
          [QUERY_KEY.myInfo],
          updated
        );
      }

      return { previousMyInfo };
    },

    onError: (_error, _variables, context) => {
      alert("프로필 수정에 실패했습니다.");
      if (context?.previousMyInfo) {
        queryClient.setQueryData([QUERY_KEY.myInfo], context.previousMyInfo);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.myInfo] });
      onClose();
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("bio", bio);
    if (imageFile) {
      formData.append("avatar", imageFile);
    }
    profileMutation.mutate(formData);
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-black rounded-lg shadow-xl w-full max-w-lg p-6 relative text-white"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X size={24} />
        </button>

        <form onSubmit={handleSubmit}>
          <div className="flex items-center gap-6 mt-10">
            <label
              htmlFor="profile-image"
              className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden cursor-pointer"
            >
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="profile preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center w-full h-full bg-gray-600">
                  <div className="w-10 h-10 rounded-full bg-gray-300" />
                  <div className="w-14 h-8 mt-1 rounded-full bg-gray-300" />
                </div>
              )}
            </label>

            <input
              id="profile-image"
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleImageChange}
            />

            <div className="flex-1 space-y-3">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-black border border-gray-500 rounded-md"
                placeholder="이름"
              />
              <input
                type="text"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-3 py-2 bg-black border border-gray-500 rounded-md"
                placeholder="Bio"
              />
            </div>
          </div>

          <p className="mt-4 text-center text-sm text-gray-300">{email}</p>

          <div className="mt-6 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md bg-gray-700 hover:bg-gray-600"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={profileMutation.isPending}
              className="px-4 py-2 rounded-md bg-pink-600 hover:bg-pink-700 disabled:opacity-60"
            >
              {profileMutation.isPending ? "저장 중..." : "저장"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


const LpCreateModal = ({ isOpen, onClose }: LpCreateModalProps) => {
  const queryClient = useQueryClient();

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  const lpMutation = useMutation({
    mutationFn: (formData: FormData) => postLp(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.lps] });
      setPreviewUrl(null);
      setImageFile(null);
      setTitle("");
      setContent("");
      setTagInput("");
      setTags([]);
      onClose();
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleAddTag = () => {
    const value = tagInput.trim();
    if (!value) return;
    if (tags.includes(value)) {
      setTagInput("");
      return;
    }
    setTags([...tags, value]);
    setTagInput("");
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    if (imageFile) {
      formData.append("thumbnail", imageFile);
    }
    tags.forEach((tag) => formData.append("tags", tag));
    lpMutation.mutate(formData);
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6 relative text-white"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X size={24} />
        </button>

        <div className="flex justify-center mb-6">
          <div className="w-48 h-48 rounded-md bg-gray-700 flex items-center justify-center overflow-hidden">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="LP preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <Disc3 size={100} className="text-gray-500" />
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="mb-4">
              <label
                htmlFor="lp-image"
                className="flex justify-center items-center gap-2 w-full p-3 bg-gray-700 rounded-md cursor-pointer hover:bg-gray-600 transition-colors"
              >
                <ImagePlus size={20} />
                <span>LP 앨범 커버 선택</span>
              </label>
              <input
                id="lp-image"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>

            <input
              type="text"
              placeholder="LP Name"
              className="w-full p-3 bg-gray-700 rounded-md border border-gray-600 focus:outline-none focus:border-pink-500"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <textarea
              placeholder="LP Content"
              rows={3}
              className="w-full p-3 bg-gray-700 rounded-md border border-gray-600 focus:outline-none focus:border-pink-500"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="LP Tag"
                className="flex-1 p-3 bg-gray-700 rounded-md border border-gray-600 focus:outline-none focus:border-pink-500"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
              />
              <button
                type="button"
                className="px-4 py-2 bg-gray-600 rounded-md hover:bg-gray-500"
                onClick={handleAddTag}
              >
                Add
              </button>
            </div>

            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="flex items-center gap-1 px-3 py-1 rounded-full bg-gray-700 text-sm"
                  >
                    <span>{tag}</span>
                    <X size={12} />
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full mt-6 py-3 bg-pink-600 rounded-md font-semibold hover:bg-pink-700 transition-colors disabled:opacity-60"
            disabled={lpMutation.isPending}
          >
            {lpMutation.isPending ? "추가 중..." : "Add LP"}
          </button>
        </form>
      </div>
    </div>
  );
};


const MyPage = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const { data, isLoading } = useGetMyInfo();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // 탭/정렬 상태
  const [tab, setTab] = useState<"liked" | "created">("liked");
  const [order, setOrder] = useState<"asc" | "desc">("desc");

  const basePagination: PaginationDto = {
    cursor: 0,
    limit: 20,
    search: "",
    order,
  };

  // 내가 작성한 LP / 좋아요한 LP 조회
  const {
    data: myLps = [],
    isLoading: isMyLpsLoading,
  } = useGetMyLpList(basePagination);

  const {
    data: likedLps = [],
    isLoading: isLikedLpsLoading,
  } = useGetMyLikedLpList(basePagination);

  const currentLpList: Lp[] = tab === "liked" ? likedLps : myLps;
  const isLpLoading = isMyLpsLoading || isLikedLpsLoading;

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const avatarPath = data?.data?.avatar ?? null;
  const avatarUrl =
    typeof avatarPath === "string" && avatarPath.length > 0
      ? avatarPath.startsWith("http")
        ? avatarPath
        : `${import.meta.env.VITE_SERVER_API_URL}${avatarPath}`
      : "";

  if (isLoading) {
    return (
      <section className="max-w-4xl mx-auto px-6 py-10">
        <div className="h-7 w-48 rounded bg-gray-700/50 animate-pulse mb-6" />
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-gray-700/50 animate-pulse" />
          <div className="space-y-3">
            <div className="h-4 w-56 rounded bg-gray-700/50 animate-pulse" />
            <div className="h-9 w-28 rounded bg-gray-700/50 animate-pulse" />
          </div>
        </div>
      </section>
    );
  }

  const name = data?.data?.name ?? "";
  const bio = (data?.data as any)?.bio ?? "";
  const email = data?.data?.email ?? "";

  return (
    <>
      {/* 상단 프로필 영역 */}
      <section className="max-w-4xl mx-auto px-6 py-16 text-center">
        <div className="flex flex-col items-center gap-4">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt="프로필 이미지"
              className="w-32 h-32 rounded-full object-cover border border-gray-700"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src =
                  "data:image/svg+xml;utf8,\
<svg xmlns='http://www.w3.org/2000/svg' width='128' height='128'>\
<circle cx='64' cy='64' r='64' fill='%236b7280'/></svg>";
              }}
            />
          ) : (
            <div className="w-32 h-32 rounded-full bg-gray-700" />
          )}

          <h1 className="text-3xl font-extrabold">{name}</h1>
          {bio && <p className="text-gray-300">{bio}</p>}
          <p className="text-gray-400">{email}</p>

          <div className="mt-3 flex gap-2">
            <button
              onClick={() => setIsProfileModalOpen(true)}
              className="bg-gray-700 px-4 py-2 rounded-md text-white hover:brightness-110 cursor-pointer"
            >
              설정
            </button>
            <button
              onClick={handleLogout}
              className="bg-[#f72585] px-4 py-2 rounded-md text-white hover:brightness-90 cursor-pointer"
            >
              로그아웃
            </button>
          </div>
        </div>
      </section>

      {/* 탭 + 정렬 + LP 리스트 영역 */}
      <section className="max-w-5xl mx-auto px-6 pb-16">
        {/* 탭 메뉴 */}
        <div className="flex justify-center space-x-10 text-lg">
          <button
            className={tab === "liked" ? "text-white" : "text-gray-500"}
            onClick={() => setTab("liked")}
          >
            내가 좋아요 한 LP
          </button>
          <button
            className={tab === "created" ? "text-white" : "text-gray-500"}
            onClick={() => setTab("created")}
          >
            내가 작성한 LP
          </button>
        </div>

        {/* 정렬 버튼 */}
        <div className="flex justify-end mt-6">
          <div className="flex rounded-lg overflow-hidden border border-gray-600">
            <button
              className={`px-4 py-2 ${order === "asc" ? "bg-white text-black" : "text-white"
                }`}
              onClick={() => setOrder("asc")}
            >
              오래된순
            </button>
            <button
              className={`px-4 py-2 ${order === "desc" ? "bg-white text-black" : "text-white"
                }`}
              onClick={() => setOrder("desc")}
            >
              최신순
            </button>
          </div>
        </div>

        {/* LP 카드 리스트 */}
        <div className="mt-10">
          {isLpLoading ? (
            <p className="text-center text-gray-500">LP를 불러오는 중...</p>
          ) : currentLpList.length === 0 ? (
            <p className="text-center text-gray-500">
              아직 LP가 없습니다.
            </p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {currentLpList.map((lp) => (
                <button
                  key={lp.id}
                  onClick={() => navigate(`/lps/${lp.id}`)}
                  className="rounded-md overflow-hidden bg-gray-800 hover:bg-gray-700 transition"
                >
                  <img
                    src={lp.thumbnail}
                    alt={lp.title}
                    className="w-full aspect-square object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 플로팅 + 버튼 */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-pink-600 rounded-full flex items-center justify-center text-white shadow-lg transition-transform hover:scale-105 z-40"
      >
        <Plus size={32} />
      </button>

      <LpCreateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      <ProfileEditModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        name={name}
        bio={bio}
        email={email}
        avatarUrl={avatarUrl}
      />
    </>
  );
};

export default MyPage;