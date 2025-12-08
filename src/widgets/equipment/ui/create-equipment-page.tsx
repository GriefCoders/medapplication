import { routes } from "@/app/routes/routes";
import { useCreateEquipment } from "@/entities/equipment/api";
import { useSearchSites } from "@/entities/site/api";
import { QUERY_KEYS } from "@/shared/api/query-keys";
import { CustomForm } from "@/shared/components/form/form";
import type { FieldConfig } from "@/shared/types/form";
import { Card, CardBody, CardHeader } from "@heroui/react";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2, "Минимум 2 символа"),
  description: z.string().optional(),
  inventoryNumber: z.string().optional(),
  serialNumber: z.string().optional(),
  siteId: z.string().min(1, "Выберите отделение"),
  state: z.string().optional(),
  roomNumber: z.string().optional(),
});

export const CreateEquipmentPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: sites } = useSearchSites();
  const createEquipment = useCreateEquipment({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.EQUIPMENT.SEARCH],
      });
      toast.success("Оборудование добавлено успешно");
      navigate(routes.equipment.root);
    },
  });

  const fields: FieldConfig[] = [
    {
      name: "name",
      label: "Название оборудования",
      type: "text",
      placeholder: "Например: МРТ аппарат Siemens",
    },
    {
      name: "description",
      label: "Описание",
      type: "textarea",
      placeholder: "Опишите оборудование",
    },
    {
      name: "inventoryNumber",
      label: "Инвентарный номер",
      type: "text",
      placeholder: "INV-0001",
    },
    {
      name: "serialNumber",
      label: "Серийный номер",
      type: "text",
      placeholder: "SN-123456",
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
      name: "state",
      label: "Состояние",
      type: "select",
      placeholder: "Выберите состояние",
      options: [
        { label: "Рабочее", value: "Рабочее" },
        { label: "Требует ремонта", value: "Требует ремонта" },
        { label: "На обслуживании", value: "На обслуживании" },
        { label: "Не работает", value: "Не работает" },
      ],
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
            Добавление оборудования
          </h1>
          <p className="text-sm text-default-500">
            Заполните форму для добавления нового оборудования в инвентарь
          </p>
        </CardHeader>
        <CardBody className="px-6 pb-6">
          <CustomForm
            fields={fields}
            schema={schema}
            onSubmit={(data) => createEquipment.mutate(data)}
            submitText="Добавить оборудование"
            onCancel={() => navigate(routes.equipment.root)}
            isPending={createEquipment.isPending}
          />
        </CardBody>
      </Card>
    </div>
  );
};
