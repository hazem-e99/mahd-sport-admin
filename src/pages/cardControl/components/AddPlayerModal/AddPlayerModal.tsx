import React, { useEffect } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useLanguage } from '../../context/languageContext';
import type { PlayerCard } from '../../types/card-control.type';
import SelectController from '@/components/common/SelectController/selectController';
import { COUNTRIES } from '@/utils/countries';

interface AddPlayerModalProps {
    show: boolean;
    onClose: () => void;
    onSave: (player: PlayerCard) => void;
    player?: PlayerCard | null;
}

const AddPlayerModal: React.FC<AddPlayerModalProps> = ({ show, onClose, onSave, player }) => {
    const { getValue } = useLanguage();
    const { register, handleSubmit, reset, formState: { errors }, control, setValue, watch } = useForm<PlayerCard>();

    const selectedCountry = watch("country");

    useEffect(() => {
        if (player) {
            reset(player);
        } else {
            reset({
                id: "",
                fullNameEn: "",
                fullNameAr: "",
                sport: "",
                playerNumber: "",
                position: "",
                country: "",
                countryCode: "",
                performance: "silver",
                photoUrl: "",
                status: true,
                kpi: {
                    cognition: 0,
                    technical: 0,
                    physical: 0,
                    psychology: 0,
                    medical: 0,
                    skillVideoUrl: ""
                }
            });
        }
    }, [player, reset]);

    useEffect(() => {
        if (selectedCountry) {
            const countryEntry = COUNTRIES.find(c => c.label === selectedCountry);
            if (countryEntry) {
                setValue("countryCode", countryEntry.value);
            }
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
        <Modal show={show} onHide={onClose} size="lg" centered className="add-player-modal">
            <Modal.Header closeButton>
                <Modal.Title>{player ? getValue("player_details") : getValue("add_player")}</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Modal.Body style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>{getValue("player_name")} (English)</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter name in English"
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
                                    placeholder="ادخل الاسم بالعربية"
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
                    <h5>KPIs (%)</h5>
                    <Row>
                        <Col md={4}>
                            <Form.Group className="mb-3">
                                <Form.Label>{getValue("cognition")}</Form.Label>
                                <Form.Control type="number" {...register("kpi.cognition", { min: 0, max: 100 })} />
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group className="mb-3">
                                <Form.Label>{getValue("technical")}</Form.Label>
                                <Form.Control type="number" {...register("kpi.technical", { min: 0, max: 100 })} />
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group className="mb-3">
                                <Form.Label>{getValue("physical")}</Form.Label>
                                <Form.Control type="number" {...register("kpi.physical", { min: 0, max: 100 })} />
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group className="mb-3">
                                <Form.Label>{getValue("psychology")}</Form.Label>
                                <Form.Control type="number" {...register("kpi.psychology", { min: 0, max: 100 })} />
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group className="mb-3">
                                <Form.Label>{getValue("medical")}</Form.Label>
                                <Form.Control type="number" {...register("kpi.medical", { min: 0, max: 100 })} />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Form.Group className="mb-3">
                        <Form.Label>{getValue("skill_video")} (URL)</Form.Label>
                        <Form.Control type="text" {...register("kpi.skillVideoUrl")} placeholder="https://..." />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onClose}>{getValue("cancel")}</Button>
                    <Button variant="primary" type="submit" className="main-button active">{getValue("save")}</Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default AddPlayerModal;
