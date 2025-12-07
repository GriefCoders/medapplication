import { HeroUIProvider } from "@heroui/react";

export const HeroProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <HeroUIProvider locale="ru-RU" defaultMode="light" disableAnimation>
      {children}
    </HeroUIProvider>
  );
};
