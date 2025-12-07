import { routes } from "@/app/routes/routes";
import {
  useGetAllServiceRequests,
  useGetServiceRequestStats,
} from "@/entities/service-request/api";
import { useGetCurrentUser } from "@/entities/user/api";
import { Role, ServiceRequestStatus } from "@/shared/types/enums";
import { Button, Card, CardBody, Chip, Spinner } from "@heroui/react";
import { useNavigate } from "react-router-dom";

export const HomePage = () => {
  const navigate = useNavigate();
  const { data: currentUser } = useGetCurrentUser();
  const isAdmin = currentUser?.role === Role.ADMIN;
  const isEngineer = currentUser?.role === Role.ENGINEER;
  const isAdminOrEngineer = isAdmin || isEngineer;

  const { data: stats, isLoading: statsLoading } = useGetServiceRequestStats({
    enabled: isAdminOrEngineer,
  });

  const { data: openRequests, isLoading: requestsLoading } =
    useGetAllServiceRequests(ServiceRequestStatus.OPEN, {
      enabled: isAdminOrEngineer,
    });

  const getRoleName = (role?: Role) => {
    switch (role) {
      case Role.ADMIN:
        return "Администратор";
      case Role.ENGINEER:
        return "Инженер";
      case Role.USER:
        return "Пользователь";
      default:
        return "";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-10">
        <div className="flex items-baseline gap-3 mb-2">
          <h1 className="text-2xl font-semibold text-foreground">
            {currentUser?.fullName}
          </h1>
          <Chip size="sm" variant="flat" color="default">
            {getRoleName(currentUser?.role)}
          </Chip>
        </div>
        <p className="text-default-500 text-sm">
          Система управления медицинским оборудованием
        </p>
      </div>

      <div className="space-y-8">
        <div>
          <h2 className="text-lg font-medium text-foreground mb-4">
            Быстрые действия
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 [&>*:last-child:nth-child(odd)]:md:col-span-2">
            {!isAdmin && (
              <Card
                isPressable
                onPress={() => navigate(routes.serviceRequests.my)}
                className="border-2 border-transparent hover:border-primary transition-colors"
              >
                <CardBody className="p-5">
                  <h3 className="text-base font-medium text-foreground mb-1">
                    Мои заявки
                  </h3>
                  <p className="text-default-500 text-sm">
                    Отслеживайте статус ваших заявок
                  </p>
                </CardBody>
              </Card>
            )}

            {isAdminOrEngineer && (
              <Card
                isPressable
                onPress={() => navigate(routes.serviceRequests.root)}
                className="border-2 border-transparent hover:border-primary transition-colors"
              >
                <CardBody className="p-5">
                  <h3 className="text-base font-medium text-foreground mb-1">
                    Все заявки
                  </h3>
                  <p className="text-default-500 text-sm">
                    Управление всеми заявками системы
                  </p>
                </CardBody>
              </Card>
            )}

            {!isAdmin && (
              <Card
                isPressable
                onPress={() => navigate(routes.serviceRequests.create)}
                className="border-2 border-transparent hover:border-primary transition-colors"
              >
                <CardBody className="p-5">
                  <h3 className="text-base font-medium text-foreground mb-1">
                    Создать заявку
                  </h3>
                  <p className="text-default-500 text-sm">
                    Отправить новую заявку на обслуживание
                  </p>
                </CardBody>
              </Card>
            )}

            <Card
              isPressable
              onPress={() => navigate(routes.equipment.root)}
              className="border-2 border-transparent hover:border-primary transition-colors"
            >
              <CardBody className="p-5">
                <h3 className="text-base font-medium text-foreground mb-1">
                  Инвентарь
                </h3>
                <p className="text-default-500 text-sm">
                  Просмотр оборудования и его состояния
                </p>
              </CardBody>
            </Card>

            {isAdmin && (
              <Card
                isPressable
                onPress={() => navigate(routes.users.root)}
                className="border-2 border-transparent hover:border-primary transition-colors"
              >
                <CardBody className="p-5">
                  <h3 className="text-base font-medium text-foreground mb-1">
                    Пользователи
                  </h3>
                  <p className="text-default-500 text-sm">
                    Управление пользователями системы
                  </p>
                </CardBody>
              </Card>
            )}
          </div>
        </div>

        {isAdminOrEngineer && (
          <div>
            <h2 className="text-lg font-medium text-foreground mb-4">
              Статистика
            </h2>
            <Card>
              <CardBody className="p-5">
                {statsLoading ? (
                  <div className="flex justify-center py-8">
                    <Spinner size="lg" />
                  </div>
                ) : stats ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div>
                      <p className="text-xs text-default-400 uppercase tracking-wide mb-2">
                        Всего заявок
                      </p>
                      <p className="text-3xl font-semibold text-foreground">
                        {stats.total || 0}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-default-400 uppercase tracking-wide mb-2">
                        Открыто
                      </p>
                      <p className="text-3xl font-semibold text-warning">
                        {stats.open || 0}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-default-400 uppercase tracking-wide mb-2">
                        В работе
                      </p>
                      <p className="text-3xl font-semibold text-primary">
                        {stats.inProgress || 0}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-default-400 uppercase tracking-wide mb-2">
                        Выполнено
                      </p>
                      <p className="text-3xl font-semibold text-success">
                        {stats.closed || 0}
                      </p>
                    </div>
                  </div>
                ) : null}
              </CardBody>
            </Card>
          </div>
        )}

        {isAdminOrEngineer && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-foreground">
                Открытые заявки
              </h2>
              <Button
                size="sm"
                variant="flat"
                onPress={() => navigate(routes.serviceRequests.root)}
              >
                Все заявки
              </Button>
            </div>
            <Card>
              <CardBody className="p-5">
                {requestsLoading ? (
                  <div className="flex justify-center py-8">
                    <Spinner />
                  </div>
                ) : openRequests && openRequests.length > 0 ? (
                  <div className="divide-y divide-divider">
                    {openRequests.slice(0, 5).map((request) => (
                      <button
                        key={request.id}
                        onClick={() =>
                          navigate(
                            routes.serviceRequests.view.replace(
                              ":id",
                              request.id
                            )
                          )
                        }
                        className="w-full text-left py-4 first:pt-0 last:pb-0 hover:opacity-70 transition-opacity"
                      >
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-foreground mb-1 truncate">
                              {request.summary}
                            </h3>
                            <p className="text-sm text-default-500">
                              {request.sender?.fullName}
                              {request.site?.name && ` • ${request.site.name}`}
                            </p>
                          </div>
                          {request.priority && (
                            <Chip
                              size="sm"
                              variant="flat"
                              color="warning"
                              className="flex-shrink-0"
                            >
                              {request.priority}
                            </Chip>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-default-400 py-8">
                    Нет открытых заявок
                  </p>
                )}
              </CardBody>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};
