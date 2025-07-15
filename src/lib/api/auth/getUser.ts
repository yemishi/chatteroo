import { axiosInstance } from "../axiosInstance";

export const getUser = async () => {
  try {
    const res = await axiosInstance.get("/auth", { withCredentials: true });
    return res.data.user;
  } catch (error: any) {
    throw new Error(error.response.data.message);
  }
};
