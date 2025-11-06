import type { CustomFormProps } from "@/shared/types/form";
import { Button } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { DynamicFields } from "./dynamic-fields";

export const CustomForm = <T extends z.ZodType>({
  fields,
  schema,
  onSubmit,
  submitText = "Отправить",
  onCancel,
  isPending,
}: CustomFormProps<T>) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Record<string, unknown>>({
    resolver: zodResolver(schema as never),
    defaultValues: fields.reduce(
      (acc, field) => ({
        ...acc,
        [field.name]:
          field.defaultValue ??
          (field.type === "checkbox"
            ? false
            : field.type === "date"
            ? null
            : field.type === "multi_select"
            ? []
            : ""),
      }),
      {} as Record<string, unknown>
    ),
  });

  const handleFormSubmit = (data: Record<string, unknown>) => {
    const processedData = Object.entries(data).reduce((acc, [key, value]) => {
      const field = fields.find((f) => f.name === key);

      const isEmptyString = typeof value === "string" && value.trim() === "";
      const isNull = value === null;

      if (isEmptyString || isNull) {
        if (field?.type === "multi_select") {
          acc[key] = [];
        } else {
          acc[key] = undefined;
        }
      } else {
        acc[key] = value;
      }
      return acc;
    }, {} as Record<string, unknown>);

    onSubmit(processedData as z.infer<T>);
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="flex flex-col space-y-4"
    >
      {fields.map((field) => (
        <Controller
          key={field.name}
          name={field.name}
          control={control}
          render={({ field: { onChange, value } }) => {
            const fieldName = field.name;
            const error = (errors as Record<string, { message?: string }>)[
              fieldName
            ];
            const helpText = error?.message;

            const handleChange = (
              newValue:
                | string
                | number
                | boolean
                | Date
                | null
                | Array<string | number>
            ) => {
              onChange(newValue);
              if (field.onChange) {
                field.onChange(newValue);
              }
            };

            return (
              <div className="flex flex-col space-y-1">
                <DynamicFields
                  type={field.type}
                  placeholder={field.placeholder}
                  value={value as string | number | boolean | Date | null}
                  onChange={handleChange}
                  options={field.options}
                  startContent={field.prefix}
                  label={field.label}
                />
                {helpText && (
                  <span className="text-sm text-red-500">
                    {String(helpText)}
                  </span>
                )}
              </div>
            );
          }}
        />
      ))}
      <div className="mt-4 flex w-full gap-2 mb-2">
        <Button
          isLoading={isPending}
          color="primary"
          type="submit"
          style={{ width: "100%", height: "40px" }}
        >
          {submitText}
        </Button>
        {onCancel && (
          <Button
            style={{ width: "100%", height: "40px" }}
            onPress={() => {
              reset();
              onCancel();
            }}
          >
            Отмена
          </Button>
        )}
      </div>
    </form>
  );
};
