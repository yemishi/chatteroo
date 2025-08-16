import type { User } from "@/types";
import { axiosInstance } from "../axiosInstance";

export const loginApi = async (name: string, password: string) => {
  try {
    const response = await axiosInstance.post("/auth/signin", { name, password });
    return response.data as { user: User; message: string };
  } catch (error: any) {
    throw new Error(error.response.data.message);
  }
};

export const guestLoginApi = async (guestCode: string) => {
  try {
    const response = await axiosInstance.post("/auth/signin-guest", { guestCode });
    return response.data as { user: User; message: string };
  } catch (error: any) {
    throw new Error(error.response.data.message);
  }
};
