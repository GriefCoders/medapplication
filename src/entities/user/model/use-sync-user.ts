import { useGetUser } from "@/entities/user/api";
import { useUserStore } from "@/entities/user/model/store";
import { useEffect } from "react";

export const useSyncUser = () => {
  const { data: user, isSuccess } = useGetUser();
  const { setUser } = useUserStore();

  useEffect(() => {
    if (isSuccess && user) {
      setUser(user);
    }
  }, [user, isSuccess, setUser]);

  return { user };
};
