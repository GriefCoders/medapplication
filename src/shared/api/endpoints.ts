export const API_ENDPOINTS = {
  AUTH: {
    SIGNIN: "/auth/signin",
    SIGNUP: "/auth/signup",
    REFRESH: "/auth/refresh",
  },
  USER: {
    ME: "/user/me",
    SEARCH: "/user/search",
    BY_ID: (id: string) => `/user/${id}`,
    CREATE: "/user",
  },
  SITE: {
    SEARCH: "/site/search",
  },
  EQUIPMENT: {
    BASE: "/equipment",
    BY_ID: (id: string) => `/equipment/${id}`,
    HISTORY: (id: string) => `/equipment/${id}/history`,
  },
  SERVICE_REQUEST: {
    BASE: "/service-requests",
    MY: "/service-requests/my",
    STATS: "/service-requests/stats",
    BY_ID: (id: string) => `/service-requests/${id}`,
    STATUS: (id: string) => `/service-requests/${id}/status`,
    ASSIGN: (id: string) => `/service-requests/${id}/assign`,
  },
} as const;

