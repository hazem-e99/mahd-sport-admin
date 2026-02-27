import SvgBackicon from "@/components/icons/back-icon";
import { useLanguage } from "@/context/languageContext";
import type { PageHeaderProps } from "@/types/page-header.type";
import React, { useState } from "react";
import { Spinner } from "react-bootstrap";
import { useNavigate } from "react-router";
import PreviewWidgetModal from "../PreviewWidget/Preview-Widget-modal-component";
import "./pageheader-actions.component.scss";

const PageHeaderActions: React.FC<PageHeaderProps> = ({
  title,
  breadcrumb,
  onSubmit,
  submitLabel,
  cancelLabel,
  showBtns = true,
  previewButton,
  loadingSubmit = false,
}) => {
  const { getValue } = useLanguage();
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);

  return (
    <>
      <div className="page-header-actions d-flex justify-content-between align-items-center flex-wrap mb-4 gap-3">
        <div className="page-header-actions__title d-flex align-items-center">
          <span
            className="back-icon"
            onClick={() => navigate(-1)}
            style={{ cursor: "pointer" }}
          >
            <SvgBackicon className="rtl:rotate-180" />
          </span>
          <div className="mx-3">
            <h2 className="text-xl">{title}</h2>
            {breadcrumb && (
              <div className="text-sm text-gray-500 mt-1">{breadcrumb}</div>
            )}
          </div>
        </div>

        {showBtns && (
          <div className="flex gap-2">
            <button type="button" onClick={() => navigate(-1)} className="main-button">
              {cancelLabel || getValue("cancel")}
            </button>

            {previewButton}

            <button
              type="submit"
              {...(onSubmit && { onClick: onSubmit })}
              className="main-button active"
              disabled={loadingSubmit}
            >
              {submitLabel || getValue("submit")}

              {loadingSubmit && (
                <Spinner animation="border" size="sm" className="ms-2" />
              )}
            </button>
          </div>
        )}
      </div>

      <PreviewWidgetModal show={show} handleClose={handleClose} />
    </>
  );
};

export default PageHeaderActions;
