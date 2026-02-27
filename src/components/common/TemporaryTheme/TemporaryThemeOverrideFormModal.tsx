import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { TemporaryThemeOverrideService } from "@/api/services/TemporaryThemeOverride.Service";
import { useLanguage } from "@/context/languageContext";
import ImageUploadModal from "../ImageUploadModal/ImageUploadModal";

const TemporaryThemeOverrideFormModal = ({ show, onClose, onSuccess, initialData }: any) => {
  const { register, handleSubmit, reset, setValue, control, trigger, clearErrors, formState: { errors } } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const { getValue } = useLanguage();

  const formatDateForInput = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const offset = date.getTimezoneOffset();
    const adjustedDate = new Date(date.getTime() - (offset * 60 * 1000));
    return adjustedDate.toISOString().slice(0, 16);
  };

  useEffect(() => {
    if (initialData) {
      reset({
        ...initialData,
        startDateTime: formatDateForInput(initialData.startDateTime),
        endDateTime: formatDateForInput(initialData.endDateTime)
      });
    } else {
      reset({});
    }
  }, [initialData, reset]);

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    const start = new Date(data.startDateTime);
    const end = new Date(data.endDateTime);

    if (start >= end) {
      alert("Start date must be before end date.");
      setIsLoading(false);
      return;
    }

    const payload: any = {
      holidayName: data.holidayName,
      startDateTime: data.startDateTime, // Send local time string directly
      endDateTime: data.endDateTime,     // Send local time string directly
      colorHexCode: data.colorHexCode,
      imagePath: data.imagePath
    };

    if (initialData?.id) {
      payload.id = initialData.id;
      await TemporaryThemeOverrideService.updateOverride(payload);
    } else {
      await TemporaryThemeOverrideService.createOverride(payload);
    }

    onSuccess();
    onClose();
  };


  return (
    <Modal show={show} onHide={onClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{initialData ? getValue('edit') : getValue('add_new')} {getValue('Temporary_Theme_Override')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group>
            <Form.Label> {getValue("Holiday_Name")}</Form.Label>
            <Form.Control
              {...register("holidayName", { required: "Holiday name is required" })}
              isInvalid={!!errors.holidayName}
            />
            <Form.Control.Feedback type="invalid">{errors.holidayName?.message?.toString()}</Form.Control.Feedback>
          </Form.Group>

          <Row className="mt-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>{getValue('Start_Date_Time')}</Form.Label>
                <Form.Control
                  type="datetime-local"
                  {...register("startDateTime", { required: "Start date is required" })}
                  isInvalid={!!errors.startDateTime}
                />
                <Form.Control.Feedback type="invalid">{errors.startDateTime?.message?.toString()}</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>{getValue('End_Date_Time')}</Form.Label>
                <Form.Control
                  type="datetime-local"
                  {...register("endDateTime", { required: "End date is required" })}
                  isInvalid={!!errors.endDateTime}
                />
                <Form.Control.Feedback type="invalid">{errors.endDateTime?.message?.toString()}</Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mt-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label> {getValue('Primary_Color')}</Form.Label>
                <Form.Control
                  type="color"
                  {...register("colorHexCode", { required: "Color is required" })}
                  isInvalid={!!errors.colorHexCode}
                />
                <Form.Control.Feedback type="invalid">{errors.colorHexCode?.message?.toString()}</Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={6}>
              <ImageUploadModal
                clearErrors={clearErrors}
                control={control}
                errors={errors}
                name="imagePath"
                setValue={setValue}
                trigger={trigger}
                label={getValue('Background_Image')}
              />

            </Col>
          </Row>

          <div className="mt-4 gap-2 d-flex justify-content-end">
            <Button variant="danger" onClick={onClose}> {getValue('cancel')}</Button>
            <Button type="submit" className="ms-2" variant="primary" disabled={isLoading}>
              {isLoading ? "Saving..." : getValue('button.save')}
            </Button>
          </div>
        </Form>
      </Modal.Body>

    </Modal>
  );
};

export default TemporaryThemeOverrideFormModal;
