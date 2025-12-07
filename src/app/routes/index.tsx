import { LayoutPage } from "@/app/layout";
import { AuthPage } from "@/features/auth/ui/auth-page";
import { LoginForm } from "@/features/auth/ui/login-form";
import {
  CreateEquipmentPage,
  EquipmentDetailPage,
  EquipmentListPage,
} from "@/widgets/equipment";
import { HomePage } from "@/widgets/home/ui/home-page";
import { NotFoundPage } from "@/widgets/not-found/ui/not-found-page";
import {
  CreateServiceRequestPage,
  MyServiceRequestsPage,
  ServiceRequestDetailPage,
  ServiceRequestsListPage,
} from "@/widgets/service-requests";
import { CreateUserPage, UsersListPage } from "@/widgets/users";
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
      {
        path: routes.serviceRequests.root,
        element: <ServiceRequestsListPage />,
      },
      {
        path: routes.serviceRequests.my,
        element: <MyServiceRequestsPage />,
      },
      {
        path: routes.serviceRequests.create,
        element: <CreateServiceRequestPage />,
      },
      {
        path: routes.serviceRequests.view,
        element: <ServiceRequestDetailPage />,
      },
      {
        path: routes.equipment.root,
        element: <EquipmentListPage />,
      },
      {
        path: routes.equipment.view,
        element: <EquipmentDetailPage />,
      },
      {
        path: routes.equipment.create,
        element: <CreateEquipmentPage />,
      },
      {
        path: routes.users.root,
        element: <UsersListPage />,
      },
      {
        path: routes.users.create,
        element: <CreateUserPage />,
      },
    ],
  },
  {
    path: routes.auth.root,
    element: <AuthPage />,
    children: [
      {
        path: routes.auth.login,
        element: <LoginForm />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);
