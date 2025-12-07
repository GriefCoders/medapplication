export const QUERY_KEYS = {
  AUTH: {
    LOGIN: "auth-login",
    REGISTER: "auth-register",
    LOGOUT: "auth-logout",
  },
  USER: {
    ME: "user-me",
    SEARCH: "user-search",
    BY_ID: "user-by-id",
    GROUP_MEMBERS: "user-group-members",
  },
  ADMIN: {
    USERS: "admin-users",
  },
  GROUP: {
    USER: "group-user",
    ALL: "group-all",
  },
  ROOM: {
    MY: "room-my",
    ALL: "room-all",
    ACCESS_TOKEN: "room-access-token",
    PERSONAL: "room-personal",
    PERMISSIONS: "room-permissions",
  },
  ROLE: {
    ALL: "role-all",
  },
  SITE: {
    SEARCH: "site-search",
    BY_ID: "site-by-id",
  },
  EQUIPMENT: {
    SEARCH: "equipment-search",
    BY_ID: "equipment-by-id",
    HISTORY: "equipment-history",
  },
  SERVICE_REQUEST: {
    ALL: "service-request-all",
    MY: "service-request-my",
    BY_ID: "service-request-by-id",
    STATS: "service-request-stats",
  },
  MEDIA: "media",
} as const;
