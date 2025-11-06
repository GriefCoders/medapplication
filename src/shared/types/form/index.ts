import { FormFieldTypes } from "@/shared/components/form";
import { z } from "zod";

export type FieldConfig = {
  name: string;
  label?: string;
  type: (typeof FormFieldTypes)[keyof typeof FormFieldTypes];
  placeholder?: string;
  defaultValue?: string | number | boolean | null | Array<string | number>;
  options?: { label: string; value: string | number }[];
  prefix?: React.ReactNode;
  onChange?: (
    value: string | number | boolean | Date | null | Array<string | number>
  ) => void;
};

export interface CustomFormProps<T extends z.ZodType> {
  fields: FieldConfig[];
  schema: T;
  onSubmit: (data: z.infer<T>) => void;
  submitText?: string;
  onCancel?: () => void;
  isPending?: boolean;
}
