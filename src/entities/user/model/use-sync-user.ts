import { useGetCurrentUser } from "@/entities/user/api";
import { useUserStore } from "@/entities/user/model/store";
import { useEffect } from "react";

export const useSyncUser = () => {
  const { data: user, isSuccess, isLoading } = useGetCurrentUser();
  const { setUser, setIsLoading: setStoreLoading, setInitialized } = useUserStore();

  useEffect(() => {
    if (isSuccess) {
      if (user) {
        setUser(user);
      }
      setStoreLoading(false);
      setInitialized(true);
    } else if (!isLoading) {
      setStoreLoading(false);
      setInitialized(true);
    }
  }, [user, isSuccess, isLoading, setUser, setStoreLoading, setInitialized]);

  return { user };
};
