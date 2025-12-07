import { useGetCurrentUser } from "@/entities/user/api";
import { useUserStore } from "@/entities/user/model/store";
import { useEffect } from "react";

export const useSyncUser = () => {
  const { data: user, isSuccess } = useGetCurrentUser();
  const { setUser, setIsLoading } = useUserStore();

  useEffect(() => {
    if (isSuccess && user) {
      setUser(user);
      setIsLoading(false);
    }
  }, [user, isSuccess, setUser, setIsLoading]);

  return { user };
};
