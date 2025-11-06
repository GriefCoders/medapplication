import { routes } from "@/app/routes/routes";
import { useRegister } from "@/features/auth/model/use-auth";
import { CustomForm } from "@/shared/components/form";
import { Link } from "react-router-dom";
import { registerFields, registerSchema } from "../model/schema";

export const RegisterForm = () => {
  const { mutate: register } = useRegister();

  return (
    <div className="w-full space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-foreground">Создать аккаунт</h1>
        <p className="text-secondary">Зарегистрируйтесь для продолжения</p>
      </div>

      <CustomForm
        fields={registerFields}
        schema={registerSchema}
        onSubmit={register}
        submitText="Зарегистрироваться"
      />

      <p className="text-center text-sm text-secondary">
        Уже есть аккаунт?{" "}
        <Link
          to={routes.auth.login}
          className="text-primary hover:text-primary/80 transition-colors"
        >
          Войти
        </Link>
      </p>
    </div>
  );
};
