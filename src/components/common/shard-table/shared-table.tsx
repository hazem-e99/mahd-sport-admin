/* eslint-disable @typescript-eslint/no-explicit-any */
import SvgDeleteicon from '@/components/icons/delete-icon';
import SvgEditicon from '@/components/icons/edit-icon';
import SvgEyeicon from '@/components/icons/eye-with-border-icon';
import SvgPublic from '@/components/icons/public';
import SvgReordericon from '@/components/icons/reorder-icon';
import SvgRestricted from '@/components/icons/restricted';
import { useLanguage } from '@/context/languageContext';
import type { SortConfig } from "@/types/shard-table.type";
import { DragDropContext, Draggable, Droppable, type DropResult } from "@hello-pangea/dnd";
import React, { useState } from "react";
import { Spinner } from "react-bootstrap";
import SkeletonTable from '../skeleton/SkeletonTable';
import './shared-table.scss';

interface SharedTableProps {
  data: any[];
  setData?: (data: any[]) => void;
  columns: any[];
  showEditIcon?: boolean;
  showViewIcon?: boolean;
  showDeleteIcon?: boolean;
  showViewFullResponses?: boolean;
  handleViewIconClick?: (item: any) => void;
  handleShowFullResponses?: () => void;
  onDelete?: (id: string | number) => void;
  handleEditIconClick?: (item: any) => void;
  customCellRender?: (col: any, item: any) => React.ReactElement | undefined;
  canEdit?: (item: any) => boolean;
  canDelete?: (item: any) => boolean;
  canView?: (item: any) => boolean;
  emptyMessage?: string | React.ReactNode;
  pending?: boolean;
}

