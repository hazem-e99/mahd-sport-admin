import { useState, useEffect } from "react";
import { Offcanvas, Spinner, Button } from "react-bootstrap";
import Select from "react-select";
import { toast } from "react-toastify";
import type { FileItem } from "../../types/file.type";
import { getVisibility, getAllowedRoleIds } from "../../types/file.type";
import { UploadFile } from "@/api/services/UploadFile";
import { RoleService } from "@/api/services/RoleService";
import { useLanguage } from "../../context/languageContext";
import "./PermissionsSidebar.scss";

interface PermissionsSidebarProps {
  show: boolean;
  item: FileItem | null;
  onClose: () => void;
  onUpdate: () => void;
  container?: React.RefObject<HTMLDivElement | null>;
}

interface RoleOption {
  value: string;
  label: string;
}

const PermissionsSidebar: React.FC<PermissionsSidebarProps> = ({
  show,
  item,
  onClose,
  onUpdate,
  container,
}) => {
  const { getValue, language } = useLanguage();
  const [visibility, setVisibility] = useState<number>(0);
  const [selectedRoles, setSelectedRoles] = useState<RoleOption[]>([]);
  const [allRoles, setAllRoles] = useState<RoleOption[]>([]);
  const [isLoadingRoles, setIsLoadingRoles] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const isRTL = language === "ar";

  useEffect(() => {
    const fetchRoles = async () => {
      setIsLoadingRoles(true);
      try {
        const roles = await RoleService.getAppRoles();
        const roleOptions = roles.map((item: any) => ({
          value: item.key.toString(),
          label: item.value,
        }));
        setAllRoles(roleOptions);
      } catch {
        // Failed to fetch roles
      } finally {
        setIsLoadingRoles(false);
      }
    };
    fetchRoles();
  }, []);

  useEffect(() => {
    if (item) {
      setVisibility(getVisibility(item));
      const roleIds = getAllowedRoleIds(item);
      if (roleIds.length > 0) {
        const selected = allRoles.filter((role) =>
          roleIds.includes(role.value)
        );
        setSelectedRoles(selected);
      } else {
        setSelectedRoles([]);
      }
    }
  }, [item, allRoles]);

  const handleSave = async () => {
    if (!item) return;

    if (visibility === 1 && selectedRoles.length === 0) {
      toast.error(getValue("please_select_at_least_one_role"));
      return;
    }

    setIsSaving(true);
    try {
      const roleIds = selectedRoles.map((role) => role.value);
      await UploadFile.updatePermissions(item.id, visibility, roleIds);
      toast.success(getValue("permissions_updated_successfully"));
      onUpdate();
      onClose();
    } catch (error: any) {
      const message =
        error?.response?.data?.title ||
        error?.response?.data?.message ||
        getValue("error_updating_permissions");
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  if (!item) return null;

  return (
    <Offcanvas
      show={show}
      onHide={onClose}
      placement={isRTL ? "start" : "end"}
      className="permissions-offcanvas"
      backdrop={false}
      scroll={true}
      container={container?.current}
    >
      <Offcanvas.Header closeButton className="permissions-header">
        <Offcanvas.Title className="d-flex align-items-center gap-3">
          <div className="file-icon-wrapper">
            {item.type === "Folder" ? (
              <img
                src="/icons/folder.icon.svg"
                alt={item.fileName}
                className="file-thumbnail"
              />
            ) : item.contentType?.startsWith("image/") ? (
              <img
                src={item.filePath}
                alt={item.fileName}
                className="file-thumbnail image-preview"
                onError={(e) => {
                  e.currentTarget.src = "/icons/file.icon.svg";
                }}
              />
            ) : (
              <img
                src="/icons/file.icon.svg"
                alt={item.fileName}
                className="file-thumbnail"
              />
            )}
          </div>
          <div className="file-details">
            <h4 className="file-name mb-0">{item.fileName}</h4>
            <span className="file-meta">
              {item.createdAt && formatDate(item.createdAt)}
              {item.createdAt && " • "}
              {visibility === 0 ? getValue("public") : getValue("restricted")}
            </span>
          </div>
        </Offcanvas.Title>
      </Offcanvas.Header>

      <Offcanvas.Body className="permissions-body">
        <h5 className="section-title">{getValue("access_level")}</h5>

        {/* Public Option */}
        <div
          className={`access-option ${visibility === 0 ? "selected" : ""}`}
          onClick={() => setVisibility(0)}
        >
          <input
            type="radio"
            name="visibility"
            checked={visibility === 0}
            onChange={() => setVisibility(0)}
          />
          <div className="option-content">
            <div className="option-header">
              <img
                src="/icons/public-icon.svg"
                alt="public"
                className="option-icon"
              />
              <span className="option-title">{getValue("public")}</span>
            </div>
            <p className="option-description">
              {getValue("visible_to_all_users")}
            </p>
          </div>
        </div>

        {/* Restricted Option */}
        <div
          className={`access-option ${visibility === 1 ? "selected" : ""}`}
          onClick={() => setVisibility(1)}
        >
          <input
            type="radio"
            name="visibility"
            checked={visibility === 1}
            onChange={() => setVisibility(1)}
          />
          <div className="option-content">
            <div className="option-header">
              <img
                src="/icons/restricted-icon.svg"
                alt="restricted"
                className="option-icon"
              />
              <span className="option-title">{getValue("restricted")}</span>
            </div>
            <p className="option-description">
              {getValue("only_specific_roles_can_access")}
            </p>
          </div>
        </div>

        {/* Roles Selector */}
        {visibility === 1 && (
          <div className="roles-section">
            <label className="roles-label">
              {getValue("allowed_roles_label")} <span className="required">*</span>
            </label>
            <Select
              isMulti
              options={allRoles}
              value={selectedRoles}
              onChange={(selected) =>
                setSelectedRoles(selected as RoleOption[])
              }
              placeholder={getValue("select_roles_placeholder")}
              isLoading={isLoadingRoles}
              classNamePrefix="roles-select"
              controlShouldRenderValue={false}
              noOptionsMessage={() => getValue("no_roles_found")}
            />
            {selectedRoles.length > 0 && (
              <div className="selected-roles-tags">
                {selectedRoles.map((role) => (
                  <span key={role.value} className="role-tag">
                    {role.label}
                    <button
                      type="button"
                      className="remove-tag"
                      onClick={() =>
                        setSelectedRoles(
                          selectedRoles.filter((r) => r.value !== role.value)
                        )
                      }
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </Offcanvas.Body>

      <div className="permissions-footer">
        <Button
          variant="outline-secondary"
          onClick={onClose}
          disabled={isSaving}
        >
          {getValue("cancel")}
        </Button>
        <Button
          variant="primary"
          onClick={handleSave}
          disabled={isSaving}
          className="btn-save"
        >
          {isSaving ? (
            <>
              <Spinner animation="border" size="sm" className="me-2" />
              {getValue("saving")}
            </>
          ) : (
            getValue("save")
          )}
        </Button>
      </div>
    </Offcanvas>
  );
};

export default PermissionsSidebar;
