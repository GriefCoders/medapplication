import { routes } from "@/app/routes/routes";
import { Button } from "@heroui/react";
import { Link } from "react-router-dom";

export const NotFoundPage = () => {
  return (
    <>
      <div className="flex flex-1 items-center justify-center px-4 h-screen">
        <div className="w-full max-w-xl mx-auto flex flex-col p-8 bg-background/50 border border-border rounded-xl backdrop-blur-xl text-center">
          <div className="flex justify-center mb-6"></div>
          <div className="mb-2 text-7xl font-extrabold tracking-tight text-foreground/80">
            404
          </div>
          <h1 className="mb-2 text-3xl font-semibold text-foreground">
            Страница не найдена
          </h1>
          <p className="mb-8 text-secondary">
            Похоже, вы перешли по неверной ссылке или страница была удалена.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Button
              as={Link}
              to={routes.main.home}
              color="primary"
              variant="solid"
            >
              На главную
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
