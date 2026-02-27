
import React from "react";
import type { TablePaginationProps } from "@/types/table-pagination.type";
import { Form } from "react-bootstrap";
import SvgLeftControlIcon from '@/components/icons/left-control-icon';
import SvgRightControlIcon from '@/components/icons/right-control-icon';
import "./pagination.scss";
import { useLanguage } from "@/context/languageContext";

export const TablePagination: React.FC<TablePaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  onItemsPerPageChange,
}) => {

  const { getValue } = useLanguage();

  const renderPageButtons = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = 1;
    let endPage = totalPages;

    if (totalPages > maxVisiblePages) {
      const half = Math.floor(maxVisiblePages / 2);
      startPage = Math.max(1, currentPage - half);
      endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

      if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }
    }

    // Always show first page
    if (startPage > 1) {
      pages.push(
        <button
          key={1}
          className={`pagination-button ${currentPage === 1 ? "active" : ""}`}
          onClick={() => onPageChange(1)}
        >
          1
        </button>
      );
      if (startPage > 2) {
        pages.push(<span key="ellipsis-start" className="pagination-ellipsis">...</span>);
      }
    }

    // Visible pages
    for (let i = startPage; i <= endPage; i++) {
      if (i > 0 && i <= totalPages) {
        pages.push(
          <button
            key={i}
            className={`pagination-button ${currentPage === i ? "active" : ""}`}
            onClick={() => onPageChange(i)}
          >
            {i}
          </button>
        );
      }
    }

    // Always show last page if not in visible range
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(<span key="ellipsis-end" className="pagination-ellipsis">...</span>);
      }
      pages.push(
        <button
          key={totalPages}
          className={`pagination-button ${currentPage === totalPages ? "active" : ""}`}
          onClick={() => onPageChange(totalPages)}
        >
          {totalPages}
        </button>
      );
    }
    return pages;
  };

  // Items per page options
  const itemsPerPageOptions = [5, 10, 15, 20, 25];

  return (
    <div className="table-pagination-container">
      <div className="items-per-page">
        <span className="items-per-page-label">{getValue("number_of_items")}</span>
        <Form.Select
          className="items-per-page-select form-select"
          value={itemsPerPage}
          dir="ltr"
          onChange={(e) => onItemsPerPageChange && onItemsPerPageChange(Number(e.target.value))}
        >
          {itemsPerPageOptions.map(option => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </Form.Select>
      </div>

      <div className="pagination-controls">
        <button
          className="pagination-button prev"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <SvgLeftControlIcon className="rtl:rotate-180" />
        </button>

        {renderPageButtons()}

        <button
          className="pagination-button next"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || totalPages === 0}
        >
          <SvgRightControlIcon className="rtl:rotate-180" />
        </button>
      </div>
    </div>
  );
};