// src/pages/MyPage.tsx
import { useState } from "react";
import useGetMe from "../hooks/queries/useGetMe";
import useUpdateMe from "../hooks/queries/useUpdateMe";
import useUpdateNickname from "../hooks/mutations/useUpdateNickname";

export default function MyPage() {
  const { data: me, isLoading } = useGetMe();
  const updateMe = useUpdateMe();
  const updateNickname = useUpdateNickname();

  const [isEdit, setIsEdit] = useState(false);

  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState("");

  if (isLoading || !me) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        불러오는 중...
      </div>
    );
  }

  const handleEdit = () => {
    setIsEdit(true);
    setName(me.name ?? "");
    setBio(me.bio ?? "");
    setAvatar(me.avatar ?? "");
  };

  const handleSave = () => {
    
    if (name !== me.name) {
      updateNickname.mutate(name);
    }

    // bio, avatar는 평소 업데이트
    updateMe.mutate({ bio, avatar });

    setIsEdit(false);
  };

  return (
    <div className="min-h-screen text-gray-100 px-6 py-12 bg-[#0B0B0B]">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">마이 페이지</h1>

        <div className="bg-black border border-gray-700 rounded-xl p-10 flex gap-10 items-center">
          <img
            src={
              avatar ||
              me.avatar ||
              "https://cdn-icons-png.flaticon.com/512/847/847969.png"
            }
            alt="profile"
            className="w-40 h-40 rounded-full bg-gray-800 object-cover"
          />

          <div className="flex-1 space-y-4">
            {isEdit ? (
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-gray-900 border border-gray-600 rounded-md px-4 py-3 text-lg"
              />
            ) : (
              <div className="text-2xl font-semibold">{me.name}</div>
            )}

            {isEdit ? (
              <input
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full bg-gray-900 border border-gray-600 rounded-md px-4 py-3 text-lg"
                placeholder="한 줄 소개를 입력하세요."
              />
            ) : (
              <div className="text-gray-400">
                {me.bio || "소개글 없음"}
              </div>
            )}

            <div className="text-sm text-gray-500">{me.email}</div>

            <div className="pt-4">
              {isEdit ? (
                <button
                  onClick={handleSave}
                  className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-md font-semibold"
                >
                  저장
                </button>
              ) : (
                <button
                  onClick={handleEdit}
                  className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-md font-semibold"
                >
                  설정
                </button>
              )}
            </div>
          </div>
        </div>

        <p className="text-xs text-gray-400 mt-3">
          Bio, 프로필 사진은 값이 없어도 저장 가능합니다.
        </p>
      </div>
    </div>
  );
}
