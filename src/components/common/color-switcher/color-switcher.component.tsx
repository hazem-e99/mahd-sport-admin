import { useEffect, useState, type Dispatch, type SetStateAction } from 'react';
import './color-switcher.component.scss';
import type { GeneralSettingsColor } from '@/api/services/generalSettings.service';
import { TrashIcon } from '@/components/icons';
import { useLanguage } from "@/context/languageContext";
interface ColorSwitcherProps {
  themeColors?: GeneralSettingsColor[];
  setSelectedColor: Dispatch<SetStateAction<string>>;
  selectedColor: string;
  onDeleteColor?: (color: GeneralSettingsColor) => void;
  canDelete?: boolean;
  setShow: Dispatch<SetStateAction<boolean>>;
  setSelectedColorForEdit?: Dispatch<SetStateAction<GeneralSettingsColor | null>>;
}

const ColorSwitcher = ({
  themeColors,
  setSelectedColor,
  selectedColor,
  onDeleteColor,
  setShow,
  setSelectedColorForEdit,
  canDelete = false
}: ColorSwitcherProps) => {
  console.log("🚀 ~ ColorSwitcher ~ themeColors:", themeColors)

  const [canNotDelete, setCanNotDelete] = useState(false);
  const { getValue } = useLanguage();
  const hexToRgb = (hex: string): string => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return '0, 0, 0';
    const r = parseInt(result[1], 16);
    const g = parseInt(result[2], 16);
    const b = parseInt(result[3], 16);
    return `${r}, ${g}, ${b}`;
  };

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--bs-primary-color', selectedColor);
    root.style.setProperty('--bs-primary-rgb-color', hexToRgb(selectedColor));
  }, [selectedColor]);

  const handleDeleteColor = (e: React.MouseEvent, color: GeneralSettingsColor) => {
    e.stopPropagation();
    setCanNotDelete(false);

    if (color.isDefault || selectedColor === color.hexCode) {
      setCanNotDelete(true);
      return;
    }

    if (onDeleteColor && !color.isDefault) {
      onDeleteColor(color);
    }
  };

  const handleSelectColor = (color: any) => {
    if (selectedColor === color.hexCode && setSelectedColorForEdit) {
      console.log("can edit color");
      setSelectedColorForEdit(color);
      setShow(true);
      return;
    }

    setSelectedColor(color.hexCode);
    setCanNotDelete(false);
  };

  return (
    <div className="color-switcher w-100">
      <h3 className="color-switcher__title"> {getValue("choose_your_theme")}</h3>
      <div className="color-switcher__options">
        {themeColors?.map((color) => (
          <div key={color.hexCode} className="color-option-wrapper">
            <button
              type="button"
              className={`color-option ${selectedColor === color.hexCode ? "active" : ""}`}
              style={{ "--color": color.hexCode } as React.CSSProperties}
              onClick={() => color.hexCode && handleSelectColor(color)}
            />
            {canDelete && (
              <div
                className="delete_icon"
                onClick={(e) => handleDeleteColor(e, color)}
              >
                <TrashIcon />
              </div>
            )}
          </div>
        ))}
        <div className="add_theme">
          <button
            className="add_theme_btn color-option"
            type="button"
            onClick={() => setShow(true)}
          >
            +
          </button>
        </div>
      </div>

      {canNotDelete && (
        <p className="alert-warning alert !m-0">
          You can not delete the selected color or default color
        </p>
      )}
    </div>
  );
};

export default ColorSwitcher;
