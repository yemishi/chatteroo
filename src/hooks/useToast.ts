import type { AppDispatch, RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import { addToast, removeToast, type Toast } from "@/store/toastSlice";
import { useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

export default function useNotification() {
  const dispatch = useDispatch<AppDispatch>();
  const list = useSelector((state: RootState) => state.toast.list);

  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];

    list.forEach((n) => {
      if (n.duration) {
        const timer = setTimeout(() => {
          dispatch(removeToast(n.id));
        }, n.duration);
        timers.push(timer);
      }
    });

    return () => timers.forEach((t) => clearTimeout(t));
  }, [list, dispatch]);

  const sendToast = (notification: Omit<Toast, "id">) => {
    const id = uuidv4();
    dispatch(addToast({ ...notification, id, duration: notification.duration ?? 4000 }));
  };

  return {
    list,
    sendToast,
    removeToast: (id: string) => dispatch(removeToast(id)),
  };
}
