import { useState } from "react";
import type { ChangeEvent, FormEvent, MouseEvent } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createLp } from "../apis/lp";

type LpWriteModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

// ⚡ 파일을 base64 문자열로 변환
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export default function LpWriteModal({ isOpen, onClose }: LpWriteModalProps) {
  const queryClient = useQueryClient();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [thumbnail, setThumbnail] = useState<string>(""); // base64 저장
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  // POST LP
  const { mutate, isPending } = useMutation({
    mutationFn: async () =>
      createLp({
        title,
        content,
        thumbnail,  // base64 or URL
        tags,
        published: true,
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["lps"],
      });
      alert("LP 등록 완료!");
      onClose();
      resetForm();
    },
    onError: () => {
      alert("LP 등록 실패");
    },
  });

  const resetForm = () => {
    setTitle("");
    setContent("");
    setFile(null);
    setThumbnail("");
    setTagInput("");
    setTags([]);
  };

  if (!isOpen) return null;

  const handleOverlayClick = () => {
    onClose();
  };

  const handleInnerClick = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  // 파일 선택 → base64 변환 후 저장
  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] ?? null;
    setFile(selected);

    if (selected) {
      const base64 = await fileToBase64(selected);
      setThumbnail(base64);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      alert("제목과 내용을 입력해주세요.");
      return;
    }

    mutate();
  };

  const handleAddTag = () => {
    const v = tagInput.trim();
    if (!v) return;
    if (tags.includes(v)) {
      setTagInput("");
      return;
    }
    setTags((prev) => [...prev, v]);
    setTagInput("");
  };

  const handleRemoveTag = (tag: string) => {
    setTags((prev) => prev.filter((t) => t !== tag));
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center"
      onClick={handleOverlayClick}
    >
      <div
        className="bg-[#181818] w-full max-w-xl rounded-2xl p-6 shadow-lg"
        onClick={handleInnerClick}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">새 LP 작성</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200 text-xl"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* LP 이미지 */}
          <div className="space-y-2">
            <label className="text-sm text-gray-300">LP 사진</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full text-sm text-gray-200
                file:mr-4 file:py-2 file:px-4 
                file:rounded-md file:border-0 
                file:bg-purple-600 file:text-white 
                file:cursor-pointer bg-[#111] 
                rounded-md"
            />
          </div>

          {/* 제목 */}
          <div className="space-y-2">
            <label className="text-sm text-gray-300">제목</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#111] rounded-md px-3 py-2 text-gray-100 outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="LP 제목을 입력하세요"
            />
          </div>

          {/* 내용 */}
          <div className="space-y-2">
            <label className="text-sm text-gray-300">내용</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full bg-[#111] rounded-md px-3 py-2 text-gray-100 outline-none focus:ring-2 focus:ring-purple-500 min-h-[140px]"
              placeholder="LP 내용을 입력하세요"
            />
          </div>

          {/* 태그 */}
          <div className="space-y-2">
            <label className="text-sm text-gray-300">태그</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                className="flex-1 bg-[#111] rounded-md px-3 py-2 text-gray-100 outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="태그 입력 후 추가"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-md text-sm font-medium"
              >
                추가
              </button>
            </div>

            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-purple-700/40 text-sm"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="text-xs text-gray-300 hover:text-white"
                  >
                    ×
                  </button>
                </span>
              ))}

              {tags.length === 0 && (
                <span className="text-xs text-gray-500">추가된 태그 없음</span>
              )}
            </div>
          </div>

          {/* 버튼 */}
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md border border-gray-600 text-sm text-gray-200 hover:bg-gray-800"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-4 py-2 rounded-md bg-purple-600 hover:bg-purple-700 text-sm font-semibold disabled:opacity-50"
            >
              {isPending ? "등록 중..." : "Add LP"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
