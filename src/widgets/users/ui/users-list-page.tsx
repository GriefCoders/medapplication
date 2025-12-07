import { useSearchUsers } from "@/entities/user/api";
import { Role } from "@/shared/types/enums";
import { Button, Card, CardBody, Chip, Input, Spinner } from "@heroui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { routes } from "@/app/routes/routes";

export const UsersListPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const { data: users, isLoading } = useSearchUsers(searchQuery);

  const getRoleColor = (role: Role) => {
    switch (role) {
      case Role.ADMIN:
        return "danger";
      case Role.ENGINEER:
        return "primary";
      case Role.USER:
        return "default";
      default:
        return "default";
    }
  };

  const getRoleText = (role: Role) => {
    switch (role) {
      case Role.ADMIN:
        return "Администратор";
      case Role.ENGINEER:
        return "Инженер";
      case Role.USER:
        return "Пользователь";
      default:
        return role;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold">Управление пользователями</h1>
        <Button
          color="primary"
          onPress={() => navigate(routes.users.create)}
        >
          Добавить пользователя
        </Button>
      </div>

      <div className="mb-6">
        <Input
          placeholder="Поиск по имени, email, номеру комнаты..."
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
        <div className="grid gap-4">
          {users?.length === 0 ? (
            <Card>
              <CardBody className="text-center py-12">
                <p className="text-default-500">Пользователи не найдены</p>
              </CardBody>
            </Card>
          ) : (
            users?.map((user) => (
              <Card key={user.id} className="hover:shadow-md transition-shadow">
                <CardBody className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-foreground">{user.fullName}</h3>
                        <Chip color={getRoleColor(user.role)} size="sm">
                          {getRoleText(user.role)}
                        </Chip>
                      </div>
                      <p className="text-sm text-default-600 mb-1">{user.email}</p>
                      <div className="flex gap-4 text-sm text-default-500">
                        {user.site && <span>Отделение: {user.site.name}</span>}
                        {user.roomNumber && <span>Комната: {user.roomNumber}</span>}
                      </div>
                    </div>
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

