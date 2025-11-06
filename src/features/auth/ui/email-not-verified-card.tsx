import { useUserStore } from "@/entities/user/model/store";
import { getEmailServiceUrl } from "@/features/auth/model/email";
import { useLogout } from "@/features/auth/model/use-auth";
import { Button } from "@heroui/button";
import { MailOpen } from "lucide-react";

export const EmailNotVerifiedCard = () => {
  const { user } = useUserStore();
  const logout = useLogout();

  const handleOpenEmailService = () => {
    if (user?.email) {
      const emailServiceUrl = getEmailServiceUrl(user.email);
      window.open(emailServiceUrl, "_blank");
    }
  };

  return (
    <div className="flex flex-1 items-center justify-center h-full">
      <div className="max-w-2xl mx-auto flex flex-col p-8 bg-background/50 border border-border rounded-xl backdrop-blur-xl">
        <div className="flex flex-col gap-8">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
              <MailOpen className="w-8 h-8 text-orange-600 dark:text-orange-400" />
            </div>
          </div>

          <div className="text-center space-y-4">
            <h2 className="text-xl font-semibold text-foreground">
              Подтвердите свою почту
            </h2>
            <p className="text-secondary text-sm">
              На вашу электронную почту отправлено письмо с ссылкой для
              подтверждения аккаунта. Подтверждение почты обязательно для
              использования сервиса.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <Button
              color="primary"
              size="lg"
              className="w-full"
              onPress={handleOpenEmailService}
            >
              Перейти в почтовый сервис
              {` (${getEmailServiceUrl(user?.email ?? "").replace(
                "https://",
                ""
              )})`}
            </Button>

            <Button
              variant="light"
              size="lg"
              className="w-full"
              onPress={logout}
            >
              Выйти из аккаунта
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
