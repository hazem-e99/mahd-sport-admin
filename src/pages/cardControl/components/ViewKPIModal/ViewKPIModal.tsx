import { Modal } from 'react-bootstrap';
import { useLanguage } from '../../context/languageContext';
import type { PlayerCard } from '../../types/card-control.type';
import './ViewKPIModal.scss';

interface ViewKPIModalProps {
    show: boolean;
    onHide: () => void;
    player: PlayerCard | null;
}

const CircleKpi = ({ label, value, color, track }: { label: string; value: number; color: string; track: string }) => {
    const r = 26;
    const circ = 2 * Math.PI * r;
    const offset = circ - (value / 100) * circ;
    return (
        <div className="kpi-card">
            <div className="kpi-card__ring-wrap">
                <svg viewBox="0 0 64 64" className="kpi-card__svg">
                    <circle cx="32" cy="32" r={r} fill="none" stroke={track} strokeWidth="5" />
                    <circle
                        cx="32" cy="32" r={r} fill="none"
                        stroke={color} strokeWidth="5"
                        strokeDasharray={`${circ}`}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        transform="rotate(-90 32 32)"
                        className="kpi-card__arc"
                    />
                </svg>
                <span className="kpi-card__val">{value}</span>
            </div>
            <span className="kpi-card__label">{label}</span>
        </div>
    );
};

const ViewKPIModal = ({ show, onHide, player }: ViewKPIModalProps) => {
    const { language, getValue } = useLanguage();

    if (!player) return null;

    const playerName = language === 'ar' ? player.fullNameAr : player.fullNameEn;

    const kpis = [
        { label: getValue("cognition")  || "Cognition",  value: player.kpi.cognition,  color: "#773DBD", track: "#ede6fa" },
        { label: getValue("technical")  || "Technical",  value: player.kpi.technical,  color: "#4A90E2", track: "#e3eefb" },
        { label: getValue("physical")   || "Physical",   value: player.kpi.physical,   color: "#27AE60", track: "#e2f5ea" },
        { label: getValue("psychology") || "Psychology", value: player.kpi.psychology, color: "#E67E22", track: "#fdebd0" },
        { label: getValue("medical")    || "Medical",    value: player.kpi.medical,    color: "#E74C3C", track: "#fde8e6" },
    ];

    const overallAvg = Math.round(kpis.reduce((s, k) => s + k.value, 0) / kpis.length);

    return (
        <Modal show={show} onHide={onHide} size="lg" centered className="view-kpi-modal" backdrop="static">
            <Modal.Header closeButton className="kpi-modal-header">
                <Modal.Title>
                    <div className="header-title-row">
                        <img
                            src={player.photoUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${player.fullNameEn}`}
                            alt={playerName}
                            className="header-avatar"
                        />
                        <div>
                            <span className="player-name">{playerName}</span>
                            <span className="modal-subtitle">{getValue("view_kpi") || "View KPI"}</span>
                        </div>
                    </div>
                </Modal.Title>
            </Modal.Header>

            <Modal.Body className="kpi-modal-body">

                {/* ── Player Strip ── */}
                <div className="player-strip">
                    {player.position     && <span className="strip-tag"><i className="strip-dot" />{player.position}</span>}
                    {player.sport        && <span className="strip-tag"><i className="strip-dot" />{player.sport}</span>}
                    {player.country      && <span className="strip-tag"><i className="strip-dot" />{player.country}</span>}
                    {player.playerNumber && <span className="strip-tag strip-tag--num">#{player.playerNumber}</span>}
                    <span className={`perf-chip perf-chip--${player.performance}`}>
                        {getValue(player.performance) || player.performance}
                    </span>
                </div>

                {/* ── KPI Section ── */}
                <div className="kpi-section">
                    <div className="kpi-section__header">
                        <span className="kpi-section__title">{getValue("kpis") || "KPI Metrics"}</span>
                        <span className="kpi-overall-badge">
                            {getValue("overall") || "Avg"}&nbsp;
                            <strong>{overallAvg}%</strong>
                        </span>
                    </div>
                    <div className="kpi-cards-row">
                        {kpis.map((k, i) => (
                            <CircleKpi key={i} {...k} />
                        ))}
                    </div>
                </div>

                {/* ── Skill GIF ── */}
                <div className="skill-section">
                    <span className="skill-section__title">{getValue("skill_gif") || "Skill GIF"}</span>
                    <div className="skill-media">
                        {player.kpi.skillVideoUrl ? (
                            <img src={player.kpi.skillVideoUrl} alt="Skill GIF" className="skill-gif" />
                        ) : (
                            <div className="skill-empty">
                                <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
                                    <rect x="2" y="5" width="20" height="14" rx="3" stroke="currentColor" strokeWidth="1.4" />
                                    <path d="M10 9.5l4 2.5-4 2.5V9.5z" fill="currentColor" opacity=".4" />
                                </svg>
                                <span>{getValue("no_gif") || "No GIF available"}</span>
                            </div>
                        )}
                    </div>
                </div>

            </Modal.Body>
        </Modal>
    );
};

export default ViewKPIModal;
