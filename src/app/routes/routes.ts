export const routes = {
  auth: {
    root: "/auth",
    login: "/auth/login",
    register: "/auth/register",
    emailVerify: "/auth/email-verify/:token",
  },
  main: {
    home: "/home",
  },
  room: {
    root: "/room",
    join: "/room/:id",
  },
  groups: {
    join: "/groups/:token/join",
  },
  profile: {
    root: "/profile",
  },
  admin: {
    root: "/administration",
  },
} as const;
