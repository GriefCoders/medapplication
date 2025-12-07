import { Outlet } from "react-router-dom";

export const AuthPage = () => {
  return (
    <div className="relative flex h-screen items-center justify-center">
      <div className="relative bg-background/80 backdrop-blur-3xl rounded-2xl shadow-xl border border-border p-8 w-full max-w-md mx-4">
        <Outlet />
      </div>
    </div>
  );
};
