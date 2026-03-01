import ConfirmDialog from "./components/common/ConfirmDialog/ConfirmDialog";
import PageHeaderActions from "./components/common/pageHeaderActions/pageheader-actions.component";
import { TablePagination } from "./components/common/pagination/Pagination";
import SharedTable from "./components/common/shard-table/shared-table";
import SvgSearchicon from "./components/icons/search-icon";
import { useLanguage } from "./context/languageContext";
import type { PlayerCard, PerformanceLevel } from "./types/card-control.type";
import { useCallback, useMemo, useState, useRef } from "react";
import { parseExcelFile } from "./utils/importExcel";
import type { ImportResult } from "./utils/importExcel";
import ImportPreviewModal from "./components/ImportPreviewModal/ImportPreviewModal";
import { Button, Dropdown, ButtonGroup } from "react-bootstrap";
import { toast } from "react-toastify";
import "./card-control.scss";
import { EyeIcon, Edit, FileIcon } from "@/components/icons";
import AddPlayerModal from "./components/AddPlayerModal/AddPlayerModal";
import CardDetails from "./cardControllerDetails/card-controller-details";
import ViewKPIModal from './components/ViewKPIModal/ViewKPIModal';

// Static Data for Players
const STATIC_PLAYERS: PlayerCard[] = [
  {
    id: "1",
    fullNameEn: "Ahmed Khalil",
    fullNameAr: "أحمد خليل",
    sport: "Football",
    playerNumber: "10",
    position: "Forward",
    country: "Saudi Arabia",
    countryCode: "SA",
    performance: "diamond",
    photoUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmed",
    status: true,
    orderIndex: 1,
    kpi: {
      cognition: 85,
      technical: 90,
      physical: 88,
      psychology: 82,
      medical: 95,
      skillVideoUrl: "https://www.w3schools.com/html/mov_bbb.mp4"
    }
  },
  {
    id: "2",
    fullNameEn: "Salem Al-Dawsari",
    fullNameAr: "سالم الدوسري",
    sport: "Football",
    playerNumber: "29",
    position: "Winger",
    country: "Saudi Arabia",
    countryCode: "SA",
    performance: "gold",
    photoUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Salem",
    status: true,
    orderIndex: 2,
    kpi: {
      cognition: 88,
      technical: 92,
      physical: 85,
      psychology: 90,
      medical: 88,
      skillVideoUrl: "https://www.w3schools.com/html/mov_bbb.mp4"
    }
  },
  {
    id: "3",
    fullNameEn: "Mohamed Kanno",
    fullNameAr: "محمد كنو",
    sport: "Football",
    playerNumber: "28",
    position: "Midfielder",
    country: "Saudi Arabia",
    countryCode: "SA",
    performance: "silver",
    photoUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mohamed",
    status: false,
    orderIndex: 3,
    kpi: {
      cognition: 80,
      technical: 85,
      physical: 92,
      psychology: 80,
      medical: 90,
      skillVideoUrl: "https://www.w3schools.com/html/mov_bbb.mp4"
    }
  }
];

