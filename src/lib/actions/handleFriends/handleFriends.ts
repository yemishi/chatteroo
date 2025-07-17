import useScrollQuery from "@/hooks/useScrollQuery";
import { useMutation } from "@tanstack/react-query";
import { removeFriend as removeFriendFn } from "@/lib/api";

export const getFriends = (userId: string) => {
  return useScrollQuery({ url: `/friends/${userId}`, queryKey: ["friends", userId] });
};

export const removeFriend = () => {
  return useMutation({
    mutationFn: (userId: string) => removeFriendFn(userId),
    mutationKey: ["unfriend"],
  });
};
