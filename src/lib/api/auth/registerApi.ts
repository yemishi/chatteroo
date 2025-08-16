import type { User } from "@/types";
import { axiosInstance } from "../axiosInstance";

export type AuthGuestUser = {
  id:string;
  username: string;
  picture: string;
  guestCode: string;
  tag: string;
};

export const guestRegisterApi = async (values: AuthGuestUser) => {
  try {
    const response = await axiosInstance.post("/user/guest", values);
    return response.data as { user: User; message: string };
  } catch (error: any) {
    throw new Error(error.response.data.message);
  }
};

export const generateGuestApi = async () => {
  try {
    const response = await axiosInstance.get("/user/guest");
    return response.data as { user: AuthGuestUser; message: string };
  } catch (error: any) {
    throw new Error(error.response.data.message);
  }
};

export const registerApi = async (values: {
  username: string;
  email: string;
  tag: string;
  password: string;
  bio?: string;
  picture?: string;
}) => {
  try {
    const response = await axiosInstance.post("/user", { ...values });
    return response.data as { user: User; message: string };
  } catch (error: any) {
    throw new Error(error.response.data.message);
  }
};
