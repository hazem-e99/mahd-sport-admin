import type { UseFormSetError } from "react-hook-form";

export const handleApiValidationErrors = (
    setError: UseFormSetError<any>,
    apiErrors: any[],
    fieldMapping: Record<string, string>,
) => {
    apiErrors.forEach((apiError: any) => {
        const { code, description } = apiError;
        const fieldName = fieldMapping[code];

        if (fieldName) {
            // Set error for the specific field
            setError(fieldName, {
                type: "manual",
                message: description,
            });
        }
    });
};
