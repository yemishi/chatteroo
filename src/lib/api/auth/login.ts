import type { User } from "@/types";
import { axiosInstance } from "../axiosInstance";

export const login = async (email: string, password: string) => {
  try {
    const response = await axiosInstance.post("/auth/signin", { email, password });
    return response.data as { user: User; message: string };
  } catch (error: any) {
    throw new Error(error.response.data.message);
  }
};

export const guestLogin = async (guestId: string) => {
  try {
    const response = await axiosInstance.post("/auth/signin-guest", { guestId });
    return response.data as { user: User; message: string };
  } catch (error: any) {
    throw new Error(error.response.data.message);
  }
};
