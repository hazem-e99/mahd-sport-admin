import { Button, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
// import ImageUpload from "@/components/common/ImageUpload/ImageUpload";
import { toast } from "react-toastify";
import ImageUploadModal from "../ImageUploadModal/ImageUploadModal";

export const ChooseYourBackground = ({ show, handleClose, onSuccess, setBackgrounds, backgrounds }: any) => {
  const { setValue, trigger, reset, handleSubmit, control, clearErrors, formState: { errors } } = useForm();
  const [nameEn, setNameEn] = useState("");
  const [nameAr, setNameAr] = useState("");

  useEffect(() => {
    if (!show) {
      reset();
      setNameEn("");
      setNameAr("");
    }
  }, [show, reset]);

  const handleSave = async (data: any) => {
    if (!data?.imagePath) {
      toast.error("Please upload an image first.");
      return;
    }

    // تحقق إن الاسم موجود أيضًا
    if (!nameEn.trim() || !nameAr.trim()) {
      toast.error("Please fill all required fields.");
      return;
    }

    const newBackground = {
      name: nameEn,
      nameLa: nameAr,
      path: data.imagePath,
      isDefault: false,
    };
    const all = [...backgrounds, newBackground];
    console.log(all);

    if (!newBackground.path) return; // احتياط إضافي

    setBackgrounds(all);
    handleClose();
    onSuccess(newBackground);
  };

  console.log(backgrounds);

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>+ Add Background</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <input
          placeholder="Background Name (English)"
          className="form-control mb-3"
          value={nameEn}
          onChange={(e) => setNameEn(e.target.value)}
        />
        <input
          placeholder="Background Name (Arabic)"
          className="form-control mb-3"
          value={nameAr}
          onChange={(e) => setNameAr(e.target.value)}
        />
        
        <ImageUploadModal
          clearErrors={clearErrors}
          control={control}
          errors={errors}
          name="imagePath"
          setValue={setValue}
          trigger={trigger}
        />

      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Cancel</Button>
        <Button variant="primary" onClick={handleSubmit(handleSave)}>Save</Button>
      </Modal.Footer>

    </Modal>
  );
};
