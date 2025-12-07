import { useSearchEquipment } from "@/entities/equipment/api";
import { Button, Card, CardBody, Input, Spinner } from "@heroui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { routes } from "@/app/routes/routes";
import { useGetCurrentUser } from "@/entities/user/api";
import { Role } from "@/shared/types/enums";

export const EquipmentListPage = () => {
  const navigate = useNavigate();
  const { data: currentUser } = useGetCurrentUser();
  const [searchQuery, setSearchQuery] = useState("");
  const { data: equipment, isLoading } = useSearchEquipment(searchQuery);

  const isAdmin = currentUser?.role === Role.ADMIN;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold">Инвентарь оборудования</h1>
        {isAdmin && (
          <Button
            color="primary"
            onPress={() => navigate(routes.equipment.create)}
          >
            Добавить оборудование
          </Button>
        )}
      </div>

      <div className="mb-6">
        <Input
          placeholder="Поиск по названию, инвентарному номеру, серийному номеру..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          size="lg"
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Spinner size="lg" />
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {equipment?.length === 0 ? (
            <Card className="col-span-full">
              <CardBody className="text-center py-12">
                <p className="text-default-500">Оборудование не найдено</p>
              </CardBody>
            </Card>
          ) : (
            equipment?.map((item) => (
              <Card
                key={item.id}
                isPressable
                onPress={() => navigate(routes.equipment.view.replace(":id", item.id))}
                className="hover:shadow-md transition-shadow"
              >
                <CardBody className="p-4">
                  <h3 className="text-lg font-semibold mb-2 text-foreground">{item.name}</h3>
                  
                  {item.description && (
                    <p className="text-sm text-default-600 mb-3 line-clamp-2">
                      {item.description}
                    </p>
                  )}

                  <div className="space-y-1 text-sm">
                    {item.inventoryNumber && (
                      <div className="flex justify-between">
                        <span className="text-default-500">Инв. номер:</span>
                        <span className="font-medium text-foreground">{item.inventoryNumber}</span>
                      </div>
                    )}
                    {item.serialNumber && (
                      <div className="flex justify-between">
                        <span className="text-default-500">Серийный номер:</span>
                        <span className="font-medium text-foreground">{item.serialNumber}</span>
                      </div>
                    )}
                    {item.state && (
                      <div className="flex justify-between">
                        <span className="text-default-500">Состояние:</span>
                        <span className="font-medium text-foreground">{item.state}</span>
                      </div>
                    )}
                    {item.roomNumber && (
                      <div className="flex justify-between">
                        <span className="text-default-500">Комната:</span>
                        <span className="font-medium text-foreground">{item.roomNumber}</span>
                      </div>
                    )}
                    {item.site && (
                      <div className="flex justify-between pt-2 border-t border-divider">
                        <span className="text-default-500">Отделение:</span>
                        <span className="font-medium text-foreground">{item.site.name}</span>
                      </div>
                    )}
                  </div>
                </CardBody>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
};

