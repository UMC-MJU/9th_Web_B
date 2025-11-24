// src/hooks/mutations/useUpdateNickname.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patchUser } from "../../apis/users";
import { useAuthStore } from "../../store/useAuthStore";

export default function useUpdateNickname() {
  const queryClient = useQueryClient();
  const nickname = useAuthStore((s) => s.nickname);
  const setNickname = useAuthStore((s) => s.setNickname);

  return useMutation({
    mutationFn: (newName: string) => patchUser({ name: newName }),


    onMutate: async (newName) => {
      await queryClient.cancelQueries({ queryKey: ["me"] });

      const prev = nickname;
      setNickname(newName);

      return { prev };
    },

    // 실패 → 롤백
    onError: (_err, _new, context) => {
      if (context?.prev) setNickname(context.prev);
      alert("닉네임 변경 실패");
    },

    // 성공/실패 상관없이 서버 sync
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
}
