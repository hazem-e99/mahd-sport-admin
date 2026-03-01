import { Modal, OverlayTrigger, Spinner, Tooltip, Dropdown } from "react-bootstrap";
import "./UploadModal.scss";
import { useRef, useState, useEffect, type Dispatch, type SetStateAction } from "react";
import { type FieldValues, type UseFormClearErrors, type UseFormSetValue, type UseFormTrigger } from "react-hook-form";
import type { FileItem } from "../../types/file.type";
import { getVisibility } from "../../types/file.type";
import { UploadFile } from "@/api/services/UploadFile";
import { useDebounce } from "@/components/hooks/useDebounce";
import { useLanguage } from "../../context/languageContext";
import FolderIcon from "../../components/icons/FolderIcon";
import FileIcon from "../../components/icons/FileIcon";
import AddFolderIcon from "../../components/icons/AddFolderIcon";
import UploadIcon from "../../components/icons/UploadIcon";
import { toast } from "react-toastify";
import ConfirmDialog from "../../components/common/ConfirmDialog/ConfirmDialog";
import PermissionsSidebar from "./PermissionsSidebar";
import { useCurrentUser } from "@/hooks";

interface UploadModalProps {
  show: boolean;
  handleClose: () => void;
  setFileName: Dispatch<SetStateAction<string>>;
  setValue: UseFormSetValue<FieldValues>;
  clearErrors: UseFormClearErrors<FieldValues>;
  trigger: UseFormTrigger<FieldValues>;
  name: string;
  accept?: string;
}

