import { WidgetService } from "@/api/services/widget.service";
import SvgCommenticon from "../../icons/comment-icon";
import { useLanguage } from "../../../context/languageContext";
import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { useParams } from "react-router-dom";
import "./Preview-Widget-modal-component.scss";
import { useFormContext } from "react-hook-form";

interface PreviewWidgetModalProps {
  show: boolean;
  handleClose: () => void;
  widgetData?: any;
}

interface WidgetApiResponse {
  success: boolean;
  data: {
    id: string;
    name: string;
    nameLa: string;
    status: number;
    statusName: string;
    widgetType: number;
    widgetTypeName: string;
    tabWidgetCategoryId: number;
    categoryName: string;
    categoryNameLa: string;
    width: number;
    height: number;
    extendable: boolean;
    url: string;
    roles: string[];
    navigationType: number;
  };
  message: string | null;
  errors: string[];
}

const PreviewWidgetModal = ({
  show,
  handleClose,
  widgetData,
}: PreviewWidgetModalProps) => {
  const { getValue } = useLanguage();
  const { id } = useParams<{ id: string }>();
  const [
    fetchedWidgetData,
    setFetchedWidgetData,
  ] = useState<WidgetApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const methods = useFormContext();
  const icon = methods?.watch("icon");

  console.log("PreviewWidgetModal - show:", show);
  console.log("PreviewWidgetModal - id:", id);
  console.log("PreviewWidgetModal - widgetData:", widgetData);

  useEffect(() => {
    if (show && id) {
      setLoading(true);
      setError(null);

      WidgetService.getById(id)
        .then((data) => {
          console.log("API Response:", data);
          setFetchedWidgetData(data);
        })
        .catch((err) => {
          console.error("Error fetching widget data:", err);
          setError("Failed to load widget data");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [show, id]);

  // Use fetched data if available, otherwise use passed widgetData
  const displayData = fetchedWidgetData?.data || widgetData;

  return (
    <div>
      <Modal show={show} onHide={handleClose} className="PreviewWidget">
        <Modal.Header closeButton>
          <Modal.Title>
            <div className="header_modal">
              <h3>
                <SvgCommenticon />
                {getValue("preview_widget")}
              </h3>
            </div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="modal_details">
            {loading && (
              <div className="loading-container">
                <div className="spinner">Loading widget data...</div>
              </div>
            )}

            {error && <div className="alert alert-danger">{error}</div>}

            {!loading && !error && displayData && (
              <div className="widget-preview-card">
                {/* Header */}
                <div className="widget-header">
                  <div className="widget-title">
                    {displayData.widgetTypeName || displayData.name || "Widget"}
                  </div>
                  <div className="widget-menu">
                    <span className="menu-dots">⋮</span>
                  </div>
                </div>

                {/* Main Icon */}
                {(displayData.icon || icon) && (
                  <div className="widget-icon-container">
                    <div className="widget-icon">
                      <img
                        src={icon || displayData.icon}
                        alt={displayData.name || "Widget Icon"}
                        className="widget-icon-image"
                        onError={(e) => {
                          // Hide the image if it fails to load
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Footer */}
                <div className="widget-footer">
                  <div
                    className="view-details"
                    onClick={() => {
                      if (displayData.url) {
                        window.open(displayData.url, "_blank");
                      }
                    }}
                  >
                    <span className="view-text">View details</span>
                    {/* <span className="external-link">↗</span> */}
                  </div>
                </div>
              </div>
            )}
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default PreviewWidgetModal;
