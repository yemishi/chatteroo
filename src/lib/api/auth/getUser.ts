import { axiosInstance } from "../axiosInstance";

export const getUser = async () => {
  const res = await axiosInstance.get("/auth", { withCredentials: true });
  return res.data.user;
};
