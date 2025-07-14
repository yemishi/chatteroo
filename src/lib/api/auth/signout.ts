import { axiosInstance } from "../axiosInstance";

export const signout = async () => {
  try {
    const response = await axiosInstance.post("/auth/signout");
    return response.data;
  } catch (error: any) {
    throw new Error(error.response.data.message);
  }
};
