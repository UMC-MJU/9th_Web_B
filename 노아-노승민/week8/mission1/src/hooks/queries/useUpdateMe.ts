import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patchUser } from "../../apis/users";

export default function useUpdateMe() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: patchUser,

    onSuccess: () => {

      queryClient.invalidateQueries({ queryKey: ["me"] });
    },

    onError: () => {
      console.error("유저 정보 수정 실패");
    },
  });
}
