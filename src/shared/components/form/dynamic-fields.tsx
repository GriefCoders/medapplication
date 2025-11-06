import type { DateValue, Selection } from "@heroui/react";
import { Checkbox, DatePicker, Input, Select, SelectItem } from "@heroui/react";
import { fromDate, getLocalTimeZone, today } from "@internationalized/date";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { FormFieldTypes } from "./form-field-types";

export interface DynamicFieldsProps {
  type: (typeof FormFieldTypes)[keyof typeof FormFieldTypes];
  placeholder?: string;
  value?: string | number | boolean | Date | null | Array<string | number>;
  onChange?: (
    value: string | number | boolean | Date | null | Array<string | number>
  ) => void;
  startContent?: React.ReactNode;
  options?: { label: string; value: string | number }[];
  label?: string;
}

export const DynamicFields = ({
  type,
  placeholder,
  value,
  onChange,
  options,
  startContent,
  label,
}: DynamicFieldsProps) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () =>
    setIsPasswordVisible(!isPasswordVisible);

  const handleTextChange = (value: string) => {
    onChange?.(value);
  };

  const handleNumberChange = (value: string) => {
    if (value.trim() === "") {
      onChange?.(null);
      return;
    }
    const numValue = parseFloat(value);
    onChange?.(isNaN(numValue) ? null : numValue);
  };

  const handleSelectChange = (keys: Selection) => {
    if (keys === "all") return;
    const selectedKey = Array.from(keys)[0] as string;
    const selectedOption = options?.find(
      (opt) => opt.value != null && opt.value.toString() === selectedKey
    );
    onChange?.(selectedOption ? selectedOption.value : null);
  };

  const handleMultiSelectChange = (keys: Selection) => {
    if (keys === "all") {
      const allValues =
        options?.filter((opt) => opt.value != null).map((opt) => opt.value) ||
        [];
      onChange?.(allValues);
      return;
    }
    const selectedKeys = Array.from(keys) as string[];
    const selectedValues = selectedKeys
      .map((key) => {
        const option = options?.find(
          (opt) => opt.value != null && opt.value.toString() === key
        );
        return option?.value;
      })
      .filter(Boolean) as Array<string | number>;
    onChange?.(selectedValues);
  };

  const handleCheckboxChange = (isSelected: boolean) => {
    onChange?.(isSelected);
  };

  const handleDateChange = (value: DateValue | null) => {
    if (value) {
      const jsDate = value.toDate(getLocalTimeZone());
      onChange?.(jsDate.toISOString());
    } else {
      onChange?.(null);
    }
  };

  const getDateValue = (date: string | null): DateValue | null => {
    if (!date) return null;

    try {
      const jsDate = new Date(date);
      if (isNaN(jsDate.getTime())) return null;

      return fromDate(jsDate, getLocalTimeZone());
    } catch {
      return null;
    }
  };

  switch (type) {
    case "text":
      return (
        <Input
          label={label}
          size="sm"
          startContent={startContent}
          placeholder={placeholder}
          value={(value as string) ?? ""}
          onValueChange={handleTextChange}
          fullWidth
        />
      );
    case "password":
      return (
        <Input
          type={isPasswordVisible ? "text" : "password"}
          label={label}
          size="sm"
          startContent={startContent}
          placeholder={placeholder}
          value={(value as string) ?? ""}
          onValueChange={handleTextChange}
          endContent={
            <button
              aria-label="toggle password visibility"
              className="focus:outline-solid outline-transparent h-full cursor-pointer"
              type="button"
              onClick={togglePasswordVisibility}
            >
              {isPasswordVisible ? (
                <EyeOff className="w-5 h-5 text-secondary" />
              ) : (
                <Eye className="w-5 h-5 text-secondary" />
              )}
            </button>
          }
          fullWidth
        />
      );
    case "number":
      return (
        <Input
          type="number"
          label={label}
          size="sm"
          startContent={startContent}
          placeholder={placeholder}
          value={value?.toString() ?? ""}
          onValueChange={handleNumberChange}
          fullWidth
        />
      );
    case "select": {
      const availableValues = new Set(
        options
          ?.filter((opt) => opt.value != null)
          .map((opt) => opt.value.toString()) || []
      );
      const validValue =
        value && availableValues.has(value.toString())
          ? value.toString()
          : null;

      return (
        <Select
          label={label}
          size="sm"
          placeholder={placeholder}
          selectedKeys={validValue ? new Set([validValue]) : new Set()}
          onSelectionChange={handleSelectChange}
          fullWidth
        >
          {options
            ?.filter((option) => option.value != null)
            .map((option) => (
              <SelectItem key={option.value.toString()}>
                {option.label}
              </SelectItem>
            )) || []}
        </Select>
      );
    }
    case "multi_select": {
      const availableValues = new Set(
        options
          ?.filter((opt) => opt.value != null)
          .map((opt) => opt.value.toString()) || []
      );
      const validValues = Array.isArray(value)
        ? value.map((v) => v.toString()).filter((v) => availableValues.has(v))
        : [];

      return (
        <Select
          label={label}
          size="sm"
          placeholder={placeholder}
          selectionMode="multiple"
          selectedKeys={new Set(validValues)}
          onSelectionChange={handleMultiSelectChange}
          fullWidth
        >
          {options
            ?.filter((option) => option.value != null)
            .map((option) => (
              <SelectItem key={option.value.toString()}>
                {option.label}
              </SelectItem>
            )) || []}
        </Select>
      );
    }
    case "checkbox":
      return (
        <Checkbox
          size="sm"
          isSelected={value as boolean}
          onValueChange={handleCheckboxChange}
          className="text-lg"
        >
          {label}
        </Checkbox>
      );
    case "date":
      return (
        <DatePicker
          showMonthAndYearPickers
          size="sm"
          label={label}
          granularity="minute"
          value={getDateValue(value as string | null)}
          onChange={handleDateChange}
          className="w-full"
          minValue={today(getLocalTimeZone())}
        />
      );
    default:
      return null;
  }
};

export default DynamicFields;
