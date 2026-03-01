import { Modal } from 'react-bootstrap';
import { useLanguage } from '../../context/languageContext';
import type { PlayerCard } from '../../types/card-control.type';
import './ViewKPIModal.scss';

interface ViewKPIModalProps {
    show: boolean;
    onHide: () => void;
    player: PlayerCard | null;
}

const interpolateColor = (value: number) => {
    // 0% → lightest (#d4b8ef), 100% → primary (#773DBD)
    const lo = { r: 212, g: 184, b: 239 };
    const hi = { r: 119, g: 61,  b: 189 };
    const t = value / 100;
    const r = Math.round(lo.r + (hi.r - lo.r) * t);
    const g = Math.round(lo.g + (hi.g - lo.g) * t);
    const b = Math.round(lo.b + (hi.b - lo.b) * t);
    const tr = Math.round(lo.r + (hi.r - lo.r) * t * 0.18 + lo.r * 0.82);
    const tg = Math.round(lo.g + (hi.g - lo.g) * t * 0.18 + lo.g * 0.82);
    const tb = Math.round(lo.b + (hi.b - lo.b) * t * 0.18 + lo.b * 0.82);
    return {
        color: `rgb(${r},${g},${b})`,
        track: `rgb(${tr},${tg},${tb})`,
    };
};

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
        { label: getValue("cognition")  || "Cognition",  value: player.kpi.cognition,  ...interpolateColor(player.kpi.cognition)  },
        { label: getValue("technical")  || "Technical",  value: player.kpi.technical,  ...interpolateColor(player.kpi.technical)  },
        { label: getValue("physical")   || "Physical",   value: player.kpi.physical,   ...interpolateColor(player.kpi.physical)   },
        { label: getValue("psychology") || "Psychology", value: player.kpi.psychology, ...interpolateColor(player.kpi.psychology) },
        { label: getValue("medical")    || "Medical",    value: player.kpi.medical,    ...interpolateColor(player.kpi.medical)    },
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
                    {player.birthDate    && (
                        <span className="strip-tag">
                            <i className="strip-dot" />
                            {new Date(player.birthDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </span>
                    )}
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
