import { LayoutPage } from "@/app/layout";
import { HomePage } from "@/widgets/home/ui/home-page";
import { NotFoundPage } from "@/widgets/not-found/ui/not-found-page";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { routes } from "./routes";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LayoutPage />,
    children: [
      {
        path: "/",
        element: <Navigate to={routes.main.home} />,
      },
      {
        path: routes.main.home,
        element: <HomePage />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);