const CardControl: React.FC = () => {
  const { language, getValue } = useLanguage();
  const [data, setData] = useState<PlayerCard[]>(STATIC_PLAYERS);
  const totalItems = STATIC_PLAYERS.length;
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingStatusChange, setPendingStatusChange] = useState<{ player: PlayerCard, newStatus: boolean } | null>(null);
  const [showKPIModal, setShowKPIModal] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerCard | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [showImportPreview, setShowImportPreview] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const handleStatusToggle = useCallback((player: PlayerCard, newStatus: boolean) => {
    setPendingStatusChange({ player, newStatus });
    setShowConfirmDialog(true);
  }, []);

  const confirmStatusChange = useCallback(() => {
    if (!pendingStatusChange) return;
    const { player, newStatus } = pendingStatusChange;

    setData(prev => prev.map(p => p.id === player.id ? { ...p, status: newStatus } : p));
    toast.success(`${getValue("status_updated_successfully")} ${player.fullNameEn}`);
    setShowConfirmDialog(false);
    setPendingStatusChange(null);
  }, [pendingStatusChange, getValue]);

  const handleViewKPI = (player: PlayerCard) => {
    setSelectedPlayer(player);
    setShowKPIModal(true);
  };

  const handleEditPlayer = useCallback((player: PlayerCard) => {
    setSelectedPlayer(player);
    setShowEditModal(true);
  }, []);

  const handleAddPlayer = () => {
    setSelectedPlayer(null);
    setShowAddModal(true);
  };

  const handleSavePlayer = (player: PlayerCard) => {
    if (selectedPlayer) {
      setData(prev => prev.map(p => p.id === player.id ? player : p));
      toast.success(getValue("changes_saved_successfully"));
    } else {
      setData(prev => [player, ...prev]);
      toast.success(getValue("added_successfully"));
    }
  };

  const handleExportExcel = () => {
    try {
      import("xlsx").then((XLSX) => {
        const rows = data.map((p, idx) => ({
          "#":               idx + 1,
          "Name (EN)":       p.fullNameEn,
          "Name (AR)":       p.fullNameAr,
          "Sport":           p.sport,
          "Player Number":   p.playerNumber,
          "Position":        p.position,
          "Country":         p.country,
          "Birth Year":      p.birthYear ?? "",
          "Location":        p.location ?? "",
          "Performance":     p.performance,
          "Status":          p.status ? "Active" : "Inactive",
          // KPI
          "KPI - Cognition":  p.kpi.cognition,
          "KPI - Technical":  p.kpi.technical,
          "KPI - Physical":   p.kpi.physical,
          "KPI - Psychology": p.kpi.psychology,
          "KPI - Medical":    p.kpi.medical,
          "Skill Video URL":  p.kpi.skillVideoUrl,
        }));

        const worksheet = XLSX.utils.json_to_sheet(rows);

        // Column widths
        worksheet["!cols"] = [
          { wch: 4 },  // #
          { wch: 30 }, // Name EN
          { wch: 30 }, // Name AR
          { wch: 14 }, // Sport
          { wch: 14 }, // Player Number
          { wch: 16 }, // Position
          { wch: 16 }, // Country
          { wch: 12 }, // Birth Year
          { wch: 14 }, // Location
          { wch: 14 }, // Performance
          { wch: 10 }, // Status
          { wch: 16 }, // Cognition
          { wch: 16 }, // Technical
          { wch: 16 }, // Physical
          { wch: 16 }, // Psychology
          { wch: 16 }, // Medical
          { wch: 30 }, // Skill Video
        ];

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Players");
        XLSX.writeFile(workbook, "players_export.xlsx");

        toast.success(getValue("export_excel") + " " + getValue("success"));
      });
    } catch (error) {
      toast.error(getValue("unable_to_export"));
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";

    setIsImporting(true);
    try {
      const result = await parseExcelFile(file);
      setImportResult(result);
      setShowImportPreview(true);
    } catch (err: any) {
      toast.error(err?.message ?? getValue("unable_to_export"));
    } finally {
      setIsImporting(false);
    }
  };

  const handleImportConfirm = (players: PlayerCard[], mode: "append" | "replace") => {
    if (mode === "replace") {
      setData(players);
    } else {
      setData(prev => [...prev, ...players]);
    }
    setShowImportPreview(false);
    setImportResult(null);
    toast.success(`${players.length} players imported successfully.`);
  };

  const getPerformanceBadge = (level: PerformanceLevel) => {
    const colors: Record<PerformanceLevel, string> = {
      diamond: "#b9f2ff",
      gold: "#ffd700",
      silver: "#c0c0c0"
    };
    return (
      <span className="badge" style={{ backgroundColor: colors[level], color: "#000", fontWeight: "bold", textTransform: "capitalize" }}>
        {getValue(level) || level}
      </span>
    );
  };

  const customCellRender = useCallback((col: any, player: PlayerCard) => {
    switch (col.key) {
      case "playerImg":
        return (
          <td key={col.key}>
            <div className="player-avatar-cell">
              <img
                src={player.photoUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${player.fullNameEn}`}
                alt={player.fullNameEn}
                className="player-avatar-img"
              />
            </div>
          </td>
        );

      case "player":
        return (
          <td key={col.key}>
            <div className="employee-details">
              <p className="name">{language === 'ar' ? player.fullNameAr : player.fullNameEn}</p>
            </div>
          </td>
        );

      case "sport":
        return <td key={col.key}>{player.sport}</td>;

      case "playerNumber":
        return <td key={col.key}>{player.playerNumber}</td>;

      case "position":
        return <td key={col.key}>{player.position}</td>;

      case "country":
        return <td key={col.key}>{player.country}</td>;

      case "performance":
        return <td key={col.key}>{getPerformanceBadge(player.performance)}</td>;

      case "status":
        return (
          <td key={col.key}>
            <div className="custom-status-switch">
              <input
                type="checkbox"
                id={`status-switch-${player.id}`}
                checked={player.status}
                onChange={(e) => handleStatusToggle(player, e.target.checked)}
                className="switch-input"
              />
              <label htmlFor={`status-switch-${player.id}`} className="switch-label">
                <span className="switch-text">{player.status ? getValue("show") : getValue("hide")}</span>
              </label>
            </div>
          </td>
        );

      case "actions":
        return (
          <td key={col.key}>
            <div className="d-flex gap-2 align-items-center">
              <button
                className="btn btn-link p-0"
                onClick={() => handleViewKPI(player)}
                title={getValue("view_kpi")}
              >
                <EyeIcon />
              </button>
              <button
                className="btn btn-link p-0"
                onClick={() => handleEditPlayer(player)}
                title={getValue("player_details")}
              >
                <Edit />
              </button>
            </div>
          </td>
        );

      default:
        return undefined;
    }
  }, [data, language, getValue, handleStatusToggle]);

  const columns = useMemo(() => [
    { key: "playerImg", label: getValue("player_img") },
    { key: "player", label: getValue("player_name") },
    { key: "sport", label: getValue("sport") },
    { key: "playerNumber", label: getValue("player_number") },
    { key: "position", label: getValue("position") },
    { key: "country", label: getValue("country") },
    { key: "performance", label: getValue("performance") },
    { key: "status", label: getValue("status") },
    { key: "actions", label: getValue("actions") }
  ], [getValue]);

  return (
    <>
      <PageHeaderActions
        title={getValue("card_controller")}
        showBtns={false}
        breadcrumb={
          <ul className="menu-breadcrumb">
            <li>{getValue("home")}</li>
            <li>-</li>
            <li>{getValue("card_controller_list")}</li>
          </ul>
        }
      />

      <div className="card-control-page">
        <div className="card bg-white border-0 rounded-3">
          <div className="card-header bg-white py-4 d-flex justify-content-between align-items-center flex-wrap gap-3">
            <h1>
              {getValue("all_cards")} <span className="badge">{totalItems}</span>
            </h1>
            <div className="d-flex gap-2">
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                onChange={handleFileChange}
              />
              <Dropdown as={ButtonGroup} className="excel-split-dropdown">
                <Button variant="light" className="excel-main-btn" onClick={handleExportExcel}>
                  <span className="excel-btn-label">{getValue("excel")}</span>
                </Button>
                <Dropdown.Toggle split variant="light" id="dropdown-split-excel" className="excel-toggle-btn" />
                <Dropdown.Menu className="excel-dropdown-menu">
                  <Dropdown.Item onClick={handleImportClick} disabled={isImporting} className="excel-menu-item">
                    <span className="menu-item-icon upload">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 15V3M12 3L8 7M12 3L16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M3 17V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    </span>
                    <span>{isImporting ? "Importing..." : getValue("import_excel")}</span>
                  </Dropdown.Item>
                  <Dropdown.Item onClick={handleExportExcel} className="excel-menu-item">
                    <span className="menu-item-icon download">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 3V15M12 15L8 11M12 15L16 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M3 17V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    </span>
                    <span>{getValue("export_excel")}</span>
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              <Button className="main-button active" onClick={handleAddPlayer}>
                + {getValue("add_player")}
              </Button>
            </div>
          </div>

          <div className="card-body p-0">
            <div className="filter-container flex-wrap py-4 p-3">
              <div className="search-box">
                <div className="flex-grow-1 position-relative">
                  <span className="search-box-icon"><SvgSearchicon /></span>
                  <input
                    type="text"
                    className="form-control search-box-input"
                    placeholder={getValue("search_here")}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="table-wrapper">
              <SharedTable
                data={data}
                setData={setData as any}
                columns={columns}
                customCellRender={customCellRender}
                showEditIcon={false}
                emptyMessage={getValue("no_results_found")}
              />
            </div>
          </div>
        </div>
      </div>

      <TablePagination
        currentPage={currentPage}
        totalPages={1}
        onPageChange={setCurrentPage}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onItemsPerPageChange={setItemsPerPage}
      />

      <ViewKPIModal
        show={showKPIModal}
        onHide={() => setShowKPIModal(false)}
        player={selectedPlayer}
      />

      <AddPlayerModal
        show={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleSavePlayer}
        player={null}
      />

      <CardDetails
        show={showEditModal}
        setShow={setShowEditModal}
        employee={selectedPlayer}
        onEmployeeUpdated={(updatedPlayer) => {
          handleSavePlayer(updatedPlayer);
        }}
      />

      <ImportPreviewModal
        show={showImportPreview}
        result={importResult}
        onConfirm={handleImportConfirm}
        onHide={() => { setShowImportPreview(false); setImportResult(null); }}
      />

      <ConfirmDialog
        show={showConfirmDialog}
        onHide={() => setShowConfirmDialog(false)}
        onConfirm={confirmStatusChange}
        title={getValue("confirm_status_change")}
        message={`${getValue("change_status_for")} "${pendingStatusChange?.player.fullNameEn}"?`}
        confirmVariant="primary"
      />
    </>
  );
};

export default CardControl;
