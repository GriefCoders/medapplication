import { routes } from "@/app/routes/routes";
import { Role } from "@/shared/types/enums";

export interface HeaderLink {
  id: string;
  label: string;
  href: string;
  roles?: Role[];
}

export const headerLinks: HeaderLink[] = [
  {
    id: "home",
    label: "Главная",
    href: routes.main.home,
  },
  {
    id: "my-requests-user",
    label: "Мои заявки",
    href: routes.serviceRequests.my,
    roles: [Role.USER],
  },
  {
    id: "my-requests-engineer",
    label: "Назначенные заявки",
    href: routes.serviceRequests.my,
    roles: [Role.ENGINEER],
  },
  {
    id: "all-requests",
    label: "Все заявки",
    href: routes.serviceRequests.root,
    roles: [Role.ADMIN],
  },
  {
    id: "equipment",
    label: "Инвентарь",
    href: routes.equipment.root,
  },
  {
    id: "users",
    label: "Пользователи",
    href: routes.users.root,
    roles: [Role.ADMIN],
  },
];
