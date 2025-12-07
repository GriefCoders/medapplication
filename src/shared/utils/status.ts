import { ServiceRequestStatus } from "@/shared/types/enums";

export const getStatusColor = (status: ServiceRequestStatus): string => {
  switch (status) {
    case ServiceRequestStatus.OPEN:
      return "bg-warning text-white";
    case ServiceRequestStatus.IN_PROGRESS:
      return "bg-primary text-white";
    case ServiceRequestStatus.CLOSED:
      return "bg-success text-white";
    default:
      return "bg-light text-secondary";
  }
};

export const getStatusLabel = (status: ServiceRequestStatus): string => {
  switch (status) {
    case ServiceRequestStatus.OPEN:
      return "Открыто";
    case ServiceRequestStatus.IN_PROGRESS:
      return "В работе";
    case ServiceRequestStatus.CLOSED:
      return "Закрыто";
    default:
      return status;
  }
};
