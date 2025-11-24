import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../../apis/axios";

const fetchMe = async () => {
  const { data } = await axiosInstance.get("/users/me");
  return data.data;
};

export default function useGetMe() {
  return useQuery({
    queryKey: ["me"],
    queryFn: fetchMe,
  });
}
