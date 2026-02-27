import ConfirmDialog from "./components/common/ConfirmDialog/ConfirmDialog";
import PageHeaderActions from "./components/common/pageHeaderActions/pageheader-actions.component";
import { TablePagination } from "./components/common/pagination/Pagination";
import SharedTable from "./components/common/shard-table/shared-table";
import SvgSearchicon from "./components/icons/search-icon";
import { useLanguage } from "./context/languageContext";
import type { PlayerCard, PerformanceLevel } from "./types/card-control.type";
import { useCallback, useMemo, useState, useRef } from "react";
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
      const headers = ["Name (En)", "Name (Ar)", "Sport", "Number", "Position", "Country", "Performance", "Status"];
      const rows = data.map(p => [
        p.fullNameEn,
        p.fullNameAr,
        p.sport,
        p.playerNumber,
        p.position,
        p.country,
        p.performance,
        p.status ? "Active" : "Inactive"
      ]);

      const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
      const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", "players_export.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success(getValue("export_excel") + " " + getValue("success"));
    } catch (error) {
      toast.error(getValue("unable_to_export"));
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      toast.info(`${getValue("import_excel")}: ${file.name}`);
      e.target.value = "";
    }
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
      case "orderIndex":
        return <td key={col.key}>{data.indexOf(player) + 1}</td>;

      case "player":
        return (
          <td key={col.key}>
            <div className="employee-info">
              <div className="avatar">
                <img src={player.photoUrl || ""} alt={player.fullNameEn} />
              </div>
              <div className="employee-details">
                <p className="name">{language === 'ar' ? player.fullNameAr : player.fullNameEn}</p>
              </div>
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
    { key: "orderIndex", label: getValue("#") },
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
              <Dropdown as={ButtonGroup}>
                <Button variant="outline-secondary" className="main-button" onClick={handleExportExcel}>
                  <FileIcon className="me-2" />
                  {getValue("excel")}
                </Button>
                <Dropdown.Toggle split variant="outline-secondary" id="dropdown-split-basic" className="main-button" />
                <Dropdown.Menu>
                  <Dropdown.Item onClick={handleImportClick}>{getValue("import_excel")}</Dropdown.Item>
                  <Dropdown.Item onClick={handleExportExcel}>{getValue("export_excel")}</Dropdown.Item>
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
