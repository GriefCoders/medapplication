export const routes = {
  auth: {
    root: "/auth",
    login: "/auth/login",
  },
  main: {
    home: "/home",
  },
  serviceRequests: {
    root: "/service-requests",
    my: "/service-requests/my",
    create: "/service-requests/create",
    view: "/service-requests/:id",
  },
  equipment: {
    root: "/equipment",
    view: "/equipment/:id",
    create: "/equipment/create",
  },
  users: {
    root: "/users",
    create: "/users/create",
  },
  profile: {
    root: "/profile",
  },
  admin: {
    root: "/administration",
  },
} as const;
