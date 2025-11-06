import { FormFieldTypes } from "@/shared/components/form/form-field-types";
import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Некорректный email"),
  password: z.string().min(6, "Пароль должен быть не менее 6 символов"),
});

export const loginFields = [
  {
    name: "email",
    label: "Email",
    type: FormFieldTypes.TEXT,
  },
  {
    name: "password",
    label: "Пароль",
    type: FormFieldTypes.PASSWORD,
  },
];

export const registerSchema = z.object({
  email: z.email("Некорректный email"),
  password: z.string().min(6, "Пароль должен быть не менее 6 символов"),
  name: z
    .string()
    .min(3, "Имя должно быть не менее 3 символов")
    .max(25, "Имя должно быть не более 25 символов"),
});

export const registerFields = [
  {
    name: "email",
    label: "Email",
    type: FormFieldTypes.TEXT,
  },
  {
    name: "password",
    label: "Пароль",
    type: FormFieldTypes.PASSWORD,
  },
  {
    name: "name",
    label: "Имя",
    type: FormFieldTypes.TEXT,
  },
];
