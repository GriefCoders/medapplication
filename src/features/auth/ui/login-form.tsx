import { useLogin } from "@/features/auth/model/use-auth";
import { CustomForm } from "@/shared/components/form";
import { loginFields, loginSchema } from "../model/schema";

export const LoginForm = () => {
  const { mutate: login } = useLogin();

  return (
    <div className="w-full space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-foreground">Добро пожаловать</h1>
        <p className="text-secondary">Войдите в свой аккаунт</p>
      </div>

      <CustomForm
        fields={loginFields}
        schema={loginSchema}
        onSubmit={login}
        submitText="Войти"
      />
    </div>
  );
};
