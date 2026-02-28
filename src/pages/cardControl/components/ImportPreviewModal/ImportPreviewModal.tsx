import React from "react";
import { Modal, Button, Table, Badge } from "react-bootstrap";
import type { PlayerCard } from "../../types/card-control.type";
import type { ImportResult } from "../../utils/importExcel";
import { useLanguage } from "../../context/languageContext";
import "./ImportPreviewModal.scss";

interface ImportPreviewModalProps {
  show: boolean;
  result: ImportResult | null;
  onConfirm: (players: PlayerCard[], mode: "append" | "replace") => void;
  onHide: () => void;
}

const PERFORMANCE_COLORS: Record<string, string> = {
  diamond: "#b9f2ff",
  gold: "#ffd700",
  silver: "#c0c0c0",
};

const ImportPreviewModal: React.FC<ImportPreviewModalProps> = ({
  show,
  result,
  onConfirm,
  onHide,
}) => {
  const { getValue } = useLanguage();

  if (!result) return null;

  const { players, warnings, skipped, detectedColumns, sheetsImported } = result;

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="xl"
      centered
      className="import-preview-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title>
          <span className="modal-title-icon">📥</span>
          Import Preview
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {/* Summary row */}
        <div className="import-summary">
          <div className="summary-card success">
            <span className="summary-number">{players.length}</span>
            <span className="summary-label">Players Ready</span>
          </div>
          <div className="summary-card warning">
            <span className="summary-number">{skipped}</span>
            <span className="summary-label">Rows Skipped</span>
          </div>
          <div className="summary-card info">
            <span className="summary-number">{detectedColumns.length}</span>
            <span className="summary-label">Columns Detected</span>
          </div>
        </div>

        {/* Sheets imported */}
        <div className="detected-columns">
          <span className="detected-label">Sheets imported:</span>
          {sheetsImported.map((s) => (
            <Badge key={s} className="col-badge sheet-badge">
              {s}
            </Badge>
          ))}
        </div>

        {/* Warnings */}
        {warnings.length > 0 && (
          <div className="import-warnings">
            <strong>⚠️ Warnings</strong>
            <ul>
              {warnings.map((w, i) => (
                <li key={i}>{w}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Preview table */}
        {players.length > 0 ? (
          <div className="preview-table-wrapper">
            <Table bordered hover size="sm" className="preview-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name (EN)</th>
                  <th>Name (AR)</th>
                  <th>Sport</th>
                  <th>Birth Year</th>
                  <th>No.</th>
                  <th>Position</th>
                  <th>Country</th>
                  <th>Performance</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {players.map((p, i) => (
                  <tr key={p.id}>
                    <td>{i + 1}</td>
                    <td>{p.fullNameEn}</td>
                    <td dir="rtl">{p.fullNameAr}</td>
                    <td>{p.sport || <span className="empty-cell">—</span>}</td>
                    <td>{p.birthYear || <span className="empty-cell">—</span>}</td>
                    <td>{p.playerNumber || <span className="empty-cell">—</span>}</td>
                    <td>{p.position || <span className="empty-cell">—</span>}</td>
                    <td>{p.country || <span className="empty-cell">—</span>}</td>
                    <td>
                      <span
                        className="perf-badge"
                        style={{
                          backgroundColor: PERFORMANCE_COLORS[p.performance] ?? "#eee",
                        }}
                      >
                        {p.performance}
                      </span>
                    </td>
                    <td>
                      <span className={`status-dot ${p.status ? "active" : "inactive"}`}>
                        {p.status ? "Active" : "Inactive"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        ) : (
          <div className="no-players-msg">
            No valid players found in the file.
          </div>
        )}
      </Modal.Body>

      <Modal.Footer className="import-footer">
        <Button variant="outline-secondary" onClick={onHide}>
          Cancel
        </Button>
        {players.length > 0 && (
          <>
            <Button
              variant="outline-primary"
              className="import-btn append"
              onClick={() => onConfirm(players, "append")}
            >
              + Add to existing list
            </Button>
            <Button
              variant="primary"
              className="import-btn replace main-button active"
              onClick={() => onConfirm(players, "replace")}
            >
              Replace current list
            </Button>
          </>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default ImportPreviewModal;
