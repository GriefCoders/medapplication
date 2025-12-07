export const getPriorityColor = (priority?: string | null): string => {
  if (!priority) return "bg-light text-secondary";

  switch (priority.toLowerCase()) {
    case "критичный":
    case "critical":
      return "bg-danger text-white";
    case "высокий":
    case "high":
      return "bg-danger/10 text-danger";
    case "средний":
    case "medium":
      return "bg-warning/10 text-warning";
    case "низкий":
    case "low":
      return "bg-success/10 text-success";
    default:
      return "bg-light text-secondary";
  }
};
