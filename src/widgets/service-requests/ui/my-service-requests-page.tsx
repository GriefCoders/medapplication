import { useGetMyServiceRequests } from "@/entities/service-request/api";
import { getPriorityColor, getStatusColor, getStatusLabel } from "@/shared/utils";
import { Button, Card, CardBody, Chip, Spinner } from "@heroui/react";
import { useNavigate } from "react-router-dom";
import { routes } from "@/app/routes/routes";

export const MyServiceRequestsPage = () => {
  const navigate = useNavigate();
  const { data: requests, isLoading } = useGetMyServiceRequests();

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold">Мои заявки</h1>
        <Button
          color="primary"
          onPress={() => navigate(routes.serviceRequests.create)}
        >
          Создать заявку
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Spinner size="lg" />
        </div>
      ) : (
        <div className="grid gap-4">
          {requests?.length === 0 ? (
            <Card>
              <CardBody className="text-center py-12">
                <p className="text-default-500 mb-4">У вас пока нет заявок</p>
                <Button
                  color="primary"
                  onPress={() => navigate(routes.serviceRequests.create)}
                >
                  Создать первую заявку
                </Button>
              </CardBody>
            </Card>
          ) : (
            requests?.map((request) => (
              <Card
                key={request.id}
                isPressable
                onPress={() => navigate(routes.serviceRequests.view.replace(":id", request.id))}
                className="hover:shadow-md transition-shadow"
              >
                <CardBody className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2 text-foreground">{request.summary}</h3>
                      <div className="flex gap-2 mb-2">
                        <Chip size="sm" variant="flat" className={getStatusColor(request.status)}>
                          {getStatusLabel(request.status)}
                        </Chip>
                        {request.priority && (
                          <Chip size="sm" variant="flat" className={getPriorityColor(request.priority)}>
                            {request.priority}
                          </Chip>
                        )}
                      </div>
                    </div>
                  </div>

                  {request.description && (
                    <p className="text-sm text-default-600 mb-3 line-clamp-2">
                      {request.description}
                    </p>
                  )}

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {request.assignee && (
                      <div>
                        <span className="text-default-500">Исполнитель:</span>
                        <p className="font-medium text-foreground">{request.assignee?.fullName}</p>
                      </div>
                    )}
                    {request.equipment && (
                      <div>
                        <span className="text-default-500">Оборудование:</span>
                        <p className="font-medium text-foreground">{request.equipment?.name}</p>
                      </div>
                    )}
                  </div>

                  <div className="mt-3 text-xs text-default-400">
                    Создана: {new Date(request.createdAt).toLocaleString("ru-RU")}
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