const SharedTable: React.FC<SharedTableProps> = ({
  data,
  setData,
  columns,
  showEditIcon = false,
  showViewIcon = false,
  showDeleteIcon = false,
  showViewFullResponses = false,
  handleViewIconClick,
  handleShowFullResponses,
  onDelete,
  handleEditIconClick,
  customCellRender,
  canEdit,
  canDelete,
  canView,
  emptyMessage = "No data available",
  pending = false,
}) => {
  console.log("🚀 ~ SharedTable ~ pending:", pending)
  const [sortConfig, setSortConfig] = useState<SortConfig>(null);

  const { getValue } = useLanguage()

  // Drag-and-drop reorder
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination || !setData) return;

    const reordered = Array.from(data);
    const [movedItem] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, movedItem);
    setData(reordered);
  };

  // Sort logic
  const handleSort = (key: keyof any) => {
    if (!setData) return;

    let direction: "asc" | "desc" = "asc";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    const sorted = [...data].sort((a, b) => {
      const aVal = a[key];
      const bVal = b[key];

      if (aVal < bVal) return direction === "asc" ? -1 : 1;
      if (aVal > bVal) return direction === "asc" ? 1 : -1;
      return 0;
    });

    setSortConfig({ key, direction });
    setData(sorted);
  };

  const renderSortArrow = (key: keyof any) => {
    if (!sortConfig || sortConfig.key !== key) return null;
    return sortConfig.direction === "asc" ? " ▲" : " ▼";
  };

  const handleRowsRendering = (label: string, item: any) => {
    let tableRow = null;

    if (label === 'status') {
      tableRow = (
        <td key={label}>
          <div className="d-flex align-items-center">
            <div className={`status-dot status-dot--${item.status === 1 ? 'Active' : item.status === 2 ? 'InActive' : 'InActive'}`}></div>
            <span className="ms-2">
              {item.status === 1 ? getValue("status.active") : item.status === 2 ? getValue("status.inactive") : getValue("status.inactive")}
            </span>
          </div>
        </td>
      );
    }
    else if (label === 'visibility') {
      tableRow = (
        <td key={label}>
          <div className="visibility-cell d-flex align-items-center">
            <span className={`visibility-dot ${item['visibility'] === "Public" ? "public" : "restricted"}`}>
              {item['visibility'] === "Public" ? (
                <SvgPublic width={18} height={18} />
              ) : (
                <SvgRestricted width={18} height={18} />
              )}
            </span>
            <span className="ms-2">
              {item['visibility'] === "Public" ? getValue("public") : getValue("restricted")}
            </span>
          </div>
        </td>
      );
    }
    else if (label === 'actions') {
      // Check permissions for each action
      const canEditItem = canEdit ? canEdit(item) : true;
      const canDeleteItem = canDelete ? canDelete(item) : true;
      const canViewItem = canView ? canView(item) : true;

      tableRow = (
        <td key={label}>
          <div className="actions-icons-container d-flex align-items-center gap-2">
            {showViewIcon && canViewItem && (
              <div title={getValue("view") || "View"}>
                <SvgEyeicon
                  className="action-icon"
                  onClick={() => handleViewIconClick && handleViewIconClick(item)}
                  style={{ cursor: 'pointer' }}
                />
              </div>
            )}
            {showViewIcon && !canViewItem && (
              <div title={getValue("cannot_view_inactive") || "Cannot view inactive item"}>
                <SvgEyeicon
                  className="action-icon disabled"
                  style={{
                    opacity: 0.3,
                    cursor: 'not-allowed',
                    filter: 'grayscale(100%)'
                  }}
                />
              </div>
            )}

            {showEditIcon && canEditItem && (
              <div title={getValue("edit") || "Edit"}>
                <SvgEditicon
                  className="action-icon"
                  onClick={() => handleEditIconClick && handleEditIconClick(item)}
                  style={{ cursor: 'pointer' }}
                />
              </div>
            )}
            {showEditIcon && !canEditItem && (
              <div title={getValue("cannot_edit_expired_campaign") || "Cannot edit expired campaign"}>
                <SvgEditicon
                  className="action-icon disabled"
                  style={{
                    opacity: 0.3,
                    cursor: 'not-allowed',
                    filter: 'grayscale(100%)'
                  }}
                />
              </div>
            )}

            {showDeleteIcon && canDeleteItem && (
              <div title={getValue("delete") || "Delete"}>
                <SvgDeleteicon
                  className="action-icon"
                  onClick={() => onDelete && onDelete(item.id)}
                  style={{ cursor: 'pointer' }}
                />
              </div>
            )}
            {showDeleteIcon && !canDeleteItem && (
              <div title={getValue("cannot_delete_expired_campaign") || "Cannot delete expired campaign"}>
                <SvgDeleteicon
                  className="action-icon disabled"
                  style={{
                    opacity: 0.3,
                    cursor: 'not-allowed',
                    filter: 'grayscale(100%)'
                  }}
                />
              </div>
            )}

            {showViewFullResponses && (
              <button
                onClick={() => handleShowFullResponses && handleShowFullResponses()}
                title="View Full Response"
                className="btn btn-link p-0"
                style={{
                  color: '#FF5000',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  textDecoration: 'none'
                }}
              >
                View Full Response
              </button>
            )}
          </div>
        </td>
      );
    }
    else {
      tableRow = <td key={label}>{item[label] || '-'}</td>;
    }
    return tableRow;
  }

  // Handle empty data
  if (!data || data.length === 0) {
    return (
      <div className="shared-table-container">
        <table style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead>
            <tr>
              {columns.map((col: any) => (
                <th key={col.key}>
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={columns.length} className="text-center py-4">
                {pending ? (
                  <div className="d-flex justify-content-center align-items-center">
                    <Spinner animation="border" size="sm" className="me-2" />
                    <span>{getValue("loading") || "Loading..."}</span>
                  </div>
                ) : (
                  emptyMessage
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  // Show skeleton when pending and no data
  if (pending) {
    return <SkeletonTable rows={5} columns={columns.length} />;
  }

  return (
    <div className="shared-table-container">
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="table" >
          {(provided) => (
            <table
              ref={provided.innerRef}
              {...provided.droppableProps}
              style={{ borderCollapse: "collapse", width: "100%" }}
            >
              <thead>
                <tr>
                  {columns.map((col: any) => (
                    <th
                      key={col.key}
                      onClick={() => handleSort(col.key)}
                      style={{ cursor: setData ? 'pointer' : 'default' }}
                    >
                      {col.label}
                      {setData && renderSortArrow(col.key)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((item: any, index: number) => (
                  <Draggable
                    key={String(item.id)}
                    draggableId={String(item.id)}
                    index={index}
                    isDragDisabled={!setData}
                  >
                    {(provided, snapshot) => (
                      <tr
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        style={{
                          ...provided.draggableProps.style,
                          background: snapshot.isDragging ? "#f0f0f0" : "white",
                        }}
                      >
                        {columns.map((singleCol: any) => {
                          if (singleCol.key === 'id') {
                            return (
                              <td key={singleCol.key}>
                                <div className="reoder-icon d-flex align-items-center">
                                  {setData && (
                                    <span
                                      {...provided.dragHandleProps}
                                      style={{ cursor: "grab", marginRight: 8 }}
                                      title="Drag to reorder"
                                    >
                                      <SvgReordericon />
                                    </span>
                                  )}
                                  {item.id}
                                </div>
                              </td>
                            );
                          }

                          // Check for custom cell render first
                          if (customCellRender) {
                            const custom = customCellRender(singleCol, item);
                            if (custom !== undefined) return custom;
                          }

                          // Default row rendering
                          return handleRowsRendering(singleCol.key, item);
                        })}
                      </tr>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </tbody>
            </table>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default SharedTable;