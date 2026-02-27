import { Row, Col } from "react-bootstrap";
import "./PortalBasics.component.scss";
import ColorSwitcher from "../color-switcher/color-switcher.component";
import SvgCheckedCircle from "@/components/icons/checked-circle";
import { Controller } from "react-hook-form";
import { usePortalBasics } from "./usePortalBasics";
import { AddThemeColorModal } from "@/pages/addConfigurations/component/AddThemeColor/AddThemeColorModal";
import { ChooseYourBackground } from "../chooseYourBackground/chooseYourBackground.modal";
import type { GeneralSettingsColor } from "@/api/services/generalSettings.service";
import { toast } from "react-toastify";
import { useState } from "react";
import { TrashIcon } from "@/components/icons";
import { useLanguage } from "@/context/languageContext";

const PortalBasics = () => {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    errors,
    isLoading,
    timeZoneDictionary,
    backgrounds,
    lightThemeColors,
    darkThemeColors,
    show,
    handleOpenThemeColorModal,
    handleCloseThemeColorModal,
    activeThemeColor,
    showChoose,
    handleCloseChoose,
    handleShowChoose,
    activeBackground,
    displayMode,
    setLightThemeColors,
    setDarkThemeColors,
    setBackgrounds,
  } = usePortalBasics();

  const { getValue } = useLanguage();

  const [
    selectedColorForEdit,
    setSelectedColorForEdit,
  ] = useState<GeneralSettingsColor | null>(null);

  const handleDeleteColor = (colorToDelete: GeneralSettingsColor,type: "light" | "dark") => {
    const updatedColors = type === "light" ? lightThemeColors : darkThemeColors;
    const updatedColorsList = updatedColors.filter(
      (color) => color.hexCode !== colorToDelete.hexCode
    );
    if (type === "light") {
      setLightThemeColors(updatedColorsList);
    } else {
      setDarkThemeColors(updatedColorsList);
    }
    toast.success("Color deleted successfully!");
  };

  const handleColorSuccess = (updatedColor: any, type: "light" | "dark") => {
    if (selectedColorForEdit) {
      // Update existing color in the list
      const updatedColors = type === "light" ? lightThemeColors : darkThemeColors;
      const updatedColorsList = updatedColors.map((color: any) =>
        color.hexCode === selectedColorForEdit.hexCode ? updatedColor : color
      );
      if (type === "light") {
        setLightThemeColors(updatedColorsList);
      } else {
        setDarkThemeColors(updatedColorsList);
      }
    } else {
      // Add new color to the list
      const updatedColorsList = type === "light" ? [...lightThemeColors, updatedColor] : [...darkThemeColors, updatedColor];
      if (type === "light") {
        setLightThemeColors(updatedColorsList);
      } else {
        setDarkThemeColors(updatedColorsList);
      }
    }
  };

  const handleBackgroundSuccess = (newBackground: any) => {
    const updatedBackgrounds = [...backgrounds, newBackground];
    setBackgrounds(updatedBackgrounds);
    setValue("background", newBackground.path, { shouldValidate: true });
  };

  const handleDeleteBackground = (backgroundToDelete: any) => {
    // Prevent deletion if it's the currently selected background
    if (activeBackground === backgroundToDelete.path) {
      toast.error("Cannot delete the currently active background!");
      return;
    }

    const updatedBackgrounds = backgrounds.filter(
      (bg) => bg.path !== backgroundToDelete.path
    );
    setBackgrounds(updatedBackgrounds);
    toast.success("Background deleted successfully!");
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="card_title d-flex justify-content-between align-items-center">
        <div className="card_title_text">
          <h2> {getValue("Manage_your_settings")}</h2>
          <p> {getValue("customize_the_app_the_way_you_like")}</p>
        </div>
        <div className="card_title_btn">
          <button
            className="main-button active"
            type="submit"
            disabled={isLoading}
          >
            {getValue("Save_Settings")}
          </button>
        </div>
      </div>
      <div className="setting_form">
        <Row>
          <Col md={6}>
            <div className="form-group">
              <label htmlFor="language">
                {getValue("Default_Portal_Language")}
              </label>
              <select
                id="language"
                {...register("language", {
                  required: getValue("Language_is_required"),
                })}
              >
                <option value="" disabled>
                  {getValue("select")}
                </option>
                <option value="en">{getValue("English")}</option>
                <option value="ar">{getValue("Arabic")}</option>
              </select>
              {errors.language && (
                <p className="text-danger">{errors.language.message}</p>
              )}
            </div>
          </Col>
          <Col md={6}>
            <div className="form-group">
              <label htmlFor="timeZone"> {getValue("Default_Time_Zone")}</label>
              <select
                id="timeZone"
                {...register("timeZone", { required: "Time zone is required" })}
              >
                <option value="" disabled>
                  {getValue("select")}
                </option>
                {timeZoneDictionary?.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.key}
                  </option>
                ))}
              </select>
              {errors.timeZone && (
                <p className="text-danger">{errors.timeZone.message}</p>
              )}
            </div>
          </Col>
        </Row>
        <hr />

        <div className="default-theme">
          <div className="theme_title">
            <h2>{getValue("light_theme")} </h2>
          </div>
          <div className="theme_list">
            <div className="theme_item d-flex align-items-center justify-content-start">
              <Controller
                name="lightThemeColors"
                control={control}
                rules={{ required: "Theme color is required" }}
                render={({ field }) => (
                  <ColorSwitcher
                    themeColors={lightThemeColors}
                    selectedColor={field.value}
                    setSelectedColor={field.onChange}
                    onDeleteColor={(color: GeneralSettingsColor) => handleDeleteColor(color, "light")}
                    setShow={() => handleOpenThemeColorModal("light")}
                    setSelectedColorForEdit={setSelectedColorForEdit}
                    canDelete={true}
                  />
                )}
              />
              {errors.lightThemeColors && (
                <p className="text-danger">{errors.lightThemeColors.message}</p>
              )}
            </div>
          </div>
        </div>
        <div className="default-theme">
          <div className="theme_title">
            <h2>{getValue("dark_theme")} </h2>
          </div>
          <div className="theme_list">
            <div className="theme_item d-flex align-items-center justify-content-start">
              <Controller
                name="darkThemeColors"
                control={control}
                rules={{ required: "Theme color is required" }}
                render={({ field }) => (
                  <ColorSwitcher
                    themeColors={darkThemeColors}
                    selectedColor={field.value}
                    setSelectedColor={field.onChange}
                    onDeleteColor={(color: GeneralSettingsColor) => handleDeleteColor(color, "dark")}
                    setShow={() => handleOpenThemeColorModal("dark")}
                    setSelectedColorForEdit={setSelectedColorForEdit}
                    canDelete={true}
                  />
                )}
              />
              {errors.darkThemeColors && (
                <p className="text-danger">{errors.darkThemeColors.message}</p>
              )}
            </div>
          </div>
        </div>
        <hr />

        <div className="default-theme">
          <div className="theme_title">
            <h2>{getValue("choose_your_background")}</h2>
          </div>
          <div className="background_list">
            {backgrounds?.map((item, index) =>
              item?.path ? (
                <div
                  className={`background_img ${
                    activeBackground === item.path ? "active" : ""
                  }`}
                  key={index}
                  onClick={() =>
                    setValue("background", item.path, { shouldValidate: true })
                  }
                >
                  {activeBackground === item.path && (
                    <div className="checked_icon">
                      <SvgCheckedCircle />
                    </div>
                  )}
                  <div
                    className="delete_icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteBackground(item);
                    }}
                  >
                    <TrashIcon />
                  </div>
                  <img src={item.path} alt={item.name ?? "Background"} />
                </div>
              ) : null
            )}

            <div className="background_img">
              <button
                className="add_background_img"
                type="button"
                onClick={handleShowChoose}
              >
                +
              </button>
            </div>
          </div>
          {errors.background && (
            <p className="text-danger">{errors.background.message}</p>
          )}
        </div>
        <hr />

        <div className="default-theme">
          <div className="theme_title">
            <h2>{getValue("Display_Mode")}</h2>
          </div>
          <div className="choose_ur_mode">
            <button
              type="button"
              onClick={() =>
                setValue("displayMode", "light", { shouldValidate: true })
              }
            >
              <img
                src="/images/light-mode.png"
                alt="Light Mode"
                className={displayMode === "light" ? "active" : ""}
              />
              <span> {getValue("Light")}</span>
            </button>
            <button
              type="button"
              onClick={() =>
                setValue("displayMode", "dark", { shouldValidate: true })
              }
            >
              <img
                src="/images/dark-mode.png"
                alt="Dark Mode"
                className={displayMode === "dark" ? "active" : ""}
              />
              <span>{getValue("Dark")}</span>
            </button>
          </div>
          {errors.displayMode && (
            <p className="text-danger">{errors.displayMode.message}</p>
          )}
        </div>
        <hr />

        <div className="form_c video_url">
          <div className="theme_title">
            <h2>{getValue("Upload_Introductory_Video")} </h2>
          </div>
          <div className="search_input">
            <input
              type="text"
              placeholder="Enter Video Url"
              {...register("introVideoPath", {
                required: "Video URL is required",
              })}
            />
            {errors.introVideoPath && (
              <p className="text-danger">{errors.introVideoPath.message}</p>
            )}
          </div>
        </div>
      </div>
      <hr />

      <div className="form-group">
        <label>
          <input type="checkbox" {...register("birthdayCelebration")} />
          &nbsp; {getValue("Enable_Birthday_Celebration")}
        </label>
      </div>
      <div className="form-group">
        <label>
          <input type="checkbox" {...register("joiningCelebration")} />
          &nbsp; {getValue("Enable_Joining_Celebration")}
        </label>
      </div>

      <AddThemeColorModal
        show={show}
        setShow={handleCloseThemeColorModal}
        onSuccess={handleColorSuccess}
        themeColors={activeThemeColor === "light" ? lightThemeColors : darkThemeColors}
        setThemeColors={activeThemeColor === "light" ? setLightThemeColors : setDarkThemeColors}
        selectedColorForEdit={selectedColorForEdit}
        setSelectedColorForEdit={setSelectedColorForEdit}
      />

      <ChooseYourBackground
        show={showChoose}
        handleClose={handleCloseChoose}
        onSuccess={handleBackgroundSuccess}
        backgrounds={backgrounds}
        setBackgrounds={setBackgrounds}
      />
    </form>
  );
};

export default PortalBasics;
