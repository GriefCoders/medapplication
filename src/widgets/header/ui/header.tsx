import { routes } from "@/app/routes/routes";
import { useUserStore } from "@/entities/user/model/store";
import { useLogout } from "@/features/auth/model/use-auth";
import { UserAvatar } from "@/shared/components/user-avatar";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Link,
  Navbar,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from "@heroui/react";
import { useLocation, useNavigate } from "react-router-dom";
import type { HeaderLink } from "../model/header-items";
import { headerLinks } from "../model/header-items";

export const Header = () => {
  const { user } = useUserStore();
  const location = useLocation();
  const logout = useLogout();
  const navigate = useNavigate();

  return (
    <Navbar
      disableAnimation
      position="static"
      className="bg-background/40 backdrop-blur-md border-b border-border"
    >
      <NavbarContent className="sm:hidden" justify="start">
        <NavbarMenuToggle className="text-foreground" />
      </NavbarContent>
      <NavbarContent className="hidden sm:flex" justify="start"></NavbarContent>

      <NavbarContent className="hidden sm:flex gap-6" justify="center">
        {headerLinks.map((link: HeaderLink) => {
          if (link.roles && user?.role && !link.roles.includes(user.role)) {
            return null;
          }
          const isActive = location.pathname === link.href;
          return (
            <NavbarItem key={link.href} isActive={isActive}>
              <Link
                href={link.href}
                className={`transition-colors duration-200 ${
                  isActive
                    ? "text-primary font-medium"
                    : "text-foreground/80 hover:text-primary"
                }`}
              >
                {link.label}
              </Link>
            </NavbarItem>
          );
        })}
      </NavbarContent>

      <NavbarContent as="div" justify="end">
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
              <div className="flex items-center gap-4 cursor-pointer">
              <div className="flex flex-col items-end">
                <p className="text-sm font-medium text-foreground">
                  {user?.fullName || user?.email}
                </p>
                <p className="text-xs text-secondary">{user?.email}</p>
              </div>
              <div className="relative">
                <UserAvatar person={user?.person} size="md" />
                <div className="absolute -inset-0.5 bg-gradient-to-r from-teal-400/30 to-cyan-400/30 rounded-full blur opacity-50"></div>
              </div>
            </div>
          </DropdownTrigger>
          <DropdownMenu aria-label="Меню пользователя" variant="flat">
            <DropdownItem
              key="profile"
              textValue={`Вы вошли как ${user?.email}`}
              className="h-14 gap-2"
            >
              <p className="text-foreground">Вы вошли как</p>
              <p className="text-secondary">{user?.email}</p>
            </DropdownItem>
            <DropdownItem
              key="settings"
              onPress={() => {
                navigate(routes.profile.root);
              }}
            >
              Профиль
            </DropdownItem>
            <DropdownItem
              key="logout"
              textValue="Выйти"
              className="text-danger"
              onPress={logout}
            >
              Выйти
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>

      <NavbarMenu>
        {headerLinks.map((link: HeaderLink) => {
          if (link.roles && user?.role && !link.roles.includes(user.role)) {
            return null;
          }
          const isActive = location.pathname === link.href;
          return (
            <NavbarMenuItem key={link.href}>
              <Link
                href={link.href}
                className={`text-xl transition-colors duration-200 ${
                  isActive
                    ? "text-primary font-medium"
                    : "text-foreground/80 hover:text-primary"
                }`}
              >
                {link.label}
              </Link>
            </NavbarMenuItem>
          );
        })}
      </NavbarMenu>
    </Navbar>
  );
};
