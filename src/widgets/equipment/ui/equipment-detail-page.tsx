import { routes } from "@/app/routes/routes";
import {
  useGetEquipmentById,
  useGetEquipmentHistory,
} from "@/entities/equipment/api";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { useNavigate, useParams } from "react-router-dom";

export const EquipmentDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: equipment, isLoading } = useGetEquipmentById(id!);
  const { data: history } = useGetEquipmentHistory(id!);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!equipment) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardBody className="text-center py-12">
            <p className="text-default-500">Оборудование не найдено</p>
            <Button
              className="mt-4"
              onPress={() => navigate(routes.equipment.root)}
            >
              Вернуться к списку
            </Button>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <Button
        variant="light"
        className="mb-4"
        onPress={() => navigate(routes.equipment.root)}
      >
        ← Назад к списку
      </Button>

      <div className="grid gap-6">
        <Card>
          <CardHeader className="flex flex-col items-start px-6 pt-6">
            <h1 className="text-2xl font-semibold mb-2 text-foreground">
              {equipment.name}
            </h1>
            {equipment.description && (
              <p className="text-default-600">{equipment.description}</p>
            )}
          </CardHeader>
          <CardBody className="px-6 pb-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-semibold text-default-500 mb-3">
                  Основная информация
                </h3>
                <div className="space-y-2">
                  {equipment.inventoryNumber && (
                    <div>
                      <span className="text-default-500">
                        Инвентарный номер:
                      </span>
                      <p className="font-medium text-foreground">
                        {equipment.inventoryNumber}
                      </p>
                    </div>
                  )}
                  {equipment.serialNumber && (
                    <div>
                      <span className="text-default-500">Серийный номер:</span>
                      <p className="font-medium text-foreground">
                        {equipment.serialNumber}
                      </p>
                    </div>
                  )}
                  {equipment.state && (
                    <div>
                      <span className="text-default-500">Состояние:</span>
                      <p className="font-medium text-foreground">
                        {equipment.state}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {equipment.site && (
                <div>
                  <h3 className="text-sm font-semibold text-default-500 mb-3">
                    Расположение
                  </h3>
                  <div className="space-y-2">
                    <div>
                      <span className="text-default-500">Отделение:</span>
                      <p className="font-medium text-foreground">
                        {equipment.site.name}
                      </p>
                    </div>
                    <div>
                      <span className="text-default-500">Адрес:</span>
                      <p className="font-medium text-foreground">
                        {equipment.site.address}
                      </p>
                    </div>
                    {equipment.roomNumber && (
                      <div>
                        <span className="text-default-500">Номер комнаты:</span>
                        <p className="font-medium text-foreground">
                          {equipment.roomNumber}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </CardBody>
        </Card>

        {history && history.length > 0 && (
          <Card>
            <CardHeader className="px-6 pt-6">
              <h2 className="text-xl font-semibold text-foreground">
                История ремонтов
              </h2>
            </CardHeader>
            <CardBody className="px-6 pb-6">
              <Table aria-label="История ремонтов">
                <TableHeader>
                  <TableColumn>Дата ремонта</TableColumn>
                  <TableColumn>Оборудование</TableColumn>
                </TableHeader>
                <TableBody>
                  {history.map((repair) => (
                    <TableRow key={repair.id}>
                      <TableCell>
                        {new Date(repair.date).toLocaleDateString("ru-RU")}
                      </TableCell>
                      <TableCell>
                        {repair.equipment?.name || equipment.name}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardBody>
          </Card>
        )}
      </div>
    </div>
  );
};
