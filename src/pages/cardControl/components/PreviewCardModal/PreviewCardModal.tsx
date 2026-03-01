import { Modal } from "react-bootstrap";
import type { PlayerCard } from "../../types/card-control.type";
import { useLanguage } from "../../context/languageContext";
import PlayerCardPreview from "../PlayerCardPreview/PlayerCardPreview";
import "./PreviewCardModal.scss";

interface PreviewCardModalProps {
  show: boolean;
  onHide: () => void;
  player: PlayerCard | null;
}

const PreviewCardModal = ({ show, onHide, player }: PreviewCardModalProps) => {
  const { language, getValue } = useLanguage();

  if (!player) return null;

  const playerName = language === "ar" ? player.fullNameAr : player.fullNameEn;

  const performanceColors: Record<string, string> = {
    diamond: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
    gold: "linear-gradient(135deg, #2d1b00 0%, #4a2f00 50%, #6b4400 100%)",
    silver: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #404040 100%)",
  };

  const bgGradient =
    performanceColors[player.performance] ?? performanceColors.silver;

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      className="preview-card-modal"
      size="sm"
    >
      <Modal.Header closeButton className="preview-card-modal__header">
        <Modal.Title>
          <span className="preview-card-modal__title">
            {getValue("card_preview") || "Card Preview"}
          </span>
          <span className="preview-card-modal__subtitle">{playerName}</span>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body
        className="preview-card-modal__body"
        style={{ background: bgGradient }}
      >
        <PlayerCardPreview player={player} />
      </Modal.Body>
    </Modal>
  );
};

export default PreviewCardModal;
