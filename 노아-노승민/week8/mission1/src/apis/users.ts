
import { axiosInstance } from "./axios";

export const patchUser = async (data: { name?: string; bio?: string; avatar?: string | null }) => {
  const res = await axiosInstance.patch("/users", data);
  return res.data.data;
};
