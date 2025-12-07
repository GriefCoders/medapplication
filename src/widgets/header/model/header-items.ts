import { routes } from "@/app/routes/routes";
import { Role } from "@/shared/types/enums";

export interface HeaderLink {
  label: string;
  href: string;
  roles?: Role[];
}

export const headerLinks: HeaderLink[] = [
  {
    label: "Главная",
    href: routes.main.home,
  },
  {
    label: "Мои заявки",
    href: routes.serviceRequests.my,
    roles: [Role.USER, Role.ENGINEER],
  },
  {
    label: "Все заявки",
    href: routes.serviceRequests.root,
    roles: [Role.ADMIN, Role.ENGINEER],
  },
  {
    label: "Инвентарь",
    href: routes.equipment.root,
  },
  {
    label: "Пользователи",
    href: routes.users.root,
    roles: [Role.ADMIN],
  },
];
