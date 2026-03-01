import React, { useEffect, useState } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useLanguage } from '../../context/languageContext';
import type { PlayerCard } from '../../types/card-control.type';
import SelectController from '@/components/common/SelectController/selectController';
import { COUNTRIES } from '@/utils/countries';
import DatePickerController from '@/components/common/DatePickerController/DatePickerController';
import UploadModal from '../../pages/UploadModal/UploadModal';
import './AddPlayerModal.scss';

interface AddPlayerModalProps {
    show: boolean;
    onClose: () => void;
    onSave: (player: PlayerCard) => void;
    player?: PlayerCard | null;
}

const SectionHeader = ({ icon, title }: { icon: React.ReactNode; title: string }) => (
    <div className="form-section-header">
        <span className="form-section-header__icon">{icon}</span>
        <span className="form-section-header__title">{title}</span>
    </div>
);

const AddPlayerModal: React.FC<AddPlayerModalProps> = ({ show, onClose, onSave, player }) => {
    const { getValue } = useLanguage();
    const { register, handleSubmit, reset, formState: { errors }, control, setValue, watch, trigger, clearErrors } = useForm<PlayerCard>();

    const selectedCountry = watch("country");
    const photoUrl = watch("photoUrl");
    const gifUrl = watch("kpi.skillVideoUrl");

    const [showImgUpload, setShowImgUpload] = useState(false);
    const [showGifUpload, setShowGifUpload] = useState(false);
    const [imgFileName, setImgFileName] = useState("");
    const [gifFileName, setGifFileName] = useState("");

    useEffect(() => {
        if (player) {
            reset(player);
            if (player.kpi?.skillVideoUrl) {
                const parts = player.kpi.skillVideoUrl.split('/');
                setGifFileName(parts[parts.length - 1] || '');
            }
            if (player.photoUrl) {
                const parts = player.photoUrl.split('/');
                setImgFileName(parts[parts.length - 1] || '');
            }
        } else {
            reset({
                id: "", fullNameEn: "", fullNameAr: "", sport: "",
                playerNumber: "", position: "", country: "", countryCode: "",
                performance: "silver", photoUrl: "", status: true,
                kpi: { cognition: 0, technical: 0, physical: 0, psychology: 0, medical: 0, skillVideoUrl: "" }
            });
            setImgFileName("");
            setGifFileName("");
        }
    }, [player, reset]);

    useEffect(() => {
        if (selectedCountry) {
            const countryEntry = COUNTRIES.find(c => c.label === selectedCountry);
            if (countryEntry) setValue("countryCode", countryEntry.value);
        }
    }, [selectedCountry, setValue]);

    const onSubmit = (data: PlayerCard) => {
        onSave({
            ...data,
            id: player?.id || Math.random().toString(36).substr(2, 9),
            photoUrl: data.photoUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.fullNameEn}`
        });
        onClose();
    };

    return (
        <>
            <Modal show={show} onHide={onClose} size="lg" centered className="add-player-modal">
                <Modal.Header closeButton>
                    <Modal.Title>{player ? getValue("player_details") : getValue("add_player")}</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <Modal.Body style={{ maxHeight: '72vh', overflowY: 'auto' }}>

                        {/* ═══════════════════════════════════════════
                            SECTION 1 — Personal Info
                        ════════════════════════════════════════════ */}
                        <SectionHeader
                            icon={
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                    <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.8"/>
                                    <path d="M4 20c0-4 3.582-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                                </svg>
                            }
                            title={getValue("personal_info") || "Personal Info"}
                        />

                        {/* Player Image */}
                        <Row className="g-3 mb-1">
                            <Col md={12}>
                                <Form.Group>
                                    <Form.Label>{getValue("player_image") || "Player Image"}</Form.Label>
                                    <div className="img-upload-field">
                                        <div
                                            className={`img-upload-trigger ${photoUrl ? 'has-file' : ''}`}
                                            onClick={() => setShowImgUpload(true)}
                                        >
                                            {photoUrl ? (
                                                <div className="img-preview-wrapper">
                                                    <img src={photoUrl} alt="Player" className="img-preview-thumb" />
                                                    <div className="img-preview-info">
                                                        <span className="img-file-name">{imgFileName || getValue("player_image")}</span>
                                                        <span className="img-change-hint">{getValue("click_to_change") || "Click to change"}</span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="img-upload-placeholder">
                                                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                                                        <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.5"/>
                                                        <path d="M4 20c0-4 3.582-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                                    </svg>
                                                    <span className="img-placeholder-text">{getValue("upload_player_img") || "Upload Player Image"}</span>
                                                    <span className="img-placeholder-hint">IMG</span>
                                                </div>
                                            )}
                                        </div>
                                        {photoUrl && (
                                            <button type="button" className="img-remove-btn"
                                                onClick={(e) => { e.stopPropagation(); setValue("photoUrl", ""); setImgFileName(""); }}
                                                title={getValue("remove") || "Remove"}>
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                                    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                                </svg>
                                            </button>
                                        )}
                                    </div>
                                    <input type="hidden" {...register("photoUrl")} />
                                </Form.Group>
                            </Col>
                        </Row>

                        {/* Names */}
                        <Row className="g-3 mt-1">
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

                        {/* Birth Date + Country */}
                        <Row className="g-3 mt-1">
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>{getValue("birth_date") || "Birth Date"}</Form.Label>
                                    <DatePickerController
                                        name="birthDate"
                                        control={control}
                                        hasDefault={false}
                                        placeholder={getValue("select_date") || "Select date"}
                                        maxDate={new Date()}
                                        dateFormat="dd-MM-yyyy"
                                    />
                                </Form.Group>
                            </Col>
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
                        </Row>

                        {/* ═══════════════════════════════════════════
                            SECTION 2 — Sport Info
                        ════════════════════════════════════════════ */}
                        <SectionHeader
                            icon={
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8"/>
                                    <path d="M12 3c0 0 3 4 3 9s-3 9-3 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                    <path d="M12 3c0 0-3 4-3 9s3 9 3 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                    <path d="M3 12h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                </svg>
                            }
                            title={getValue("sport_info") || "Sport Info"}
                        />

                        {/* Sport + Position + Number */}
                        <Row className="g-3 mt-1">
                            <Col md={4}>
                                <Form.Group>
                                    <Form.Label>{getValue("sport")}</Form.Label>
                                    <SelectController
                                        control={control} name="sport" required
                                        options={[
                                            { value: "football",   label: getValue("football")   || "Football" },
                                            { value: "athletics",  label: getValue("athletics")  || "Athletics" },
                                            { value: "judo",       label: getValue("judo")       || "Judo" },
                                            { value: "tennis",     label: getValue("tennis")     || "Tennis" },
                                            { value: "taekwondo",  label: getValue("taekwondo")  || "Taekwondo" },
                                            { value: "swimming",   label: getValue("swimming")   || "Swimming" },
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
                                    <Form.Label>{getValue("position")}</Form.Label>
                                    <Form.Control type="text"
                                        {...register("position", { required: true })} isInvalid={!!errors.position} />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group>
                                    <Form.Label>{getValue("player_number")}</Form.Label>
                                    <Form.Control type="text"
                                        {...register("playerNumber", { required: true })} isInvalid={!!errors.playerNumber} />
                                </Form.Group>
                            </Col>
                        </Row>

                        {/* Performance + Skill GIF */}
                        <Row className="g-3 mt-1">
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
                            <Col md={6}>
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

                        {/* KPIs */}
                        <div className="form-section-header form-section-header--sub mt-3">
                            <span className="form-section-header__title">KPIs (%)</span>
                        </div>
                        <Row className="g-3 mt-1">
                            {[
                                { key: "kpi.cognition",  label: getValue("cognition")  || "Cognition" },
                                { key: "kpi.technical",  label: getValue("technical")  || "Technical" },
                                { key: "kpi.physical",   label: getValue("physical")   || "Physical" },
                                { key: "kpi.psychology", label: getValue("psychology") || "Psychology" },
                                { key: "kpi.medical",    label: getValue("medical")    || "Medical" },
                            ].map(({ key, label }) => (
                                <Col md={4} key={key}>
                                    <Form.Group>
                                        <Form.Label>{label}</Form.Label>
                                        <Form.Control type="number" min={0} max={100}
                                            {...register(key as any, { min: 0, max: 100 })} />
                                    </Form.Group>
                                </Col>
                            ))}
                        </Row>

                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={onClose}>{getValue("cancel")}</Button>
                        <Button variant="primary" type="submit" className="main-button active">{getValue("save")}</Button>
                    </Modal.Footer>
                </Form>
            </Modal>

            {/* Player Image Upload */}
            <UploadModal
                show={showImgUpload}
                handleClose={() => setShowImgUpload(false)}
                setFileName={setImgFileName}
                setValue={(name, value) => setValue(name as any, value)}
                clearErrors={clearErrors as any}
                trigger={trigger as any}
                name="photoUrl"
                accept="image/*"
            />

            {/* Skill GIF Upload */}
            <UploadModal
                show={showGifUpload}
                handleClose={() => setShowGifUpload(false)}
                setFileName={setGifFileName}
                setValue={(name, value) => setValue(name as any, value)}
                clearErrors={clearErrors as any}
                trigger={trigger as any}
                name="kpi.skillVideoUrl"
                accept="image/gif"
            />
        </>
    );
};

export default AddPlayerModal;
