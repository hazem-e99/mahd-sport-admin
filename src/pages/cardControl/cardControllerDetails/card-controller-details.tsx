import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Modal, Tabs, Tab, Form, Row, Col } from "react-bootstrap";
import { toast } from "react-toastify";
import SvgUsercardicon from "../components/icons/usercard-icon";
import UploadModal from "../pages/UploadModal/UploadModal";
import NumberStepper from "../numberStepper/NumberStepper";
import ToggleSwitch from "../toggleSwitch/ToggleSwitch";
import { useLanguage } from "../context/languageContext";
import type { PlayerCard } from "../types/card-control.type";
import SelectController from "@/components/common/SelectController/selectController";
import { COUNTRIES } from "@/utils/countries";
import './card-controller-details.scss';

interface Props {
  show: boolean;
  setShow: (show: boolean) => void;
  employee?: PlayerCard | null;
  onEmployeeUpdated?: (updatedPlayer: PlayerCard) => void;
}

const CardDetails = ({ show, setShow, employee, onEmployeeUpdated }: Props) => {
  const { language, getValue } = useLanguage();
  const { register, handleSubmit, reset, formState: { errors }, control, setValue, watch, trigger, clearErrors } = useForm<PlayerCard>();

  const [activeTab, setActiveTab] = useState<string>("edit_img");
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);

  const selectedCountry = watch("country");
  const photoPath = watch("photoUrl");
  const order = watch("orderIndex");
  const showUser = watch("status");

  useEffect(() => {
    if (employee) {
      reset(employee);
    }
  }, [employee, reset]);

  useEffect(() => {
    if (selectedCountry) {
      const countryEntry = COUNTRIES.find(c => c.label === selectedCountry);
      if (countryEntry) {
        setValue("countryCode", countryEntry.value);
      }
    }
  }, [selectedCountry, setValue]);

  const handleUploadClick = useCallback(() => {
    setShowUploadModal(true);
  }, []);

  const handleUploadModalClose = useCallback(() => {
    setShowUploadModal(false);
  }, []);

  const handleFileSelected = useCallback((filePath: string) => {
    setValue("photoUrl", filePath, { shouldDirty: true });
    toast.success(getValue("image_uploaded_successfully") || "تم رفع الصورة بنجاح");
  }, [getValue, setValue]);

  const customSetValue = useCallback((name: string, value: any) => {
    if (name === 'photoPath') {
      handleFileSelected(value);
    }
    setValue(name as any, value);
  }, [setValue, handleFileSelected]);

  const handleClose = useCallback(() => {
    setShow(false);
  }, [setShow]);

  const onSubmit = async (data: PlayerCard) => {
    setIsSaving(true);
    try {
      // In a real app, we'd call the API here.
      // For now, we just pass the data back to the parent.
      if (onEmployeeUpdated) {
        onEmployeeUpdated(data);
      }
      toast.success(getValue("changes_saved_successfully") || "تم حفظ التغييرات بنجاح");
      setShow(false);
    } catch (error: any) {
      const errorMessage = getValue("unable_to_save_changes") || "تعذر حفظ التغييرات. يرجى المحاولة لاحقًا.";
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <Modal show={show} className="modal-employee-details" backdrop="static" onHide={handleClose} size="lg">
        <Modal.Header closeButton className="modal_header">
          <Modal.Title>
            <div className="header_modal team-modla">
              <SvgUsercardicon />
              <h3>{getValue("player_details") || "Player Details"}</h3>
            </div>
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Modal.Body className="modal_body-employee-details" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
            <Tabs
              activeKey={activeTab}
              onSelect={(k) => setActiveTab(k || "edit_img")}
              className="mb-3 custom-edit-tabs"
            >
              <Tab eventKey="edit_img" title={getValue("edit_img") || "Edit Image"}>
                <div className="cardt mx-auto mb-4">
                  <div className="cardt-header">
                    {photoPath ? (
                      <img
                        src={photoPath}
                        alt={employee?.fullNameEn || "Player"}
                        className="card-img"
                      />
                    ) : (
                      <section className="upload-card" aria-label="Image uploader">
                        <p className="title">{getValue("no_image_chosen") || "No Image Chosen"}</p>
                        <button
                          type="button"
                          onClick={handleUploadClick}
                          className={`btn !cursor-pointer ${isSaving ? 'disabled' : ''}`}
                          disabled={isSaving}
                        >
                          {getValue("upload_image") || "Upload Image"}
                        </button>
                      </section>
                    )}
                    <div className="bottom-line"></div>
                  </div>
                  <div className="card-footer">
                    <div className="footer-version-1">
                      <h3>{language === 'ar' ? employee?.fullNameAr : employee?.fullNameEn}</h3>
                      <p>{employee?.position || getValue("no_title")}</p>
                      <div className="bottom-line2"></div>
                      <span>{employee?.sport || getValue("no_department")}</span>
                    </div>
                  </div>
                </div>

                <div className="change-image-section text-center mb-4">
                  <button
                    type="button"
                    onClick={handleUploadClick}
                    disabled={isSaving}
                    className="btn btn-outline-primary"
                  >
                    {getValue("change_image") || "تغيير الصورة"}
                  </button>
                </div>

                <div className="card-for-upload d-flex justify-content-center gap-4 align-items-center">
                  <div className="d-flex align-items-center gap-2">
                    <label>{getValue("Display_Order")}</label>
                    <NumberStepper
                      value={order || 0}
                      onChange={(val) => setValue("orderIndex", val, { shouldDirty: true })}
                      min={1}
                      max={10000}
                      step={1}
                    />
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <label>{getValue("status")}</label>
                    <ToggleSwitch
                      checked={showUser || false}
                      onChange={(val) => setValue("status", val, { shouldDirty: true })}
                    />
                  </div>
                </div>
              </Tab>

              <Tab eventKey="edit_details" title={getValue("edit_details") || "Edit Details"}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>{getValue("player_name")} (English)</Form.Label>
                      <Form.Control
                        type="text"
                        {...register("fullNameEn", { required: true })}
                        isInvalid={!!errors.fullNameEn}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>{getValue("player_name")} (Arabic)</Form.Label>
                      <Form.Control
                        type="text"
                        {...register("fullNameAr", { required: true })}
                        isInvalid={!!errors.fullNameAr}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>{getValue("sport")}</Form.Label>
                      <Form.Select {...register("sport", { required: true })} isInvalid={!!errors.sport}>
                        <option value="">{getValue("select")}</option>
                        <option value="football">{getValue("football")}</option>
                        <option value="athletics">{getValue("athletics")}</option>
                        <option value="judo">{getValue("judo")}</option>
                        <option value="tennis">{getValue("tennis")}</option>
                        <option value="taekwondo">{getValue("taekwondo")}</option>
                        <option value="swimming">{getValue("swimming")}</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>{getValue("player_number")}</Form.Label>
                      <Form.Control
                        type="text"
                        {...register("playerNumber", { required: true })}
                        isInvalid={!!errors.playerNumber}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>{getValue("position")}</Form.Label>
                      <Form.Control
                        type="text"
                        {...register("position", { required: true })}
                        isInvalid={!!errors.position}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>{getValue("country")}</Form.Label>
                      <SelectController
                        control={control}
                        name="country"
                        options={COUNTRIES}
                        required
                        getOptionLabel={(option: any) => option.label}
                        getOptionValue={(option: any) => option.label}
                        placeholder={getValue("select")}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>{getValue("performance")}</Form.Label>
                      <Form.Select {...register("performance", { required: true })}>
                        <option value="diamond">{getValue("diamond")}</option>
                        <option value="gold">{getValue("gold")}</option>
                        <option value="silver">{getValue("silver")}</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <hr />
                <h5>{getValue("kpis") || "KPIs"}</h5>
                <Row>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>{getValue("cognition")}</Form.Label>
                      <Form.Control type="number" {...register("kpi.cognition", { valueAsNumber: true })} />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>{getValue("technical")}</Form.Label>
                      <Form.Control type="number" {...register("kpi.technical", { valueAsNumber: true })} />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>{getValue("physical")}</Form.Label>
                      <Form.Control type="number" {...register("kpi.physical", { valueAsNumber: true })} />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>{getValue("psychology")}</Form.Label>
                      <Form.Control type="number" {...register("kpi.psychology", { valueAsNumber: true })} />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>{getValue("medical")}</Form.Label>
                      <Form.Control type="number" {...register("kpi.medical", { valueAsNumber: true })} />
                    </Form.Group>
                  </Col>
                  <Col md={12}>
                    <Form.Group className="mb-3">
                      <Form.Label>{getValue("skill_video_url")}</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder={getValue("skill_video_url")}
                        {...register("kpi.skillVideoUrl")}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Tab>
            </Tabs>
          </Modal.Body>
          <Modal.Footer className="btns_footer">
            <button
              type="button"
              className="cancel_btn btn btn-primary"
              onClick={handleClose}
              disabled={isSaving}
            >
              {getValue("cancel") || "Cancel"}
            </button>
            <button
              type="submit"
              className="save_btn btn btn-primary"
              disabled={isSaving}
            >
              {isSaving ? (getValue("saving") || "Saving...") : (getValue("save") || "Save")}
            </button>
          </Modal.Footer>
        </Form>
      </Modal>

      <UploadModal
        show={showUploadModal}
        handleClose={handleUploadModalClose}
        setFileName={() => { }}
        setValue={customSetValue}
        clearErrors={clearErrors as any}
        trigger={trigger as any}
        name="photoPath"
      />
    </div>
  );
};

export default CardDetails;
