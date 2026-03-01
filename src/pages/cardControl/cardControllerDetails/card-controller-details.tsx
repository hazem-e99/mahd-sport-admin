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
  const {
    register, handleSubmit, reset,
    formState: { errors }, control, setValue, watch, trigger, clearErrors
  } = useForm<PlayerCard>();

  const [activeTab, setActiveTab] = useState<string>("edit_img");
  const [isSaving, setIsSaving] = useState(false);

  // Upload modal states
  const [showPhotoUpload, setShowPhotoUpload]   = useState(false);
  const [showGifUpload,   setShowGifUpload]     = useState(false);
  const [photoFileName,   setPhotoFileName]     = useState("");
  const [gifFileName,     setGifFileName]       = useState("");

  const photoPath = watch("photoUrl");
  const gifUrl    = watch("kpi.skillVideoUrl");
  const order     = watch("orderIndex");
  const showUser  = watch("status");
  const selectedCountry = watch("country");

  useEffect(() => {
    if (employee) {
      reset(employee);
      if (employee.photoUrl) {
        const parts = employee.photoUrl.split('/');
        setPhotoFileName(parts[parts.length - 1] || '');
      }
      if (employee.kpi?.skillVideoUrl) {
        const parts = employee.kpi.skillVideoUrl.split('/');
        setGifFileName(parts[parts.length - 1] || '');
      }
    }
  }, [employee, reset]);

  useEffect(() => {
    if (selectedCountry) {
      const countryEntry = COUNTRIES.find(c => c.label === selectedCountry);
      if (countryEntry) setValue("countryCode", countryEntry.value);
    }
  }, [selectedCountry, setValue]);

  const handleClose = useCallback(() => setShow(false), [setShow]);

  const onSubmit = async (data: PlayerCard) => {
    setIsSaving(true);
    try {
      if (onEmployeeUpdated) onEmployeeUpdated(data);
      toast.success(getValue("changes_saved_successfully"));
      setShow(false);
    } catch {
      toast.error(getValue("unable_to_save_changes") || "Unable to save changes.");
    } finally {
      setIsSaving(false);
    }
  };

  // Shared setter for UploadModal
  const makeSetValue = (fieldName: keyof PlayerCard | string) => (name: string, value: any) => {
    setValue(name as any, value);
  };

  return (
    <div>
      <Modal show={show} className="modal-employee-details add-player-modal" backdrop="static" onHide={handleClose} size="lg">
        <Modal.Header closeButton className="modal_header">
          <Modal.Title>
            <div className="header_modal team-modla">
              <SvgUsercardicon />
              <h3>{getValue("player_details")}</h3>
            </div>
          </Modal.Title>
        </Modal.Header>

        <Form onSubmit={handleSubmit(onSubmit)}>
          <Modal.Body className="modal_body-employee-details" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
            <Tabs
              key={employee?.id || "new"}
              activeKey={activeTab}
              onSelect={(k) => setActiveTab(k || "edit_img")}
              className="mb-3 custom-edit-tabs"
            >

              {/* ══════════════ TAB 1 — Image & Settings ══════════════ */}
              <Tab eventKey="edit_img" title={getValue("edit_img") || "Image & Settings"}>

                {/* Player Card Preview */}
                <div className="cardt mx-auto mb-4">
                  <div className="cardt-header">
                    {photoPath ? (
                      <img src={photoPath} alt={employee?.fullNameEn || "Player"} className="card-img" />
                    ) : (
                      <section className="upload-card" aria-label="Image uploader">
                        <p className="title">{getValue("no_image_chosen")}</p>
                        <button type="button" className="btn" onClick={() => setShowPhotoUpload(true)} disabled={isSaving}>
                          {getValue("upload_player_img") || "Upload Image"}
                        </button>
                      </section>
                    )}
                    <div className="bottom-line" />
                  </div>
                  <div className="card-footer">
                    <div className="footer-version-1">
                      <h3>{language === 'ar' ? employee?.fullNameAr : employee?.fullNameEn}</h3>
                      <p>{employee?.position || getValue("no_title")}</p>
                      <div className="bottom-line2" />
                      <span>{employee?.sport || getValue("no_department")}</span>
                    </div>
                  </div>
                </div>

                {/* Change Photo Button */}
                <div className="change-image-section text-center mb-4">
                  <button
                    type="button"
                    className="btn btn-outline-primary"
                    onClick={() => setShowPhotoUpload(true)}
                    disabled={isSaving}
                  >
                    {getValue("change_image") || "Change Image"}
                  </button>
                </div>

                {/* Order + Status */}
                <div className="card-for-upload d-flex justify-content-center gap-4 align-items-center">
                  <div className="d-flex align-items-center gap-2">
                    <label>{getValue("Display_Order")}</label>
                    <NumberStepper
                      value={order || 0}
                      onChange={(val) => setValue("orderIndex", val, { shouldDirty: true })}
                      min={1} max={10000} step={1}
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

              {/* ══════════════ TAB 2 — Details & KPIs ══════════════ */}
              <Tab eventKey="edit_details" title={getValue("edit_details") || "Edit Details"}>

                {/* ── Names ───────────────────────────────── */}
                <Row className="g-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>{getValue("player_name")} (English)</Form.Label>
                      <Form.Control type="text" placeholder="Enter name in English"
                        {...register("fullNameEn", { required: true })} isInvalid={!!errors.fullNameEn} />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>{getValue("player_name")} (Arabic)</Form.Label>
                      <Form.Control type="text" placeholder="ادخل الاسم بالعربية"
                        {...register("fullNameAr", { required: true })} isInvalid={!!errors.fullNameAr} />
                    </Form.Group>
                  </Col>
                </Row>

                {/* ── Sport / Number / Position ───────────────── */}
                <Row className="g-3 mt-1">
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>{getValue("sport")}</Form.Label>
                      <SelectController
                        control={control} name="sport" required
                        options={[
                          { value: "football",  label: getValue("football")  || "Football" },
                          { value: "athletics", label: getValue("athletics") || "Athletics" },
                          { value: "judo",      label: getValue("judo")      || "Judo" },
                          { value: "tennis",    label: getValue("tennis")    || "Tennis" },
                          { value: "taekwondo", label: getValue("taekwondo") || "Taekwondo" },
                          { value: "swimming",  label: getValue("swimming")  || "Swimming" },
                        ]}
                        getOptionLabel={(o: any) => o.label}
                        getOptionValue={(o: any) => o.value}
                        placeholder={getValue("select")}
                        menuPlacement="bottom"
                        menuPosition="fixed"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>{getValue("player_number")}</Form.Label>
                      <Form.Control type="text"
                        {...register("playerNumber", { required: true })} isInvalid={!!errors.playerNumber} />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>{getValue("position")}</Form.Label>
                      <Form.Control type="text"
                        {...register("position", { required: true })} isInvalid={!!errors.position} />
                    </Form.Group>
                  </Col>
                </Row>

                {/* ── Country / Performance ──────────────────── */}
                <Row className="g-3 mt-1">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>{getValue("country")}</Form.Label>
                      <SelectController
                        control={control} name="country" options={COUNTRIES} required
                        getOptionLabel={(option: any) => option.label}
                        getOptionValue={(option: any) => option.label}
                        placeholder={getValue("select")}
                        menuPlacement="bottom"
                        menuPosition="fixed"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>{getValue("performance")}</Form.Label>
                      <SelectController
                        control={control} name="performance" required
                        options={[
                          { value: "diamond", label: getValue("diamond") || "Diamond" },
                          { value: "gold",    label: getValue("gold")    || "Gold" },
                          { value: "silver",  label: getValue("silver")  || "Silver" },
                        ]}
                        getOptionLabel={(o: any) => o.label}
                        getOptionValue={(o: any) => o.value}
                        placeholder={getValue("select")}
                        menuPlacement="bottom"
                        menuPosition="fixed"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <hr className="section-divider mt-4" />
                <span className="kpi-section-title">KPIs (%)</span>

                {/* ── KPIs ───────────────────────────────────── */}
                <Row className="g-3 mt-1">
                  {[
                    { key: "kpi.cognition",  label: getValue("cognition") },
                    { key: "kpi.technical",  label: getValue("technical") },
                    { key: "kpi.physical",   label: getValue("physical") },
                    { key: "kpi.psychology", label: getValue("psychology") },
                    { key: "kpi.medical",    label: getValue("medical") },
                  ].map(({ key, label }) => (
                    <Col md={4} key={key}>
                      <Form.Group>
                        <Form.Label>{label}</Form.Label>
                        <Form.Control type="number" min={0} max={100}
                          {...register(key as any, { valueAsNumber: true, min: 0, max: 100 })} />
                      </Form.Group>
                    </Col>
                  ))}
                </Row>

                {/* ── Skill GIF ─────────────────────────────── */}
                <Row className="mt-3">
                  <Col md={12}>
                    <Form.Group>
                      <Form.Label>{getValue("skill_gif") || "Skill GIF"}</Form.Label>
                      <div className="gif-upload-field">
                        <div className={`gif-upload-trigger ${gifUrl ? 'has-file' : ''}`}
                          onClick={() => setShowGifUpload(true)}>
                          {gifUrl ? (
                            <div className="gif-preview-wrapper">
                              <img src={gifUrl} alt="Skill GIF" className="gif-preview-thumb" />
                              <div className="gif-preview-info">
                                <span className="gif-file-name">{gifFileName || getValue("skill_gif")}</span>
                                <span className="gif-change-hint">{getValue("click_to_change") || "Click to change"}</span>
                              </div>
                            </div>
                          ) : (
                            <div className="gif-upload-placeholder">
                              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                                <path d="M12 16V8M12 8L9 11M12 8L15 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M3 15V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                              <span className="gif-placeholder-text">{getValue("upload_gif") || "Upload Skill GIF"}</span>
                              <span className="gif-placeholder-hint">GIF</span>
                            </div>
                          )}
                        </div>
                        {gifUrl && (
                          <button type="button" className="gif-remove-btn"
                            onClick={(e) => { e.stopPropagation(); setValue("kpi.skillVideoUrl", ""); setGifFileName(""); }}
                            title={getValue("remove") || "Remove"}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            </svg>
                          </button>
                        )}
                      </div>
                      <input type="hidden" {...register("kpi.skillVideoUrl")} />
                    </Form.Group>
                  </Col>
                </Row>

              </Tab>
            </Tabs>
          </Modal.Body>

          <Modal.Footer className="btns_footer">
            <button type="button" className="cancel_btn btn btn-primary" onClick={handleClose} disabled={isSaving}>
              {getValue("cancel")}
            </button>
            <button type="submit" className="save_btn btn btn-primary" disabled={isSaving}>
              {isSaving ? (getValue("saving") || "Saving...") : (getValue("save") || "Save")}
            </button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Photo Upload Modal */}
      <UploadModal
        show={showPhotoUpload}
        handleClose={() => setShowPhotoUpload(false)}
        setFileName={setPhotoFileName}
        setValue={makeSetValue("photoUrl")}
        clearErrors={clearErrors as any}
        trigger={trigger as any}
        name="photoUrl"
        accept="image/*"
      />

      {/* GIF Upload Modal */}
      <UploadModal
        show={showGifUpload}
        handleClose={() => setShowGifUpload(false)}
        setFileName={setGifFileName}
        setValue={makeSetValue("kpi.skillVideoUrl")}
        clearErrors={clearErrors as any}
        trigger={trigger as any}
        name="kpi.skillVideoUrl"
        accept="image/gif"
      />
    </div>
  );
};

export default CardDetails;