const UploadModal = ({
  show,
  handleClose,
  setFileName,
  setValue,
  clearErrors,
  trigger,
  name,
  accept = "image/*",
}: UploadModalProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const modalBodyRef = useRef<HTMLDivElement>(null);
  const { getValue } = useLanguage();
  const { user } = useCurrentUser();
  const [isUploading, setIsUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [allFiles, setAllFiles] = useState<FileItem[]>([]);
  const [isLoadingFiles, setIsLoadingFiles] = useState(false);

  const [searchResults, setSearchResults] = useState<FileItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // File explorer state
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [breadcrumb, setBreadcrumb] = useState<
    Array<{ id: string | null; name: string }>
  >([{ id: null, name: "Root" }]);
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);

  // Selection state
  const [selectedItems, setSelectedItems] = useState<FileItem[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);

  // Confirmation dialog state
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Drag and drop state
  const [draggedItem, setDraggedItem] = useState<FileItem | null>(null);
  const [isDragOver, setIsDragOver] = useState<string | null>(null);
  const [isMoving, setIsMoving] = useState(false);

  // Permissions sidebar state
  const [showPermissionsSidebar, setShowPermissionsSidebar] = useState(false);
  const [permissionsItem, setPermissionsItem] = useState<FileItem | null>(null);

  // File preview state
  const [showPreview, setShowPreview] = useState(false);
  const [previewItem, setPreviewItem] = useState<FileItem | null>(null);

  // Manage Permissions mode state
  const [managePermissionsEnabled, setManagePermissionsEnabled] = useState(false);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Handle search API call
  const handleSearch = async (keyword: string) => {
    if (!keyword.trim()) {
      setSearchResults([]);
      setHasSearched(false);
      return;
    }

    setIsSearching(true);
    try {
      const response = await UploadFile.searchFile(keyword);
      setSearchResults(response.data || []);
      setHasSearched(true);
    } catch (error) {
      setSearchResults([]);
      setHasSearched(true);
    } finally {
      setIsSearching(false);
    }
  };

  // Close confirmation dialog
  const handleCloseConfirmDialog = () => {
    setShowConfirmDialog(false);
  };

  // Execute actual deletion after confirmation
  const handleConfirmDelete = async () => {
    try {
      setDeleteLoading(true);
      setIsDeleting(true);

      for (const item of selectedItems) {
        await UploadFile.deleteFile(item.id);
      }

      // Reset selected items and refresh folder
      setSelectedItems([]);
      fetchFilesForFolder(currentFolderId);

      // Show success message
      toast.success(getValue("files_deleted_successfully"));
    } catch (error: any) {
      const message =
        error?.response?.data?.title ||
        error?.response?.data?.message ||
        getValue("error_deleting_files");
      toast.error(message);
    } finally {
      setDeleteLoading(false);
      setIsDeleting(false);
      setShowConfirmDialog(false);
    }
  };

  // Move file/folder to new parent using upload + delete approach
  const moveItem = async (item: FileItem, newParentId: string | null) => {
    try {
      setIsMoving(true);
      // For folders, use the original moveFile API
      await UploadFile.moveFile(item.id, newParentId);
      toast.success(getValue("item_moved_successfully"));
      fetchFilesForFolder(currentFolderId);
    } catch (error: any) {
      const message =
        error.response?.data?.title ||
        error.response?.data?.message ||
        "Failed to move item";
      toast.error(message);
    } finally {
      setIsMoving(false);
    }
  };

  // Drag event handlers
  const handleDragStart = (e: React.DragEvent, item: FileItem) => {
    if (isDeleting || isMoving) {
      e.preventDefault();
      return;
    }
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", item.id);
  };

  const handleDragOver = (e: React.DragEvent, targetItem?: FileItem) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";

    if (targetItem?.type === "Folder") {
      setIsDragOver(targetItem.id);
    } else if (targetItem?.type === "File") {
      // Don't show drop target for files, but don't prevent the event
      setIsDragOver(null);
    } else {
      // Allow drop on current folder (breadcrumb area)
      setIsDragOver("current-folder");
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    // Only clear drag over if we're actually leaving the drop zone
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;

    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      setIsDragOver(null);
    }
  };

  const handleDrop = async (e: React.DragEvent, targetItem?: FileItem) => {
    e.preventDefault();
    setIsDragOver(null);

    if (!draggedItem) return;

    let targetFolderId: string | null = null;

    if (targetItem?.type === "Folder") {
      // Dropping on a folder
      targetFolderId = targetItem.id;

      // Prevent dropping folder into itself
      if (draggedItem.id === targetFolderId) {
        toast.error(getValue("cannot_move_folder_into_itself"));
        setDraggedItem(null);
        return;
      }
    } else if (targetItem?.type === "File") {
      // Show toast when trying to move to a file
      toast.error(getValue("cannot_move_to_file"));
      setDraggedItem(null);
      return;
    } else {
      // Dropping on current folder background
      targetFolderId = currentFolderId;
    }

    // Prevent dropping item into its current location
    if (draggedItem.parentId === targetFolderId) {
      setDraggedItem(null);
      return;
    }

    await moveItem(draggedItem, targetFolderId);
    setDraggedItem(null);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setIsDragOver(null);
  };

  // Effect to trigger search when debounced term changes
  useEffect(() => {
    handleSearch(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  // Reset search when modal closes
  useEffect(() => {
    if (!show) {
      setSearchTerm("");
      setSearchResults([]);
      setHasSearched(false);
      setCurrentFolderId(null);
      setBreadcrumb([{ id: null, name: "Root" }]);
      setShowCreateFolder(false);
      setNewFolderName("");
      setSelectedItems([]);
      setDraggedItem(null);
      setIsDragOver(null);
    }
  }, [show]);

  // Fetch files for current folder
  const fetchFilesForFolder = async (folderId: string | null = null) => {
    setIsLoadingFiles(true);
    try {
      let response;
      if (folderId) {
        response = await UploadFile.getFolderContents(folderId);
      } else {
        response = await UploadFile.getAll();
      }
      // Filter files that belong to current folder
      const filteredFiles = (response.data || []).filter(
        (file: FileItem) => file.parentId === folderId
      );
      setAllFiles(filteredFiles);
    } catch {
      setAllFiles([]);
    } finally {
      setIsLoadingFiles(false);
    }
  };

  useEffect(() => {
    if (show) {
      fetchFilesForFolder(currentFolderId);
    }
  }, [show, currentFolderId]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    setIsUploading(true);

    try {
      if (file) {
        setIsUploading(true);
        // Pass current folder ID and set Visibility = 0
        const res = await UploadFile.uploadFile(
          file,
          currentFolderId || undefined,
          0
        );

        setFileName(file ? file.name : "");
        // Refresh current folder to show the newly uploaded file
        fetchFilesForFolder(currentFolderId);

        if (name) {
          // Set value without validation to prevent blocking
          setValue(name, res.data?.path, { shouldValidate: false });
          if (file) clearErrors(name);
          handleClose();
          // Trigger validation asynchronously after modal closes to prevent UI freeze
          // Using requestIdleCallback if available, otherwise setTimeout for better performance
          if (typeof requestIdleCallback !== 'undefined') {
            requestIdleCallback(async () => {
              try {
                await trigger(name);
              } catch (error) {
                // Silently handle validation errors to prevent UI blocking
                console.error("Validation error:", error);
              }
            }, { timeout: 1000 });
          } else {
            // Fallback for browsers without requestIdleCallback
            setTimeout(async () => {
              try {
                await trigger(name);
              } catch (error) {
                console.error("Validation error:", error);
              }
            }, 100);
          }
        }
      }
    } catch (error: any) {
      const message =
        error.response?.data?.title ||
        `${error.response?.data?.message || error.response?.data?.Message} ${error.response?.data?.errors?.[0]?.description
        }`;
      toast.error(message);
      setIsUploading(false);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileButtonClick = () => {
    fileInputRef.current?.click();
  };

  // Handle folder navigation
  const handleFolderClick = (folder: FileItem) => {
    if (folder.type === "Folder") {
      setCurrentFolderId(folder.id);
      setBreadcrumb((prev) => [
        ...prev,
        { id: folder.id, name: folder.fileName },
      ]);
    }
  };

  // Handle breadcrumb navigation
  const handleBreadcrumbClick = (index: number) => {
    const targetBreadcrumb = breadcrumb[index];
    setCurrentFolderId(targetBreadcrumb.id);
    setBreadcrumb((prev) => prev.slice(0, index + 1));
  };

  // Handle folder creation
  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;

    setIsCreatingFolder(true);
    try {
      await UploadFile.createFolder(
        newFolderName,
        currentFolderId || undefined
      );
      setNewFolderName("");
      setShowCreateFolder(false);
      fetchFilesForFolder(currentFolderId);
    } catch {
      // Folder creation failed silently
    } finally {
      setIsCreatingFolder(false);
    }
  };

  // Handle item click (file or folder) - behavior depends on managePermissionsEnabled
  const handleItemClick = (item: FileItem) => {
    if (isDeleting || isMoving || draggedItem) return; // Prevent interaction while operations are running

    // If Manage Permissions is DISABLED and it's a file, directly select it (add behavior)
    if (!managePermissionsEnabled && item.type !== "Folder") {
      handleSelectFile(item);
      return;
    }

    // If Manage Permissions is ENABLED or it's a folder, just select/deselect in place
    const isCurrentlySelected = isItemSelected(item);
    if (isCurrentlySelected) {
      // If clicking on already selected item, deselect it
      setSelectedItems([]);
    } else {
      // Select only this item (replace previous selection)
      setSelectedItems([item]);
    }
  };

  // Handle item selection (for double click or select button)
  const handleSelectFile = async (item: FileItem) => {
    if (name) {
      // Set value without validation to prevent blocking
      setValue(name, item.filePath, { shouldValidate: false });
      setFileName(item.fileName);
      clearErrors(name);
      // Close the modal first to allow UI to update
      handleClose();
      // Trigger validation asynchronously after modal closes to prevent UI freeze
      // Using requestIdleCallback if available, otherwise setTimeout for better performance
      if (typeof requestIdleCallback !== 'undefined') {
        requestIdleCallback(async () => {
          try {
            await trigger(name);
          } catch (error) {
            // Silently handle validation errors to prevent UI blocking
            console.error("Validation error:", error);
          }
        }, { timeout: 1000 });
      } else {
        // Fallback for browsers without requestIdleCallback
        setTimeout(async () => {
          try {
            await trigger(name);
          } catch (error) {
            console.error("Validation error:", error);
          }
        }, 100);
      }
    }
  };

  // Handle double click - navigate into folder or select file (only when Manage Permissions is enabled)
  const handleItemDoubleClick = (item: FileItem) => {
    if (isDeleting || isMoving || draggedItem) return;
    if (item.type === "Folder") {
      // Double click on folders always navigates into them
      handleFolderClick(item);
    } else if (managePermissionsEnabled) {
      // Double click on files only works when Manage Permissions is enabled
      // This allows selecting the file when in permissions mode
      handleSelectFile(item);
    }
    // When Manage Permissions is disabled, double click on files does nothing
    // because single click already adds the file
  };

  // Handle closing preview
  const handleClosePreview = () => {
    setShowPreview(false);
    setPreviewItem(null);
  };

  // Handle item selection/deselection
  const handleItemSelection = (item: FileItem, event: React.MouseEvent) => {
    event.stopPropagation();

    const isCurrentlySelected = isItemSelected(item);

    if (isCurrentlySelected) {
      setSelectedItems((prev) =>
        prev.filter((selectedItem) => selectedItem.id !== item.id)
      );
    } else {
      setSelectedItems((prev) => [...prev, item]);
    }
  };

  // Check if item is selected
  const isItemSelected = (item: FileItem) => {
    return selectedItems.some((selectedItem) => selectedItem.id === item.id);
  };

  // Check if a file matches the accepted type; folders always pass
  const fileMatchesAccept = (item: FileItem): boolean => {
    if (item.type === "Folder") return true;
    if (!accept || accept === "*" || accept === "*/*") return true;
    const ext = (item.extension || "").toLowerCase().replace(/^\./, "");
    const mime = (item.contentType || "").toLowerCase();
    return accept.split(",").some((token) => {
      const t = token.trim().toLowerCase().replace(/^\s+/, "");
      if (t.startsWith(".")) return ext === t.slice(1);
      if (t.endsWith("/*")) return mime.startsWith(t.slice(0, -1));
      return mime === t;
    });
  };

  const itemsToShow = (hasSearched ? searchResults : allFiles).filter(fileMatchesAccept);

  return (
    <>
      <Modal show={show} onHide={handleClose} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <div className="header_modal">
              <h3> {getValue("upload_file")} </h3>
            </div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="modal_body">
            <div className="breadcrumb-navigation mb-3">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                  {breadcrumb.map((crumb, index) => (
                    <li
                      key={`${crumb.id}-${index}`}
                      className={`breadcrumb-item ${index === breadcrumb.length - 1 ? "active" : ""
                        }`}
                    >
                      {index === breadcrumb.length - 1 ? (
                        crumb.name
                      ) : (
                        <button
                          type="button"
                          className="btn btn-link p-0 text-decoration-none"
                          onClick={() => handleBreadcrumbClick(index)}
                        >
                          {crumb.name}
                        </button>
                      )}
                    </li>
                  ))}
                </ol>
              </nav>
            </div>

            <div className="modal_filter_search d-flex justify-content-between align-items-center">
              <div className="search_input">
                <div className="mb-3 input-group">
                  <input
                    type="search"
                    placeholder={getValue("search_for_file")}
                    className="main-input form-control"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    disabled={isLoadingFiles || isDeleting || isMoving}
                  />
                  {isSearching && (
                    <div className="input-group-append">
                      <span className="input-group-text h-full">
                        <Spinner animation="border" size="sm" />
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div className="tn_upload d-flex gap-2 align-items-center">
                {/* Manage Permissions Toggle Button */}
                {(user?.showMangeCMS || user?.showManageCMS) && (
                  <button
                    className={`main-button permissions-toggle ${managePermissionsEnabled ? 'active' : ''}`}
                    onClick={() => setManagePermissionsEnabled(!managePermissionsEnabled)}
                    disabled={isDeleting || isMoving}
                    title={getValue("manage_permissions") || "Manage Permissions"}
                  >
                    <img src="/icons/shield.svg" alt="permissions" className="permissions-icon" />
                    {getValue("manage_permissions") || "Manage Permissions"}
                  </button>
                )}
                <button
                  className="main-button"
                  onClick={() => setShowCreateFolder(true)}
                  disabled={isCreatingFolder || isDeleting || isMoving}
                >
                  <AddFolderIcon />
                  {getValue("create_folder")}
                </button>
                <button
                  className="main-button active"
                  onClick={handleFileButtonClick}
                  disabled={isUploading || isDeleting || isMoving}
                >
                  <UploadIcon />
                  {isUploading
                    ? `${getValue("upload")}...`
                    : `${getValue("upload")}`}

                  {isUploading && (
                    <Spinner animation="border" size="sm" className="mx-2" />
                  )}
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="d-none"
                  accept={accept}
                />
              </div>
            </div>

            {/* Create Folder Modal */}
            {showCreateFolder && (
              <div className="create-folder-input mb-3">
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control !rounded !w-full"
                    placeholder={getValue("folder_name")}
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === "Enter" && handleCreateFolder()
                    }
                  />
                  <div className="input-group-append">
                    <button
                      className="btn btn-primary"
                      onClick={handleCreateFolder}
                      disabled={isCreatingFolder || !newFolderName.trim()}
                    >
                      {isCreatingFolder ? (
                        <Spinner animation="border" size="sm" />
                      ) : (
                        getValue("create")
                      )}
                    </button>
                    <button
                      className="btn btn-secondary"
                      onClick={() => {
                        setShowCreateFolder(false);
                        setNewFolderName("");
                      }}
                    >
                      {getValue("cancel")}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Drop zone indicator */}
            {isMoving && (
              <div className="mb-3 p-2 text-center bg-info text-white rounded">
                <Spinner animation="border" size="sm" className="me-2" />
                {getValue("moving_item")}
              </div>
            )}

            {/* Content area with files and sidebar */}
            <div className="content-area-wrapper" ref={modalBodyRef}>
              <div
                className={`modal_icons d-flex flex-wrap ${isDragOver === "current-folder" ? "drag-over" : ""
                  }`}
                onDragOver={(e) => handleDragOver(e)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e)}
              >
                {isLoadingFiles ? (
                  <div className="d-flex justify-content-center w-100">
                    <Spinner animation="border" />
                  </div>
                ) : itemsToShow?.length === 0 ? (
                  <div className="no-results">
                    <p>
                      {hasSearched
                        ? `${getValue("no_files_found")} "${searchTerm}"`
                        : getValue("no_files_available")}
                    </p>
                  </div>
                ) : (
                  itemsToShow?.map((item) => {
                    const isSelected = isItemSelected(item);
                    const isDraggedItem = draggedItem?.id === item.id;
                    const isDropTarget =
                      isDragOver === item.id && item.type === "Folder";

                    return (
                      <OverlayTrigger
                        key={item.id}
                        placement="bottom"
                        overlay={
                          <Tooltip id={`tooltip-${item.id}`} placement="bottom">
                            {item.fileName}{" "}
                            {item.type === "Folder"
                              ? "(Folder)"
                              : `(${item.extension || "File"})`}
                          </Tooltip>
                        }
                      >
                        <div
                          className={`icons_items ${item.type === "Folder" ? "folder-item" : "file-item"
                            } ${isSelected ? "selected" : ""} ${isDraggedItem ? "dragging" : ""
                            } ${isDropTarget ? "drop-target" : ""}`}
                          onClick={() => handleItemClick(item)}
                          onDoubleClick={() => handleItemDoubleClick(item)}
                          style={{
                            cursor:
                              isDeleting || isMoving ? "not-allowed" : "pointer",
                            position: "relative",
                            opacity: isDraggedItem ? 0.5 : 1,
                          }}
                          data-tooltip-id={`tooltip-${item.id}`}
                          draggable={!isDeleting && !isMoving}
                          onDragStart={(e) => handleDragStart(e, item)}
                          onDragEnd={handleDragEnd}
                          onDragOver={(e) =>
                            item.type === "Folder"
                              ? handleDragOver(e, item)
                              : handleDragOver(e, item)
                          }
                          onDragLeave={handleDragLeave}
                          onDrop={(e) => handleDrop(e, item)}
                        >
                          {/* Three dots menu for all items - only show when Manage Permissions is enabled */}
                          {managePermissionsEnabled && (
                            <Dropdown
                              className="item-menu"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Dropdown.Toggle
                                variant="link"
                                id={`dropdown-${item.id}`}
                                className="menu-toggle"
                              >
                                <img src="/icons/threedots.svg" alt="menu" className="three-dots-icon" />
                              </Dropdown.Toggle>
                              <Dropdown.Menu>
                                <Dropdown.Item
                                  onClick={() => {
                                    setPermissionsItem(item);
                                    setShowPermissionsSidebar(true);
                                  }}
                                  className="permissions-item"
                                >
                                  <img src="/icons/shield.svg" alt="permissions" className="menu-icon" />
                                  {getValue("permissions")}
                                </Dropdown.Item>
                                {item.type !== "Folder" && (
                                  <Dropdown.Item
                                    onClick={() => {
                                      setPreviewItem(item);
                                      setShowPreview(true);
                                    }}
                                    className="preview-item"
                                  >
                                    <img src="/icons/eye.icon.svg" alt="preview" className="menu-icon" />
                                    {getValue("preview") || "Preview"}
                                  </Dropdown.Item>
                                )}
                                <Dropdown.Divider />
                                <Dropdown.Item
                                  onClick={() => {
                                    setSelectedItems([item]);
                                    setShowConfirmDialog(true);
                                  }}
                                  className="delete-item"
                                >
                                  <img src="/icons/trash.icon.svg" alt="delete" className="menu-icon delete-icon" />
                                  {getValue("delete") || "Delete"}
                                </Dropdown.Item>
                              </Dropdown.Menu>
                            </Dropdown>
                          )}

                          {/* Only show checkbox for files, not folders */}
                          {item.type !== "Folder" && (
                            <div className="item-checkbox">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => { }} // Dummy handler to prevent React warning
                                onClick={(e) => handleItemSelection(item, e)}
                              />
                            </div>
                          )}
                          {item.type === "Folder" ? (
                            <div className="folder-icon">
                              {/* Visibility badge - only show when Manage Permissions is enabled */}
                              {managePermissionsEnabled && (
                                <div className="visibility-badge">
                                  <img
                                    src={getVisibility(item) === 1 ? "/icons/restricted-icon.svg" : "/icons/public-icon.svg"}
                                    alt={getVisibility(item) === 1 ? "restricted" : "public"}
                                    className="badge-icon"
                                  />
                                </div>
                              )}
                              <FolderIcon />
                            </div>
                          ) : (
                            <div className="file-preview">
                              {/* Visibility badge - only show when Manage Permissions is enabled */}
                              {managePermissionsEnabled && (
                                <div className="visibility-badge">
                                  <img
                                    src={getVisibility(item) === 1 ? "/icons/restricted-icon.svg" : "/icons/public-icon.svg"}
                                    alt={getVisibility(item) === 1 ? "restricted" : "public"}
                                    className="badge-icon"
                                  />
                                </div>
                              )}
                              {item.contentType?.startsWith("image/") ? (
                                <img
                                  src={item.filePath}
                                  alt={item.fileName}
                                  className="file-thumbnail"
                                  onError={(e) => {
                                    e.currentTarget.style.display = "none";
                                    if (e.currentTarget.nextElementSibling) {
                                      (e.currentTarget
                                        .nextElementSibling as HTMLElement).style.display =
                                        "block";
                                    }
                                  }}
                                />
                              ) : null}
                              <div
                                className="file-icon"
                                style={{
                                  display: item.contentType?.startsWith("image/")
                                    ? "none"
                                    : "block",
                                }}
                              >
                                <FileIcon />
                              </div>
                            </div>
                          )}
                          <h4 className="file-name">{item.fileName}</h4>
                        </div>
                      </OverlayTrigger>
                    );
                  })
                )}
              </div>

            </div>

            {/* Permissions Sidebar inside Modal */}
            <PermissionsSidebar
              show={showPermissionsSidebar}
              item={permissionsItem}
              onClose={() => {
                setShowPermissionsSidebar(false);
                setPermissionsItem(null);
              }}
              onUpdate={() => {
                fetchFilesForFolder(currentFolderId);
              }}
              container={modalBodyRef}
            />
          </div>
        </Modal.Body>
      </Modal>

      <ConfirmDialog
        show={showConfirmDialog}
        onHide={handleCloseConfirmDialog}
        onConfirm={handleConfirmDelete}
        title={getValue("delete_confirmation")}
        message={getValue("are_you_sure_you_want_to_delete_selected_files")}
        subMessage={getValue("this_action_cannot_be_undone")}
        confirmText={getValue("delete")}
        cancelText={getValue("cancel")}
        confirmVariant="danger"
        loading={deleteLoading}
        loadingText={getValue("deleting")}
        size="lg"
      />

      {/* File Preview Modal */}
      <Modal
        show={showPreview}
        onHide={handleClosePreview}
        centered
        size="xl"
        className="file-preview-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <div className="preview-header">
              <FileIcon />
              <span className="preview-filename">{previewItem?.fileName}</span>
            </div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="preview-container">
            {previewItem?.contentType?.startsWith("image/") ? (
              <img
                src={previewItem.filePath}
                alt={previewItem.fileName}
                className="preview-image"
              />
            ) : previewItem?.contentType?.startsWith("video/") ? (
              <video
                src={previewItem.filePath}
                controls
                className="preview-video"
              >
                {getValue("video_not_supported")}
              </video>
            ) : previewItem?.contentType?.startsWith("audio/") ? (
              <div className="preview-audio-container">
                <FileIcon />
                <audio src={previewItem.filePath} controls className="preview-audio">
                  {getValue("audio_not_supported")}
                </audio>
              </div>
            ) : previewItem?.contentType === "application/pdf" ? (
              <iframe
                src={previewItem.filePath}
                className="preview-pdf"
                title={previewItem.fileName}
              />
            ) : (
              <div className="preview-no-support">
                <FileIcon />
                <p>{getValue("preview_not_available")}</p>
                <p className="file-info">
                  {previewItem?.fileName} ({previewItem?.extension || getValue("unknown_type")})
                </p>
              </div>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button className="main-button active" onClick={handleClosePreview}>
            {getValue("close")}
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default UploadModal;
