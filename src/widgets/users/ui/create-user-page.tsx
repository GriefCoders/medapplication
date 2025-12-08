import { routes } from "@/app/routes/routes";
import { useSearchSites } from "@/entities/site/api";
import { useCreateUser } from "@/entities/user/api";
import { QUERY_KEYS } from "@/shared/api/query-keys";
import { CustomForm } from "@/shared/components/form/form";
import { Role } from "@/shared/types/enums";
import type { FieldConfig } from "@/shared/types/form";
import { Card, CardBody, CardHeader } from "@heroui/react";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";

const schema = z.object({
  fullName: z.string().min(2, "Минимум 2 символа"),
  email: z.string().email("Некорректный email"),
  password: z.string().min(6, "Минимум 6 символов"),
  role: z.nativeEnum(Role),
  siteId: z.string().min(1, "Выберите отделение"),
  roomNumber: z.string().optional(),
});

export const CreateUserPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: sites } = useSearchSites();
  const createUser = useCreateUser({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.USER.SEARCH],
      });
      toast.success("Пользователь создан успешно");
      navigate(routes.users.root);
    },
  });

  const fields: FieldConfig[] = [
    {
      name: "fullName",
      label: "Полное имя",
      type: "text",
      placeholder: "Иванов Иван Иванович",
    },
    {
      name: "email",
      label: "Email",
      type: "text",
      placeholder: "user@example.com",
    },
    {
      name: "password",
      label: "Пароль",
      type: "password",
      placeholder: "Минимум 6 символов",
    },
    {
      name: "role",
      label: "Роль",
      type: "select",
      placeholder: "Выберите роль",
      options: [
        { label: "Пользователь", value: Role.USER },
        { label: "Инженер", value: Role.ENGINEER },
        { label: "Администратор", value: Role.ADMIN },
      ],
    },
    {
      name: "siteId",
      label: "Отделение",
      type: "select",
      placeholder: "Выберите отделение",
      options: sites?.map((site) => ({
        label: site.name,
        value: site.id,
      })),
    },
    {
      name: "roomNumber",
      label: "Номер комнаты",
      type: "text",
      placeholder: "101",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Card>
        <CardHeader className="flex flex-col items-start px-6 pt-6">
          <h1 className="text-2xl font-semibold mb-2 text-foreground">
            Создание пользователя
          </h1>
          <p className="text-sm text-default-500">
            Заполните форму для создания нового пользователя системы
          </p>
        </CardHeader>
        <CardBody className="px-6 pb-6">
          <CustomForm
            fields={fields}
            schema={schema}
            onSubmit={(data) => createUser.mutate(data)}
            submitText="Создать пользователя"
            onCancel={() => navigate(routes.users.root)}
            isPending={createUser.isPending}
          />
        </CardBody>
      </Card>
    </div>
  );
};
