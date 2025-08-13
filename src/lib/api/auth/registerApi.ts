import type { User } from "@/types";
import { axiosInstance } from "../axiosInstance";

export const guestRegisterApi = async () => {
  try {
    const response = await axiosInstance.post("/user/guest");
    return response.data as { user: User; message: string };
  } catch (error: any) {
    throw new Error(error.response.data.message);
  }
};

export const registerApi = async (username: string, email: string, bio?: string, picture?: string) => {
  try {
    const response = await axiosInstance.post("/user", { username, email, bio, picture });
    return response.data as { user: User; message: string };
  } catch (error: any) {
    throw new Error(error.response.data.message);
  }
};
