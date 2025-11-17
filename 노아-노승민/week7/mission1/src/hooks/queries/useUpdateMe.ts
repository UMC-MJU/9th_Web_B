
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patchUser } from "../../apis/users";

export default function useUpdateMe() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: patchUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] }); 
      alert("정보가 수정되었습니다!");
    },
    onError: () => {
      alert("수정 실패!");
    },
  });
}
