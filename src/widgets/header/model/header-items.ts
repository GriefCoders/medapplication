export interface HeaderLink {
  label: string;
  href: string;
  isAdminRequired: boolean;
}

export const headerLinks: HeaderLink[] = [
  {
    label: "Главная",
    href: "/home",
    isAdminRequired: false,
  },
  {
    label: "Администрирование",
    href: "/administration",
    isAdminRequired: true,
  },
];
