import React, { useState } from "react";
import type { PlayerCard } from "../../types/card-control.type";
import { useLanguage } from "../../context/languageContext";
import "./PlayerCardPreview.scss";

// ── Card-layer asset paths (matches portal exactly) ───────────────────────────
const CARD_LAYERS = {
  diamond: {
    bg: "/assets/card-layers/Background 2-diamond.svg",
    outline: "/assets/card-layers/outline-Gold.svg",
    bar: "/assets/card-layers/Bar-Gold.svg",
    theme: "theme-diamond",
  },
  gold: {
    bg: "/assets/card-layers/Background 2-gold.svg",
    outline: "/assets/card-layers/outline-Gold.svg",
    bar: "/assets/card-layers/Bar-Gold.svg",
    theme: "theme-gold",
  },
  silver: {
    bg: "/assets/card-layers/Background 2.svg",
    outline: "/assets/card-layers/outline-silver.svg",
    bar: "/assets/card-layers/Bar-silver.svg",
    theme: "theme-silver",
  },
} as const;

// ── Sport icon map ────────────────────────────────────────────────────────────
const SPORT_ICONS: Record<string, string> = {
  football: "⚽",
  judo: "🥋",
  athletics: "👟",
  taekwondo: "🦵",
  tennis: "🎾",
  swimming: "🏊",
};

// ── Football SVG icon ─────────────────────────────────────────────────────────
const FootballIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" fill="none">
    <circle cx="32" cy="32" r="30" stroke="#fff" strokeWidth="3" fill="rgba(255,255,255,0.12)" />
    <polygon points="32,14 38,24 46,24 41,33 44,43 32,37 20,43 23,33 18,24 26,24" fill="#fff" opacity="0.9" />
    <circle cx="32" cy="32" r="30" stroke="rgba(255,255,255,0.3)" strokeWidth="1" fill="none" />
  </svg>
);

// ── Stat keys (portal order) ──────────────────────────────────────────────────
const STAT_KEYS = ["pac", "sho", "pas", "dri", "def", "phy"] as const;

// Map admin KPIs → portal stat keys
const mapKpiToStats = (kpi: PlayerCard["kpi"]) => ({
  pac: kpi.physical,
  sho: kpi.technical,
  pas: kpi.psychology,
  dri: kpi.cognition,
  def: kpi.medical,
  phy: Math.round((kpi.physical + kpi.technical + kpi.psychology + kpi.cognition + kpi.medical) / 5),
});

// ── Component ─────────────────────────────────────────────────────────────────
interface PlayerCardPreviewProps {
  player: PlayerCard;
}

