import { useCallback, useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import SharedTable from '@/components/common/shard-table/shared-table';
import { ConflictDeclarationService } from '@/api/services/ConflictDeclarations.service';
import SvgDeleteicon from '@/components/icons/delete-icon';
import { TablePagination } from '../pagination/Pagination';
import type { ConflictDeclaration } from '@/types/ConflictDeclaration.type';
import ConfirmDialog from '../ConfirmDialog/ConfirmDialog';
import { useLanguage } from '@/context/languageContext';

interface ConflictHistoryModalProps {
  show: boolean;
  handleClose: () => void;
}

const ConflictHistoryModal: React.FC<ConflictHistoryModalProps> = ({ show, handleClose }) => {
  const [data, setData] = useState<ConflictDeclaration[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [totalCount, setTotalCount] = useState(0);

  const { getValue } = useLanguage()

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | number | null>(null);
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const [exportingRowId, setExportingRowId] = useState<string | number | null>(null);


  useEffect(() => {
    if (show) fetchHistory();
  }, [show, currentPage, itemsPerPage]);

  const fetchHistory = async () => {
    try {
      const response = await ConflictDeclarationService.getAllConflictDeclarations({
        pageNumber: currentPage,
        pageSize: itemsPerPage,
      });
      const enrichedData = response.data.items.map((item) => ({
        ...item,
        recurrenceDayMonth: `${getPeriodText(item.period)} of ${getMonthText(item.month)}`,
        changedInfo: (
          <div>
            <strong>{item.userName ?? "System"}</strong>
            <div style={{ fontSize: '12px', color: '#666' }}>
              {item.createdOn ? new Date(item.createdOn).toLocaleString() : '0000/00/00'}
            </div>
          </div>
        )
      }));

      setData(enrichedData);
      setTotalPages(response.data.totalPages);
      setTotalCount(response.data.totalCount);
    } catch (e) {
      console.error('Failed to fetch history', e);
    }
  };

  const getPeriodText = (period: number) => {
    switch (period) {
      case 0:
        return "First";
      case 1:
        return "Middle";
      case 2:
        return "Last";
      default:
        return "Unknown";
    }
  };

  const getMonthText = (month: number) =>
    new Date(0, month - 1).toLocaleString('default', { month: 'long' });

  const handleCloseConfirmDialog = useCallback(() => {
    setShowConfirmDialog(false);
    setDeleteLoading(false);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!itemToDelete) return;
    setDeleteLoading(true);
    try {

      const res = await ConflictDeclarationService.deleteConflictDeclaration(itemToDelete);
      console.log("🚀 ~ res:", res)

      await fetchHistory()

      setShowConfirmDialog(false);
      setItemToDelete(null);
    } catch (err) {
      console.log("Error deleting campaign:", err);
    } finally {
      setDeleteLoading(false);
    }
  }, [itemToDelete]);

  const handleExport = useCallback(async () => {
    try {
      setExporting(true);
      setExportError(null);

      const raw = await ConflictDeclarationService.exportConflictDeclarations();

      if (!raw?.success || !raw?.data?.excelData) {
        setExportError(getValue("unable_to_export") || "Unable to export data");
        return;
      }

      const { excelData, fileName } = raw.data;

      // Convert base64 to blob
      const byteCharacters = atob(excelData);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      // Download the file
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName || "conflict-history.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      console.error("Export error:", error);
      const errorMessage = error?.message || getValue("unable_to_export") || "Unable to export data";
      setExportError(errorMessage);
    } finally {
      setExporting(false);
    }
  }, [getValue]);

  const handleExportViewers = useCallback(async (id: string | number) => {
    try {
      setExportingRowId(id);
      setExportError(null);

      const raw = await ConflictDeclarationService.exportViewers(id);

      if (!raw?.success || !raw?.data?.excelData) {
        setExportError(getValue("unable_to_export") || "Unable to export data");
        return;
      }

      const { excelData, fileName } = raw.data;

      // Convert base64 to blob
      const byteCharacters = atob(excelData);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      // Download the file
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName || "conflict-viewers.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      console.error("Export viewers error:", error);
      const errorMessage = error?.message || getValue("unable_to_export") || "Unable to export data";
      setExportError(errorMessage);
    } finally {
      setExportingRowId(null);
    }
  }, [getValue]);

  const handleDeleteClick = useCallback((id: string | number) => {
    setItemToDelete(id);
    setShowConfirmDialog(true);
  }, []);

  return (
    <Modal show={show} onHide={handleClose} size="xl">
      <Modal.Header closeButton>
        <Modal.Title className="d-flex align-items-center gap-3">
          {getValue('Conflict_Declaration_History')}
          <span className="badge bg-warning text-dark">{totalCount}</span>
          <button
            type="button"
            className="btn-add-main add-button"
            onClick={handleExport}
            disabled={data.length === 0 || exporting}
            style={{ height: '40px', marginTop: '0', fontSize: '14px' }}
          >
            {exporting
              ? getValue("exporting") || "Exporting..."
              : getValue("export_to_excel") || "Export to Excel"}
          </button>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <SharedTable
          data={data}
          setData={setData}
          columns={[
            {
              key: "changedInfo",
              label: getValue("Changed_Info")
            },
            { key: "descriptionText", label: getValue("Conflict_Declaration_Text") },
            { key: "recurrence", label: getValue("Recurrence_Months") },
            {
              key: "recurrenceDayMonth",
              label: getValue("Recurrence_Day_Month")
            }
            ,
            { key: "notificationMessage", label: getValue("Notification_Message") },
            { key: "actions", label: getValue("Actions") || "Actions" },
          ]}
          customCellRender={(col, item) => {
            if (col.key === "actions") {
              return (
                <td key={`actions-${item.id}`}>
                  <div className="d-flex align-items-center gap-2">
                    <button
                      type="button"
                      className="btn-add-main add-button"
                      onClick={() => handleExportViewers(item.id)}
                      disabled={exportingRowId === item.id}
                      style={{ height: '36px', marginTop: '0', fontSize: '13px', whiteSpace: 'nowrap' }}
                    >
                      {exportingRowId === item.id
                        ? getValue("exporting") || "Exporting..."
                        : getValue("export_to_excel") || "Export to Excel"}
                    </button>
                    <div
                      title={getValue("delete") || "Delete"}
                      onClick={() => handleDeleteClick(item.id)}
                      style={{ cursor: 'pointer' }}
                    >
                      <SvgDeleteicon className="action-icon" width={20} height={20} />
                    </div>
                  </div>
                </td>
              );
            }
            return undefined;
          }}
          showEditIcon={false}
          onDelete={handleDeleteClick}
          showViewIcon={false}
          showDeleteIcon={true}
        />
        <TablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={totalCount}
          itemsPerPage={itemsPerPage}
          onItemsPerPageChange={setItemsPerPage}
        />
        {exportError && (
          <div className="alert alert-danger mt-3">{exportError}</div>
        )}
      </Modal.Body>
      {/* Shared Confirm Delete Dialog */}
      <ConfirmDialog
        size="lg"
        show={showConfirmDialog}
        onHide={handleCloseConfirmDialog}
        onConfirm={handleConfirmDelete}
        title={getValue("delete_confirmation")}
        message={getValue("are_you_sure_you_want_to_delete_this_record")}
        subMessage={getValue("this_action_cannot_be_undone")}
        confirmText={getValue("delete")}
        cancelText={getValue("cancel")}
        confirmVariant="danger"
        loading={deleteLoading}
        loadingText={getValue("deleting")}
      />
    </Modal>
  );
};

export default ConflictHistoryModal;
