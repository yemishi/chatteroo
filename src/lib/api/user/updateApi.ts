import type { User } from "@/types";
import { axiosInstance } from "../axiosInstance";

export const updateFromGuestApi = async (data: { email: string; password: string }) => {
  try {
    const response = await axiosInstance.patch("/user", data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response.data.message);
  }
};

export type UpdateUserProps = {
  username?: string;
  email?: string;
  bio?: string;
  tag?: string;
  picture?: string;
  password?: string;
};

export const updateUserApi = async (data: UpdateUserProps) => {
  try {
    const response = await axiosInstance.patch("/user", data);
    return response.data as {
      message: string;
      user: User;
    };
  } catch (error: any) {
    throw new Error(error.response.data.message);
  }
};

export const deleteUserApi = async (password: string) => {
  try {
    const response = await axiosInstance.delete("/user", { data: { password } });
    return response.data as {
      message: string;
    };
  } catch (error: any) {
    throw new Error(error.response.data.message);
  }
};
