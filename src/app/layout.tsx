import { useUserStore } from "@/entities/user/model/store";
import { useSyncUser } from "@/entities/user/model/use-sync-user";
import { Header } from "@/widgets/header/ui/header";
import { Spinner } from "@heroui/react";
import { Outlet } from "react-router-dom";

export const LayoutPage = () => {
  useSyncUser();

  const { user } = useUserStore();

  return (
    <>
      <Header />
      {user ? (
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      ) : (
        <div className="flex flex-1 items-center justify-center">
          <div className="backdrop-blur-sm bg-background/10 rounded-xl p-8 border border-border">
            <Spinner size="lg" color="primary" />
          </div>
        </div>
      )}
    </>
  );
};
