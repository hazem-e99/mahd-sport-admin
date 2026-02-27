/* eslint-disable @typescript-eslint/no-explicit-any */
import { UploadFile } from "@/api/services/UploadFile";
import { useLanguage } from "@/context/languageContext";
import { useRef, useState, type HTMLAttributes } from "react";
import { Spinner } from "react-bootstrap";
import Button from "react-bootstrap/esm/Button";
import {
  Controller,
  type Control,
  type UseFormSetValue,
  type UseFormTrigger,
} from "react-hook-form";
import { toast } from "react-toastify";

interface ImageUploadProps extends HTMLAttributes<HTMLInputElement> {
  control: Control<any>;
  name: string;
  rules?: any;
  required?: boolean;
  setValue: UseFormSetValue<any>;
  trigger: UseFormTrigger<any>;
  size?: number;
}

export default function ImageUpload({
  control,
  name,
  rules,
  required,
  setValue,
  trigger,
  size,
  ...props
}: ImageUploadProps) {
  const { getValue } = useLanguage();

  // State to store the selected file name
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isUploading, setIsUploading] = useState(false);

  // validate image dimensions
  const validateImageDimensions = (file: File, size: number): Promise<boolean> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const isValid = img.width === size && img.height === size;
        URL.revokeObjectURL(img.src); // Clean up the object URL
        resolve(isValid);
      };
      img.onerror = () => {
        URL.revokeObjectURL(img.src); // Clean up the object URL
        resolve(false);
      };
      img.src = URL.createObjectURL(file);

    });
  };

  //  handle file button click
  const handleFileButtonClick = () => {
    fileInputRef.current?.click();
  };

  // handle file input change
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    try {
      setIsUploading(true);
      if (file) {
        if (size) {
          // Validate image dimensions
          const isValidDimensions = await validateImageDimensions(file, size);
          if (!isValidDimensions) {
            toast.error(getValue("image_dimensions_error", { size: size.toString() }));
            setIsUploading(false);
            return;
          }
        }

        const res = await UploadFile.uploadFile(file);

        setFileName(file ? file.name : "");
        setValue(name, res.data?.path, { shouldValidate: true });
        trigger(name);
      } else {
        setFileName("");
        trigger(name);
      }

    } catch (error: any) {
      console.log(error);
      toast.error(error?.response?.data?.errors[0]?.description || error?.message || "Something went wrong");
    } finally {
      setIsUploading(false);
    }

  };

  return (
    <Controller
      control={control}
      name={name}
      rules={{
        ...rules,
        validate: {
          ...(required
            ? {
              required: (value: Document[] | Document | undefined) => {
                // Default validation for non-preUpload case
                if (!value) {
                  return `${getValue("is_required")}`;
                }
                if (Array.isArray(value) && value.length === 0) {
                  return `${getValue("is_required")}`;
                }
                // if (!Array.isArray(value) && !value.fileContent) {
                //   return "This field is required";
                // }
                return true;
              },
            }
            : {}),
          ...rules?.validate,
        },
      }}
      render={({ field, fieldState: { error } }) => {

        if (field.value) {
          return (
            <div className="d-flex align-items-center gap-2">
              <img src={field.value} alt="Uploaded" width={size || 50} height={size || 50} />
              <Button variant="outline-secondary" className="file-upload-btn" onClick={() => setValue(name, '')}>
                {getValue("change")}
              </Button>
            </div>
          )
        }

        return (
          <>
            <div className="file-upload-wrapper">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="d-none"
                accept="image/*"
                {...props}
              />
              <Button
                variant="outline-secondary"
                className="file-upload-btn"
                onClick={handleFileButtonClick}
                disabled={isUploading}
              >
                {isUploading ? getValue("uploading") : getValue("choose_file")}
                {isUploading && <Spinner animation="border" size="sm" className="mx-2" />}
              </Button>
              <span className="file-name ms-2">{fileName || getValue("no_file_chosen")}</span>
            </div>
            {error?.message && (
              <p className="invalid-feedback d-block">{error?.message}</p>
            )}
          </>
        )
      }}
    />
  );
}
