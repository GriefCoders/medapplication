import { routes } from "@/app/routes/routes";
import { AUTH_TOKEN } from "@/shared/types/token";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Mail } from "lucide-react";
import { useCallback, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { useVerifyEmail } from "../api";

export const EmailVerifyCard = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const { mutate: verifyEmail, isPending } = useVerifyEmail();

  const isAuth = useMemo(() => {
    return !!localStorage.getItem(AUTH_TOKEN.ACCESS);
  }, []);

  const handleVerify = useCallback(() => {
    if (token) {
      verifyEmail(token, {
        onSuccess: () => {
          toast.success("Почта успешно подтверждена");
          if (isAuth) {
            navigate(routes.main.home);
          } else {
            navigate(routes.auth.login);
          }
        },
        onError: () => {
          navigate(routes.auth.login);
        },
      });
    }
  }, [token, verifyEmail, navigate, isAuth]);

  return (
    <div>
      <div className="flex justify-center mb-6">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
          <Mail className="w-8 h-8 text-primary" />
        </div>
      </div>
      <div className="text-center space-y-4">
        <h2 className="text-xl font-semibold text-foreground">
          Подтвердите свою почту
        </h2>
        <p className="text-secondary text-sm">
          Вы перешли по ссылке из письма. Нажмите кнопку ниже, чтобы завершить
          подтверждение вашей электронной почты.
        </p>

        <div className="space-y-4 mt-6">
          <Input
            label="Токен верификации"
            value={token || ""}
            isDisabled
            variant="bordered"
            className="w-full"
          />

          <Button
            color="primary"
            size="lg"
            className="w-full"
            onPress={handleVerify}
            isLoading={isPending}
            isDisabled={!token}
          >
            Подтвердить почту
          </Button>
        </div>
      </div>
    </div>
  );
};
