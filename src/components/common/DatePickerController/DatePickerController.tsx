/* eslint-disable @typescript-eslint/no-explicit-any */

import { type Control, Controller } from "react-hook-form";
import DatePicker, { type DatePickerProps, registerLocale } from "react-datepicker";
import { ar } from "date-fns/locale/ar";
registerLocale("ar", ar);
import "react-datepicker/dist/react-datepicker.css";
import "./DatePickerController.scss";

interface Props extends Omit<DatePickerProps, "onChange"> {
  name: string;
  control: Control<any>;
  rules?: any;
  required?: boolean;
  minDate?: Date;
  maxDate?: Date;
  placeholder?: string;
  hasDefault?: boolean;
  defaultValue?: any;
}

const DatePickerController: React.FC<Props> = ({
  name,
  control,
  rules,
  required,
  minDate,
  maxDate,
  hasDefault = true,
  dateFormat = "dd-MM-yyyy",
  defaultValue = undefined,
  disabled,
  ...props
}) => {

  const initialValue = hasDefault
    ? new Date()
    : defaultValue
      ? new Date(defaultValue)
      : null;

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={initialValue}
      rules={{
        ...rules,
        validate: {
          ...(required
            ? {
              required: (value: string | number | Date | null) => {
                if (value instanceof Date) return true;
                if (typeof value === "string" && value.trim() !== "")
                  return true;
                if (value) return true;
                return "This field is required";
              },
            }
            : {}),
          ...rules?.validate,
        },
      }}
      render={({ field, fieldState: { error } }) => {
        return (
          <>
            <div
              className={`date-picker-container ${error ? "is-invalid" : ""}`}
            >
              <DatePicker
                {...field}
                {...(props as any)}
                disabled={disabled}
                selected={field.value ? new Date(field.value) : null}
                onChange={(date: Date) => {
                  field.onChange(date);
                }}
                maxDate={maxDate ? new Date(maxDate) : undefined}
                minDate={minDate ? new Date(minDate) : undefined}
                dateFormat={dateFormat}
                defaultValue={defaultValue}
                wrapperClassName="dp-wrapper"
                placeholderText={(props as any).placeholder}
              />
            </div>
            {error?.message && (
              <p className="invalid-feedback d-block">{error.message}</p>
            )}
          </>
        );
      }}
    />
  );
};

export default DatePickerController;