import { useLanguage } from "@/context/languageContext";
import UploadModal from "@/pages/cardControl/pages/UploadModal/UploadModal";
import { useState } from "react";
import { Form } from "react-bootstrap";
import { useWatch, type Control, type FieldErrors, type UseFormClearErrors, type UseFormSetValue, type UseFormTrigger } from "react-hook-form";

interface ImageUploadModalProps {
  name: string;
  control: Control<any>;
  errors: FieldErrors<any>;
  setValue: UseFormSetValue<any>;
  clearErrors: UseFormClearErrors<any>;
  trigger: UseFormTrigger<any>;
  label?: string;
  disabled?: boolean;
}

const ImageUploadModal = ({
  name,
  control,
  errors,
  setValue,
  clearErrors,
  trigger,
  label,
  disabled = false,
}: ImageUploadModalProps) => {
  const [showUploadModal, setShowUploadModal] = useState(false);

  const { getValue } = useLanguage();

  const icon = useWatch({
    control,
    name,
  });

  return (
    <>
      <Form.Group>
        <Form.Label>{label}</Form.Label>

        <button
          className={`file-upload-wrapper w-full ${disabled ? "!cursor-default" : ""
            }`}
          type="button"
          onClick={() => !disabled && setShowUploadModal(true)}
        >
          <div className="text-end modal_upload">
            <div className="addTpye add_type_modal">
              {icon ? getValue("change_icon") : getValue("upload_modal")}
            </div>
          </div>
          {icon ? (
            <img src={icon} alt="Uploaded" width={30} height={30} />
          ) : (
            <span className="file-name ms-2">{getValue("no_file_chosen")}</span>
          )}
        </button>
        {errors[name] && (
          <div className="text-danger small mt-1">
            {errors[name].message as string}
          </div>
        )}
      </Form.Group>

      <UploadModal
        show={showUploadModal}
        setFileName={() => { }}
        handleClose={() => setShowUploadModal(false)}
        setValue={setValue as any}
        clearErrors={clearErrors as any}
        trigger={trigger as any}
        name={name}
      />
    </>
  );
};

export default ImageUploadModal;
