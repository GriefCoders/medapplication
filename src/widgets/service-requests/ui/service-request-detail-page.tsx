import { routes } from "@/app/routes/routes";
import {
  useAssignServiceRequest,
  useDeleteServiceRequest,
  useGetServiceRequestById,
  useUpdateServiceRequest,
  useUpdateServiceRequestStatus,
} from "@/entities/service-request/api";
import { useGetCurrentUser, useSearchUsers } from "@/entities/user/api";
import { QUERY_KEYS } from "@/shared/api/query-keys";
import { Role, ServiceRequestStatus } from "@/shared/types/enums";
import {
  getPriorityColor,
  getStatusColor,
  getStatusLabel,
} from "@/shared/utils";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
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
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

export const ServiceRequestDetailPage = () => {
  const queryClient = useQueryClient();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: currentUser } = useGetCurrentUser();
  const { data: request, isLoading } = useGetServiceRequestById(id!);
  const isAdmin = currentUser?.role === Role.ADMIN;
  const { data: engineers } = useSearchUsers(undefined, {
    enabled: isAdmin,
  });
  const [selectedStatus, setSelectedStatus] = useState<ServiceRequestStatus>();
  const [selectedEngineer, setSelectedEngineer] = useState<string>();
  const [closeComment, setCloseComment] = useState("");
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();
  const {
    isOpen: isCloseOpen,
    onOpen: onCloseOpen,
    onClose: onCloseClose,
  } = useDisclosure();

  const updateStatus = useUpdateServiceRequestStatus({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.SERVICE_REQUEST.BY_ID, id!],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.SERVICE_REQUEST.ALL],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.SERVICE_REQUEST.MY],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.SERVICE_REQUEST.STATS],
      });
      toast.success("Заявка обновлена");
      setSelectedStatus(undefined);
      setCloseComment("");
      onCloseClose();
    },
  });

  const assignEngineer = useAssignServiceRequest({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.SERVICE_REQUEST.BY_ID, id!],
      });
      toast.success("Исполнитель назначен");
      setSelectedEngineer(undefined);
    },
  });

  const deleteRequest = useDeleteServiceRequest({
    onSuccess: () => {
      toast.success("Заявка удалена");
      navigate(routes.serviceRequests.root);
    },
  });

  const updateRequest = useUpdateServiceRequest({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.SERVICE_REQUEST.BY_ID, id!],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.SERVICE_REQUEST.ALL],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.SERVICE_REQUEST.MY],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.SERVICE_REQUEST.STATS],
      });
      toast.success("Заявка обновлена");
      setCloseComment("");
      onCloseClose();
    },
  });

  const isOnlyEngineer = currentUser?.role === Role.ENGINEER;

  const handleStatusUpdate = () => {
    if (selectedStatus && id) {
      updateStatus.mutate({ id, status: selectedStatus });
    }
  };

  const handleAssignEngineer = () => {
    if (selectedEngineer && id) {
      assignEngineer.mutate({ id, payload: { assigneeId: selectedEngineer } });
    }
  };

  const handleDeleteConfirm = () => {
    if (id) {
      deleteRequest.mutate(id);
    }
  };

  const handleTakeToWork = () => {
    if (id) {
      updateStatus.mutate({
        id,
        status: ServiceRequestStatus.IN_PROGRESS,
      });
    }
  };

  const handleCloseRequest = () => {
    if (id) {
      updateStatus.mutate({
        id,
        status: ServiceRequestStatus.CLOSED,
        comment: closeComment || undefined,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!request) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardBody className="text-center py-12">
            <p className="text-default-500">Заявка не найдена</p>
            <Button
              className="mt-4"
              onPress={() => navigate(routes.serviceRequests.root)}
            >
              Вернуться к списку
            </Button>
          </CardBody>
        </Card>
      </div>
    );
  }

  const engineersList = engineers?.filter((u) => u.role === Role.ENGINEER);

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="flex justify-between items-center mb-4">
        <Button variant="light" onPress={() => navigate(-1)}>
          ← Назад
        </Button>
        {isAdmin && (
          <Button color="danger" variant="flat" onPress={onDeleteOpen}>
            Удалить заявку
          </Button>
        )}
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader className="flex flex-col items-start px-6 pt-6">
            <div className="flex justify-between items-start w-full mb-3">
              <h1 className="text-2xl font-semibold text-foreground">
                {request.summary}
              </h1>
              <Chip variant="flat" className={getStatusColor(request.status)}>
                {getStatusLabel(request.status)}
              </Chip>
            </div>
            <div className="flex gap-2">
              {request.priority && (
                <Chip
                  size="sm"
                  variant="flat"
                  className={getPriorityColor(request.priority)}
                >
                  Приоритет: {request.priority}
                </Chip>
              )}
              {request.type && (
                <Chip size="sm" variant="flat">
                  {request.type}
                </Chip>
              )}
            </div>
          </CardHeader>
          <CardBody className="px-6 pb-6">
            {request.description && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-default-500 mb-2">
                  Описание
                </h3>
                <p className="text-foreground">{request.description}</p>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-6">
              {request.sender && (
                <div>
                  <h3 className="text-sm font-semibold text-default-500 mb-2">
                    Отправитель
                  </h3>
                  <p className="font-medium text-foreground">
                    {request.sender.fullName}
                  </p>
                  <p className="text-sm text-default-500">
                    {request.sender.email}
                  </p>
                  {request.sender.roomNumber && (
                    <p className="text-sm text-default-500">
                      Комната: {request.sender.roomNumber}
                    </p>
                  )}
                </div>
              )}

              {request.assignee && (
                <div>
                  <h3 className="text-sm font-semibold text-default-500 mb-2">
                    Исполнитель
                  </h3>
                  <p className="font-medium text-foreground">
                    {request.assignee.fullName}
                  </p>
                  <p className="text-sm text-default-500">
                    {request.assignee.email}
                  </p>
                </div>
              )}

              {request.site && (
                <div>
                  <h3 className="text-sm font-semibold text-default-500 mb-2">
                    Отделение
                  </h3>
                  <p className="font-medium text-foreground">
                    {request.site.name}
                  </p>
                  <p className="text-sm text-default-500">
                    {request.site.address}
                  </p>
                </div>
              )}

              {request.equipment && (
                <div>
                  <h3 className="text-sm font-semibold text-default-500 mb-2">
                    Оборудование
                  </h3>
                  <p className="font-medium text-foreground">
                    {request.equipment.name}
                  </p>
                  {request.equipment.inventoryNumber && (
                    <p className="text-sm text-default-500">
                      Инв. №: {request.equipment.inventoryNumber}
                    </p>
                  )}
                  {request.equipment.roomNumber && (
                    <p className="text-sm text-default-500">
                      Комната: {request.equipment.roomNumber}
                    </p>
                  )}
                </div>
              )}
            </div>

            {request.comment && (
              <div className="mt-6 pt-6 border-t border-divider">
                <h3 className="text-sm font-semibold text-default-500 mb-2">
                  Комментарий инженера
                </h3>
                <p className="text-foreground">{request.comment}</p>
              </div>
            )}

            <div className="mt-6 pt-6 border-t border-divider">
              <div className="flex gap-4 text-sm text-default-500">
                <div>
                  <span>Создана:</span>
                  <span className="ml-2 font-medium text-foreground">
                    {new Date(request.createdAt).toLocaleString("ru-RU")}
                  </span>
                </div>
                <div>
                  <span>Обновлена:</span>
                  <span className="ml-2 font-medium text-foreground">
                    {new Date(request.updatedAt).toLocaleString("ru-RU")}
                  </span>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        {(isAdmin ||
          (isOnlyEngineer &&
            request.assigneeId === currentUser?.id &&
            request.status !== ServiceRequestStatus.CLOSED)) && (
          <Card>
            <CardHeader className="px-6 pt-6">
              <h2 className="text-xl font-semibold text-foreground">
                Управление заявкой
              </h2>
            </CardHeader>
            <CardBody className="px-6 pb-6">
              {isOnlyEngineer && request.assigneeId === currentUser?.id && (
                <div className="flex gap-3 mb-6">
                  {request.status === ServiceRequestStatus.OPEN && (
                    <Button
                      color="primary"
                      className="flex-1 text-white"
                      onPress={handleTakeToWork}
                      isLoading={updateRequest.isPending}
                    >
                      Взять в работу
                    </Button>
                  )}
                  {request.status === ServiceRequestStatus.IN_PROGRESS && (
                    <Button
                      color="success"
                      className="flex-1 text-white"
                      onPress={onCloseOpen}
                      isLoading={updateRequest.isPending}
                    >
                      Закрыть заявку
                    </Button>
                  )}
                </div>
              )}

              {isAdmin && (
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Select
                      label="Изменить статус"
                      placeholder="Выберите статус"
                      selectedKeys={selectedStatus ? [selectedStatus] : []}
                      onChange={(e) =>
                        setSelectedStatus(
                          e.target.value as ServiceRequestStatus
                        )
                      }
                    >
                      <SelectItem key={ServiceRequestStatus.OPEN}>
                        Открыта
                      </SelectItem>
                      <SelectItem key={ServiceRequestStatus.IN_PROGRESS}>
                        В работе
                      </SelectItem>
                      <SelectItem key={ServiceRequestStatus.CLOSED}>
                        Закрыта
                      </SelectItem>
                    </Select>
                    <Button
                      color="primary"
                      className="mt-2 w-full"
                      isDisabled={!selectedStatus}
                      isLoading={updateStatus.isPending}
                      onPress={handleStatusUpdate}
                    >
                      Обновить статус
                    </Button>
                  </div>

                  <div>
                    <Select
                      label="Назначить исполнителя"
                      placeholder="Выберите инженера"
                      selectedKeys={selectedEngineer ? [selectedEngineer] : []}
                      onChange={(e) => setSelectedEngineer(e.target.value)}
                      items={engineersList || []}
                    >
                      {(engineer) => (
                        <SelectItem key={engineer.id}>
                          {engineer.fullName}
                        </SelectItem>
                      )}
                    </Select>
                    <Button
                      color="primary"
                      className="mt-2 w-full"
                      isDisabled={!selectedEngineer}
                      isLoading={assignEngineer.isPending}
                      onPress={handleAssignEngineer}
                    >
                      Назначить
                    </Button>
                  </div>
                </div>
              )}
            </CardBody>
          </Card>
        )}
      </div>

      <Modal isOpen={isCloseOpen} onClose={onCloseClose}>
        <ModalContent>
          <ModalHeader>Закрыть заявку</ModalHeader>
          <ModalBody>
            <p className="mb-4">
              Вы закрываете заявку <strong>{request.summary}</strong>
            </p>
            <textarea
              className="w-full p-3 border border-border rounded-lg focus:outline-none focus:border-primary bg-background text-foreground resize-none"
              rows={4}
              placeholder="Комментарий (необязательно)"
              value={closeComment}
              onChange={(e) => setCloseComment(e.target.value)}
            />
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onCloseClose}>
              Отмена
            </Button>
            <Button
              color="success"
              className="text-white"
              onPress={handleCloseRequest}
              isLoading={updateRequest.isPending}
            >
              Закрыть заявку
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isDeleteOpen} onClose={onDeleteClose}>
        <ModalContent>
          <ModalHeader>Удалить заявку</ModalHeader>
          <ModalBody>
            <p>
              Вы уверены, что хотите удалить заявку{" "}
              <strong>{request.summary}</strong>?
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
              isLoading={deleteRequest.isPending}
            >
              Удалить
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};