const PlayerCardPreview: React.FC<PlayerCardPreviewProps> = ({ player }) => {
  const { language } = useLanguage();
  const [isToggled, setIsToggled] = useState(false);

  const performanceKey = player.performance as keyof typeof CARD_LAYERS;
  const layer = CARD_LAYERS[performanceKey] ?? CARD_LAYERS.silver;
  const { bg, outline, bar, theme } = layer;

  const fullName = language === "ar" ? player.fullNameAr : player.fullNameEn;
  const stats = mapKpiToStats(player.kpi);
  const rating = stats.phy;
  const sport = player.sport?.toLowerCase() ?? "";
  const isFootball = sport === "football";
  const sportIcon = SPORT_ICONS[sport] ?? "🏅";
  const year = player.birthYear ?? new Date().getFullYear().toString();

  return (
    <div className="pc-preview-wrapper">
      {/* ── Hidden SVG clipPath — shield shape ── */}
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <defs>
          <clipPath id="pc-preview-shield-clip" clipPathUnits="objectBoundingBox"
            transform={`scale(${1 / 799} ${1 / 1262})`}>
            <path d="M392.600,1255.900 C392.400,1255.700 371.200,1238.400 327.100,1214.800 C286.400,1193.000 217.300,1161.200 119.300,1133.500 C66.900,1118.700 38.700,1103.800 22.000,1082.300 C3.700,1058.700 0.100,1027.900 0.100,985.900 C0.100,164.400 0.100,164.400 0.100,164.400 C0.100,164.400 10.800,165.600 10.800,165.600 C12.400,165.600 35.900,165.400 82.600,136.900 C104.600,123.500 120.100,110.700 136.600,97.200 C153.800,83.100 171.600,68.600 198.600,51.100 C247.600,19.500 292.600,16.600 294.500,16.500 C302.000,16.100 302.000,16.100 302.000,16.100 C302.000,16.100 304.400,22.900 304.400,22.900 C304.900,24.200 312.600,41.600 337.500,47.800 C353.100,51.700 375.400,31.200 391.200,10.800 C398.900,0.900 398.900,0.900 398.900,0.900 C398.900,0.900 406.900,10.600 406.900,10.600 C421.000,27.700 447.900,51.500 460.800,48.300 C485.700,42.100 493.300,24.700 493.900,23.400 C496.400,16.400 496.400,16.400 496.400,16.400 C496.400,16.400 503.800,17.000 503.800,17.000 C505.700,17.100 550.600,20.000 599.600,51.600 C626.700,69.000 644.400,83.600 661.600,97.700 C678.100,111.200 693.600,123.900 715.600,137.300 C762.300,165.800 785.800,166.000 787.400,166.000 C798.400,164.800 798.400,164.800 798.400,164.800 L798.000,176.000 C798.000,176.000 798.000,986.000 798.000,986.000 C798.000,1028.000 794.300,1058.800 776.100,1082.400 C759.400,1104.000 731.200,1118.800 678.800,1133.600 C678.800,1133.600 678.800,1133.600 678.800,1133.600 C489.400,1187.100 422.000,1240.400 405.900,1255.400 C399.400,1261.500 399.400,1261.500 399.400,1261.500 C399.400,1261.500 392.600,1255.900 392.600,1255.900 z" />
          </clipPath>
        </defs>
      </svg>

      {/* ── The actual card ── */}
      <div
        className={`pc ${isToggled ? "pc--toggled" : ""} ${theme}`}
        onClick={() => setIsToggled((v) => !v)}
      >
        {/* Layer 1: Background */}
        <img src={bg} className="pc__bg" alt="" />

        {/* Layer 2: Player photo — clipped inside shield */}
        <div className="pc__photo-clip" style={{ clipPath: "url(#pc-preview-shield-clip)" }}>
          <img
            src={player.photoUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${player.fullNameEn}`}
            className="pc__photo"
            alt={fullName}
          />
        </div>

        {/* Layer 3: Outline */}
        <img src={outline} className="pc__outline" alt="" />

        {/* Layer 3.5: Football side-gradient */}
        {isFootball && (
          <img src="/assets/card-layers/Side-gradient.svg" className="pc__side-gradient" alt="" />
        )}

        {/* Layer 4: Sport / football info */}
        <div className="pc__topleft">
          {isFootball ? (
            <>
              <span className="pc__rating">{rating}</span>
              <span className="pc__position">{player.position}</span>
              <span className="pc__topleft-divider" />
              <FootballIcon className="pc__football-icon" />
            </>
          ) : (
            <span className="pc__sport-icon">{sportIcon}</span>
          )}
        </div>

        {/* Layer 5: Logo */}
        <img src="/assets/card-layers/Logo.png" className="pc__logo" alt="Mahd" />

        {/* Layer 6: Name bar */}
        <div className="pc__namebar">
          <img src={bar} className="pc__namebar-bg" alt="" />
          <span className="pc__namebar-text">{fullName}</span>
        </div>

        {/* FRONT: flag + year */}
        <div className="pc__bottom pc__bottom--front">
          <div className="pc__flag-row">
            <img src="/assets/card-layers/Flag.png" className="pc__flag" alt={player.nationality?.Code ?? "SA"} />
            <span className="pc__country">{(language === 'ar' ? player.nationality?.NameAr : player.nationality?.NameEn)?.toUpperCase() ?? "SAUDI ARABIA"}</span>
          </div>
          <span className="pc__year">{year}</span>
        </div>

        {/* BACK: stats */}
        <div className="pc__bottom pc__bottom--back">
          <div className="pc__stats">
            <div className="pc__stats-labels">
              {STAT_KEYS.map((key) => (
                <div className="pc__stat-item" key={key}>
                  <img src="/assets/card-layers/req-dark.svg" className="pc__stat-pill" alt="" />
                  <span className="pc__stat-label">{key.toUpperCase()}</span>
                </div>
              ))}
            </div>
            <div className="pc__stats-values">
              {STAT_KEYS.map((key) => (
                <span key={key}>{stats[key]}</span>
              ))}
            </div>
          </div>
          <img src="/assets/card-layers/Back-black.svg" className="pc__flip-icon" alt="flip" />
        </div>
      </div>

      {/* Click hint */}
      <p className="pc-preview-hint">
        {isToggled ? "← Click to flip back" : "Click card to see stats →"}
      </p>
    </div>
  );
};

export default PlayerCardPreview;
