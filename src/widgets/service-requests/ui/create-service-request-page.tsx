import { routes } from "@/app/routes/routes";
import { useSearchEquipment } from "@/entities/equipment/api";
import { useCreateServiceRequest } from "@/entities/service-request/api";
import { QUERY_KEYS } from "@/shared/api/query-keys";
import { CustomForm } from "@/shared/components/form/form";
import type { FieldConfig } from "@/shared/types/form";
import { Card, CardBody, CardHeader } from "@heroui/react";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";

const schema = z.object({
  summary: z.string().min(5, "Минимум 5 символов"),
  description: z.string().optional(),
  type: z.string().optional(),
  priority: z.string().optional(),
  equipmentId: z.string().optional(),
});

export const CreateServiceRequestPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: equipment } = useSearchEquipment();
  const createRequest = useCreateServiceRequest({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.SERVICE_REQUEST.ALL],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.SERVICE_REQUEST.MY],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.SERVICE_REQUEST.STATS],
      });
      toast.success("Заявка создана успешно");
      navigate(routes.serviceRequests.my);
    },
  });

  const fields: FieldConfig[] = [
    {
      name: "summary",
      label: "Краткое описание проблемы",
      type: "text",
      placeholder: "Например: Не работает МРТ аппарат",
    },
    {
      name: "description",
      label: "Подробное описание",
      type: "textarea",
      placeholder: "Опишите проблему подробнее",
    },
    {
      name: "equipmentId",
      label: "Оборудование",
      type: "select",
      placeholder: "Выберите оборудование",
      options: equipment?.map((e) => ({
        label: `${e.name} ${e.inventoryNumber ? `(${e.inventoryNumber})` : ""}`,
        value: e.id,
      })),
    },
    {
      name: "type",
      label: "Тип заявки",
      type: "select",
      placeholder: "Выберите тип",
      options: [
        { label: "Инцидент", value: "Инцидент" },
        { label: "Запрос", value: "Запрос" },
        { label: "Плановое обслуживание", value: "Плановое обслуживание" },
      ],
    },
    {
      name: "priority",
      label: "Приоритет",
      type: "select",
      placeholder: "Выберите приоритет",
      options: [
        { label: "Низкий", value: "Низкий" },
        { label: "Средний", value: "Средний" },
        { label: "Высокий", value: "Высокий" },
        { label: "Критичный", value: "Критичный" },
      ],
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Card>
        <CardHeader className="flex flex-col items-start px-6 pt-6">
          <h1 className="text-2xl font-semibold mb-2 text-foreground">
            Создание заявки
          </h1>
          <p className="text-sm text-default-500">
            Заполните форму для создания новой заявки на обслуживание
          </p>
        </CardHeader>
        <CardBody className="px-6 pb-6">
          <CustomForm
            fields={fields}
            schema={schema}
            onSubmit={(data) => createRequest.mutate(data)}
            submitText="Создать заявку"
            onCancel={() => navigate(routes.serviceRequests.my)}
            isPending={createRequest.isPending}
          />
        </CardBody>
      </Card>
    </div>
  );
};
