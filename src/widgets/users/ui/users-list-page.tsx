import { routes } from "@/app/routes/routes";
import {
  useDeleteUser,
  useSearchUsers,
  useUpdateUser,
} from "@/entities/user/api";
import type { UpdateUserDto, User } from "@/entities/user/model";
import { QUERY_KEYS } from "@/shared/api/query-keys";
import { Role } from "@/shared/types/enums";
import {
  Button,
  Card,
  CardBody,
  Chip,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Spinner,
  useDisclosure,
} from "@heroui/react";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const UsersListPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const { data: users, isLoading } = useSearchUsers(searchQuery);

  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editForm, setEditForm] = useState<UpdateUserDto>({});

  const updateUser = useUpdateUser({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USER.SEARCH] });
      onEditClose();
      setSelectedUser(null);
      setEditForm({});
    },
  });

  const deleteUser = useDeleteUser({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USER.SEARCH] });
      onDeleteClose();
      setSelectedUser(null);
    },
  });

  const handleEditClick = (user: User) => {
    setSelectedUser(user);
    setEditForm({
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      roomNumber: user.roomNumber ?? undefined,
    });
    onEditOpen();
  };

  const handleDeleteClick = (user: User) => {
    setSelectedUser(user);
    onDeleteOpen();
  };

  const handleEditSubmit = () => {
    if (selectedUser) {
      updateUser.mutate({ id: selectedUser.id, payload: editForm });
    }
  };

  const handleDeleteConfirm = () => {
    if (selectedUser) {
      deleteUser.mutate(selectedUser.id);
    }
  };

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
        <Button color="primary" onPress={() => navigate(routes.users.create)}>
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
                        <h3 className="text-lg font-semibold text-foreground">
                          {user.fullName}
                        </h3>
                        <Chip color={getRoleColor(user.role)} size="sm">
                          {getRoleText(user.role)}
                        </Chip>
                      </div>
                      <p className="text-sm text-default-600 mb-1">
                        {user.email}
                      </p>
                      <div className="flex gap-4 text-sm text-default-500">
                        {user.site && <span>Отделение: {user.site.name}</span>}
                        {user.roomNumber && (
                          <span>Комната: {user.roomNumber}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        color="primary"
                        variant="flat"
                        onPress={() => handleEditClick(user)}
                      >
                        Изменить
                      </Button>
                      <Button
                        size="sm"
                        color="danger"
                        variant="flat"
                        onPress={() => handleDeleteClick(user)}
                      >
                        Удалить
                      </Button>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))
          )}
        </div>
      )}

      <Modal isOpen={isEditOpen} onClose={onEditClose} size="2xl">
        <ModalContent>
          <ModalHeader>Редактировать пользователя</ModalHeader>
          <ModalBody>
            <div className="flex flex-col gap-4">
              <Input
                label="ФИО"
                value={editForm.fullName || ""}
                onChange={(e) =>
                  setEditForm({ ...editForm, fullName: e.target.value })
                }
              />
              <Input
                label="Email"
                type="email"
                value={editForm.email || ""}
                onChange={(e) =>
                  setEditForm({ ...editForm, email: e.target.value })
                }
              />
              <Select
                label="Роль"
                selectedKeys={editForm.role ? [editForm.role] : []}
                onSelectionChange={(keys) => {
                  const role = Array.from(keys)[0] as Role;
                  setEditForm({ ...editForm, role });
                }}
              >
                <SelectItem key={Role.USER}>
                  {getRoleText(Role.USER)}
                </SelectItem>
                <SelectItem key={Role.ENGINEER}>
                  {getRoleText(Role.ENGINEER)}
                </SelectItem>
                <SelectItem key={Role.ADMIN}>
                  {getRoleText(Role.ADMIN)}
                </SelectItem>
              </Select>
              <Input
                label="Номер комнаты"
                value={editForm.roomNumber || ""}
                onChange={(e) =>
                  setEditForm({ ...editForm, roomNumber: e.target.value })
                }
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onEditClose}>
              Отмена
            </Button>
            <Button
              color="primary"
              onPress={handleEditSubmit}
              isLoading={updateUser.isPending}
            >
              Сохранить
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isDeleteOpen} onClose={onDeleteClose}>
        <ModalContent>
          <ModalHeader>Удалить пользователя</ModalHeader>
          <ModalBody>
            <p>
              Вы уверены, что хотите удалить пользователя{" "}
              <strong>{selectedUser?.fullName}</strong>?
            </p>
            <p className="text-sm text-default-500 mt-2">
              Это действие нельзя отменить.
            </p>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onDeleteClose}>
              Отмена
            </Button>
            <Button
              color="danger"
              onPress={handleDeleteConfirm}
              isLoading={deleteUser.isPending}
            >
              Удалить
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};
