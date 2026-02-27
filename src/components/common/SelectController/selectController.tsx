/* eslint-disable @typescript-eslint/no-explicit-any */
import { useLanguage } from "@/context/languageContext";
import { Controller, type Control } from "react-hook-form";
import Select, { type Props as SelectProps } from "react-select";

interface SelectControllerProps extends SelectProps {
  control: Control<any>;
  name: string;
  options: any[];
  rules?: any;
  required?: boolean;
  disabled?: boolean;
  selectAll?: boolean;
}

export default function SelectController({
  control,
  options,
  name,
  rules,
  required,
  disabled,
  selectAll = false,
  ...props
}: SelectControllerProps) {
  const { getValue } = useLanguage();
  return (
    <Controller
      name={name}
      control={control}
      rules={{
        ...rules,
        validate: {
          ...(required
            ? {
              required: (value: any) => {
                if (props.isMulti) {
                  return Array.isArray(value) && value.length > 0
                    ? true
                    : getValue("is_required");
                }
                return value !== undefined && value !== "" && value !== null
                  ? true
                  : getValue("is_required");
              },
            }
            : {}),
          ...rules?.validate,
        },
      }}
      render={({ field, fieldState: { error } }) => {
        console.log("🚀 ~ field:", field)
        // Handle Select All logic for multi-select
        const isMultiWithSelectAll = props.isMulti && selectAll;
        
        // Create options with Select All option if enabled
        const enhancedOptions = isMultiWithSelectAll
          ? (() => {
              const selectedCount = Array.isArray(field.value) ? field.value.length : 0;
              const allSelected = selectedCount === options.length;
              
              const selectAllLabel = allSelected 
                ? getValue("deselect_all") || "Deselect All"
                : getValue("select_all") || "Select All";
                
              // Create select all option with same structure as regular options
              const selectAllOption = {
                value: "__SELECT_ALL__",
                label: selectAllLabel,
                isSelectAll: true,
              };
              
              return [selectAllOption, ...options];
            })()
          : options;

        const selectedValue = props.isMulti
          ? enhancedOptions
            ?.filter((option) => {
              if (option.value === "__SELECT_ALL__") return false;
              const optionValue = props.getOptionValue?.(option);
              const hasValue = field.value && Array.isArray(field.value) && field.value.includes(optionValue);
              return hasValue;
            })
          : enhancedOptions
            ?.find((c) => String(props.getOptionValue?.(c)) === String(field.value));

        return (
          <div className="select2-isMulti">
            <Select
              {...field}
              className={`react-select-container ${props.className} ${error?.message ? "is-invalid" : ""}`}
              classNamePrefix="react-select"
              isMulti={props.isMulti}
              value={selectedValue}
              placeholder="Select users/groups"
              options={enhancedOptions}
              closeMenuOnSelect={isMultiWithSelectAll ? false : props.closeMenuOnSelect}
              getOptionLabel={isMultiWithSelectAll ? 
                (option: any) => option.value === "__SELECT_ALL__" ? option.label : (props.getOptionLabel ? props.getOptionLabel(option) : option.label)
                : props.getOptionLabel
              }
              getOptionValue={isMultiWithSelectAll ? 
                (option: any) => option.value === "__SELECT_ALL__" ? "__SELECT_ALL__" : (props.getOptionValue ? props.getOptionValue(option) : option.value)
                : props.getOptionValue
              }
              onChange={(selected: any) => {
                // Handle Select All functionality
                if (isMultiWithSelectAll && Array.isArray(selected)) {
                  const selectAllClicked = selected.some(option => option.value === "__SELECT_ALL__");
                  
                  if (selectAllClicked) {
                    const currentValues = Array.isArray(field.value) ? field.value : [];
                    const allOptionValues = props.getOptionValue 
                      ? options.map(props.getOptionValue).filter(Boolean)
                      : options.map(option => option.value).filter(Boolean);
                    const allSelected = currentValues.length === allOptionValues.length;
                    
                    if (allSelected) {
                      // Deselect all
                      field.onChange([]);
                    } else {
                      // Select all
                      field.onChange(allOptionValues);
                    }
                    return;
                  }
                }

                const value = selected
                  ? props.isMulti
                    ? selected
                        .filter((option: any) => option.value !== "__SELECT_ALL__")
                        .map(props.getOptionValue)
                    : props.getOptionValue?.(selected)
                  : props.isMulti
                    ? []
                    : null;

                field.onChange(value);
              }}
              menuPlacement="auto"
              {...props}
              isDisabled={disabled}
            />
            {error?.message && (
              <p className="invalid-feedback d-block">
                {error?.message}
              </p>
            )}
          </div>
        )
      }}
    />
  );
}
