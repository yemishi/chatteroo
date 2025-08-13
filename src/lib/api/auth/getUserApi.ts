import { axiosInstance } from "../axiosInstance";

export const getUserApi = async () => {
  try {
    const res = await axiosInstance.get("/auth", { withCredentials: true });
    return res.data.user;
  } catch (error: any) {
    throw new Error(error.response.data.message);
  }
};
