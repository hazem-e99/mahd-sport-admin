import { Modal, Row, Col } from 'react-bootstrap';
import { useLanguage } from '../../context/languageContext';
import type { PlayerCard } from '../../types/card-control.type';
import './ViewKPIModal.scss';

interface ViewKPIModalProps {
    show: boolean;
    onHide: () => void;
    player: PlayerCard | null;
}

const ViewKPIModal = ({ show, onHide, player }: ViewKPIModalProps) => {
    const { getValue } = useLanguage();

    if (!player) return null;

    const kpis = [
        { label: getValue("cognition") || "Cognition", value: player.kpi.cognition, color: "#773DBD" },
        { label: getValue("technical") || "Technical", value: player.kpi.technical, color: "#FF5000" },
        { label: getValue("physical") || "Physical", value: player.kpi.physical, color: "#07C37B" },
        { label: getValue("psychology") || "Psychology", value: player.kpi.psychology, color: "#229CBE" },
        { label: getValue("medical") || "Medical", value: player.kpi.medical, color: "#C30734" },
    ];

    return (
        <Modal
            show={show}
            onHide={onHide}
            size="lg"
            centered
            className="view-kpi-modal"
            backdrop="static"
        >
            <Modal.Header closeButton className="kpi-modal-header">
                <Modal.Title>
                    <span className="player-name">{player.fullNameEn}</span>
                    <span className="header-divider"></span>
                    <span className="modal-subtitle">{getValue("view_kpi") || "View KPI"}</span>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="kpi-modal-body">
                <Row className="g-4">
                    <Col lg={7}>
                        <div className="kpi-metrics-container">
                            <h5 className="section-title">{getValue("kpis") || "KPI Metrics"}</h5>
                            {kpis.map((kpi, index) => (
                                <div key={index} className="kpi-stat-item">
                                    <div className="kpi-info">
                                        <span className="kpi-label">{kpi.label}</span>
                                        <span className="kpi-value">{kpi.value}%</span>
                                    </div>
                                    <div className="progress-wrapper">
                                        <div
                                            className="custom-progress-bar"
                                            style={{
                                                width: `${kpi.value}%`,
                                                backgroundColor: kpi.color,
                                                boxShadow: `0 0 10px ${kpi.color}44`
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Col>
                    <Col lg={5}>
                        <div className="kpi-video-container">
                            <h5 className="section-title">{getValue("skill_video") || "Skill Video"}</h5>
                            <div className="video-player-wrapper">
                                {player.kpi.skillVideoUrl ? (
                                    <video controls className="premium-video">
                                        <source src={player.kpi.skillVideoUrl} type="video/mp4" />
                                        Your browser does not support the video tag.
                                    </video>
                                ) : (
                                    <div className="no-video-placeholder">
                                        <span>No video available</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </Col>
                </Row>
            </Modal.Body>
        </Modal>
    );
};

export default ViewKPIModal;
