import type { User } from "@/types";
import { axiosInstance } from "../axiosInstance";

export const loginApi = async (email: string, password: string) => {
  try {
    const response = await axiosInstance.post("/auth/signin", { email, password });
    return response.data as { user: User; message: string };
  } catch (error: any) {
    throw new Error(error.response.data.message);
  }
};

export const guestLoginApi = async (guestId: string) => {
  try {
    const response = await axiosInstance.post("/auth/signin-guest", { guestId });
    return response.data as { user: User; message: string };
  } catch (error: any) {
    throw new Error(error.response.data.message);
  }
};
