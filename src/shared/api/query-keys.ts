export const QUERY_KEYS = {
  AUTH: {
    LOGIN: "auth-login",
    REGISTER: "auth-register",
    LOGOUT: "auth-logout",
  },
  USER: {
    ME: "user-me",
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
  MEDIA: "media",
} as const;
