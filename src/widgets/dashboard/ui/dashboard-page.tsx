import { routes } from "@/app/routes/routes";
import {
  useGetAllServiceRequests,
  useGetServiceRequestStats,
} from "@/entities/service-request/api";
import { useGetCurrentUser } from "@/entities/user/api";
import { Role, ServiceRequestStatus } from "@/shared/types/enums";
import { Card, CardBody, CardHeader, Chip, Spinner } from "@heroui/react";
import { useNavigate } from "react-router-dom";

export const DashboardPage = () => {
  const navigate = useNavigate();
  const { data: currentUser } = useGetCurrentUser();
  const { data: stats, isLoading: statsLoading } = useGetServiceRequestStats();
  const { data: openRequests, isLoading: requestsLoading } =
    useGetAllServiceRequests(ServiceRequestStatus.OPEN);

  const isEngineer =
    currentUser?.role === Role.ENGINEER || currentUser?.role === Role.ADMIN;

  const getStatusColor = (status: ServiceRequestStatus) => {
    switch (status) {
      case ServiceRequestStatus.OPEN:
        return "warning";
      case ServiceRequestStatus.IN_PROGRESS:
        return "primary";
      case ServiceRequestStatus.CLOSED:
        return "success";
      default:
        return "default";
    }
  };

  const getStatusText = (status: ServiceRequestStatus) => {
    switch (status) {
      case ServiceRequestStatus.OPEN:
        return "Открыта";
      case ServiceRequestStatus.IN_PROGRESS:
        return "В работе";
      case ServiceRequestStatus.CLOSED:
        return "Закрыта";
      default:
        return status;
    }
  };

  if (!isEngineer) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardBody className="text-center py-12">
            <p className="text-default-500">Доступ запрещен</p>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <h1 className="text-3xl font-semibold mb-6 text-foreground">
        Панель управления
      </h1>

      {statsLoading ? (
        <div className="flex justify-center py-8">
          <Spinner size="lg" />
        </div>
      ) : stats ? (
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardBody className="p-6">
              <p className="text-sm text-default-500 mb-2">Всего заявок</p>
              <p className="text-4xl font-semibold text-foreground">
                {stats.total || 0}
              </p>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="p-6 bg-warning-50 dark:bg-warning-50/10">
              <p className="text-sm text-default-500 mb-2">Открыто</p>
              <p className="text-4xl font-semibold text-warning-600">
                {stats.open || 0}
              </p>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="p-6 bg-primary-50 dark:bg-primary-50/10">
              <p className="text-sm text-default-500 mb-2">В работе</p>
              <p className="text-4xl font-semibold text-primary-600">
                {stats.inProgress || 0}
              </p>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="p-6 bg-success-50 dark:bg-success-50/10">
              <p className="text-sm text-default-500 mb-2">Закрыто</p>
              <p className="text-4xl font-semibold text-success-600">
                {stats.closed || 0}
              </p>
            </CardBody>
          </Card>
        </div>
      ) : null}

      <Card>
        <CardHeader className="px-6 pt-6">
          <h2 className="text-xl font-semibold text-foreground">
            Открытые заявки
          </h2>
        </CardHeader>
        <CardBody className="px-6 pb-6">
          {requestsLoading ? (
            <div className="flex justify-center py-8">
              <Spinner />
            </div>
          ) : openRequests && openRequests.length > 0 ? (
            <div className="space-y-3">
              {openRequests.slice(0, 5).map((request) => (
                <Card
                  key={request.id}
                  isPressable
                  onPress={() =>
                    navigate(
                      routes.serviceRequests.view.replace(":id", request.id)
                    )
                  }
                >
                  <CardBody className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1 text-foreground">
                          {request.summary}
                        </h3>
                        <p className="text-sm text-default-600">
                          {request.sender?.fullName || "Неизвестно"} •{" "}
                          {request.site?.name || "Неизвестно"}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Chip color={getStatusColor(request.status)} size="sm">
                          {getStatusText(request.status)}
                        </Chip>
                        {request.priority && (
                          <Chip size="sm" variant="flat">
                            {request.priority}
                          </Chip>
                        )}
                      </div>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-center text-default-500 py-8">
              Нет открытых заявок
            </p>
          )}
        </CardBody>
      </Card>
    </div>
  );
};
