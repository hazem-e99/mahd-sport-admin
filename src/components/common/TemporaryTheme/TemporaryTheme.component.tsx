import { useCallback, useEffect, useMemo, useState } from "react";
import SharedTable from "@/components/common/shard-table/shared-table";
import SvgSearchicon from '@/components/icons/search-icon';
import { TablePagination } from "@/components/common/pagination/Pagination";
import ConfirmDialog from '@/components/common/ConfirmDialog/ConfirmDialog';
import TemporaryThemeOverrideFormModal from "./TemporaryThemeOverrideFormModal";
import { toast } from "react-toastify";
import { TemporaryThemeOverrideService } from "@/api/services/TemporaryThemeOverride.Service";
import { useLanguage } from "@/context/languageContext";

const INITIAL_PAGE = 1;
const INITIAL_ITEMS_PER_PAGE = 10;

const TemporaryThemeOverridesPage = () => {
  const { getValue } = useLanguage();
  const [data, setData] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(INITIAL_PAGE);
  const [itemsPerPage, setItemsPerPage] = useState(INITIAL_ITEMS_PER_PAGE);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any | null>(null);

  const fetchOverrides = useCallback(async () => {
    try {
      setLoading(true);
      const response = await TemporaryThemeOverrideService.getAllOverrides({
        pageNumber: currentPage,
        pageSize: itemsPerPage,
        holidayName: searchTerm.trim(),
      });
      const enriched = response.data.map((item) => ({
        ...item,
        changedInfo: (
          <div>
            <strong>{item.userName ?? "System"}</strong>
            <div style={{ fontSize: '12px', color: '#666' }}>
              {item.createdOn ? new Date(item.createdOn).toLocaleString() : ''}
            </div>
          </div>
        ),
      }));
      setData(enriched);
      setTotalItems(response.totalCount);
    } catch (err) {
      toast.error("Error fetching data" + err);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage, searchTerm]);

  useEffect(() => {
    fetchOverrides();
  }, [fetchOverrides]);

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(INITIAL_PAGE);
  }, []);

  const handleItemsPerPageChange = useCallback((newSize: number) => {
    setItemsPerPage(newSize);
    setCurrentPage(INITIAL_PAGE);
  }, []);

  const handleEditIconClick = useCallback((item: any) => {
    setSelectedRow(item);
    setShowModal(true);
  }, []);

  const handleDeleteClick = useCallback((id: string | number) => {
    setItemToDelete(id.toString());
    setShowConfirmDialog(true);
  }, []);

  const handleCloseConfirmDialog = useCallback(() => {
    setItemToDelete(null);
    setShowConfirmDialog(false);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!itemToDelete) return;
    setDeleteLoading(true);
    try {
      await TemporaryThemeOverrideService.deleteOverride(itemToDelete);
      toast.success("Deleted successfully");
      setCurrentPage(INITIAL_PAGE);
      fetchOverrides();
    } catch {
      toast.error("Failed to delete");
    } finally {
      setDeleteLoading(false);
      setShowConfirmDialog(false);
      setItemToDelete(null);
    }
  }, [itemToDelete, fetchOverrides]);


  const columns = useMemo(() => [
    { key: "holidayName", label: getValue("Holiday_Name") },
    { key: "startDateTime", label: getValue("Start_Date_Time") },
    { key: "endDateTime", label: getValue("End_Date_Time") },
    { key: "changedInfo", label: getValue("Changed_Info") },
    { key: "actions", label: getValue("actions") },
  ], [getValue]);

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <>
      <div className="d-flex justify-content-between align-items-center flex-wrap mb-3">
        <div className="d-flex align-items-center">
          <h3 className="me-2"> {getValue("Temporary_Theme_Override")}</h3>
          <span className="badge bg-warning text-dark">{totalItems}</span>
        </div>

        <div className="d-flex align-items-center gap-2">


          <button
            className="main-button active"
            onClick={() => {
              setSelectedRow(null);
              setShowModal(true);
            }}
          >
            <span className="m-2">+</span>  {getValue("Add-New")}
          </button>
        </div>
      </div>


      <div className="tab-configurations-page">
        <div className="card bg-white border-0 rounded-3">


          <div className="card-body p-0">
            <div className="filter-container flex-wrap py-4 p-3">
              <div className="search-box">
                <div className="flex-grow-1 position-relative">
                  <span className="search-box-icon"><SvgSearchicon /></span>
                  <input
                    type="text"
                    className="form-control search-box-input"
                    placeholder={getValue("Search_by_holiday_name")}
                    value={searchTerm}
                    onChange={handleSearch}
                  />
                </div>
              </div>
            </div>

            <div className="table-wrapper">
              <SharedTable
                customCellRender={(col: any, item: any) => {
                  if (col.key === 'startDateTime' || col.key === 'endDateTime') {
                    return <td key={col.key}>{item[col.key] ? new Date(item[col.key]).toLocaleString() : '-'}</td>;
                  }
                  return undefined;
                }}
                data={data}
                setData={setData}
                columns={columns}
                showEditIcon={true}
                showDeleteIcon={true}
                handleEditIconClick={handleEditIconClick}
                onDelete={handleDeleteClick}
                pending={loading}
              />
            </div>
          </div>
        </div>
      </div>

      {totalItems > 0 && (
        <TablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onItemsPerPageChange={handleItemsPerPageChange}
        />
      )}

      <ConfirmDialog
        size="lg"
        show={showConfirmDialog}
        onHide={handleCloseConfirmDialog}
        onConfirm={handleConfirmDelete}
        title="Delete Confirmation"
        message="Are you sure you want to delete this override?"
        subMessage="This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="danger"
        loading={deleteLoading}
        loadingText="Deleting..."
      />

      {showModal && (
        <TemporaryThemeOverrideFormModal
          show={showModal}
          onClose={() => setShowModal(false)}
          onSuccess={fetchOverrides}
          initialData={selectedRow}
        />
      )}
    </>
  );
};

export default TemporaryThemeOverridesPage;
