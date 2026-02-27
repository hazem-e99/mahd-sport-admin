import { GeneralSettingsService } from "@/api/services/generalSettings.service";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

export const usePortalBasics = () => {
  const [show, setShow] = useState(false);
  const [activeThemeColor, setActiveThemeColor] = useState<"light" | "dark">(
    "light"
  );
  const [showChoose, setShowChoose] = useState(false);
  const [timeZoneDictionary, setTimeZoneDictionary] = useState<any[]>([]);
  const [backgrounds, setBackgrounds] = useState<any[]>([]);
  const [lightThemeColors, setLightThemeColors] = useState<any[]>([]);
  const [darkThemeColors, setDarkThemeColors] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      language: "",
      timeZone: "",
      lightThemeColors: "",
      darkThemeColors: "",
      background: "",
      displayMode: "light",
      introVideoPath: "",
      birthdayCelebration: false,
      joiningCelebration: false,
    },
    disabled: isLoading,
  });

  const handleOpenThemeColorModal = (type: "light" | "dark") => {
    setActiveThemeColor(type);
    setShow(true);
  };

  const handleCloseThemeColorModal = () => {
    setShow(false);
    setActiveThemeColor("light");
  };

  const activeBackground = watch("background");
  const displayMode = watch("displayMode");

  const handleCloseChoose = () => setShowChoose(false);
  const handleShowChoose = () => setShowChoose(true);

  const fetchTimeZones = useCallback(async () => {
    try {
      const response = await GeneralSettingsService.getTimeZoneDictionary();
      setTimeZoneDictionary(response);
    } catch (err) {
      console.error("Failed to load time zones:", err);
    }
  }, []);

  const fetchGeneralSettings = useCallback(async () => {
    try {
      const response = await GeneralSettingsService.getGeneralSettings();
      const data = response.data || {};
      console.log("🚀 ~ usePortalBasics ~ data:", data);
      setLightThemeColors(data.lightThemeColors || []);
      setDarkThemeColors(data.darkThemeColors || []);

      setBackgrounds(data.backgrounds || []);

      setValue(
        "background",
        data.backgrounds?.find((bg) => bg.isDefault)?.path || ""
      );
      setValue(
        "lightThemeColors",
        data.lightThemeColors?.find((color) => color.isDefault)?.hexCode || ""
      );
      setValue(
        "darkThemeColors",
        data.darkThemeColors?.find((color) => color.isDefault)?.hexCode || ""
      );
      setValue("language", data.defaultLanguage || "");
      setValue("timeZone", data.defaultTimeZone || "");
      setValue("displayMode", data.defaultMode || "light");
      setValue("introVideoPath", data.introVideoPath || "");
      setValue("birthdayCelebration", data.birthdayCelebration || false);
      setValue("joiningCelebration", data.joiningCelebration || false);
    } catch (err) {
      console.error("Failed to load general settings:", err);
    } finally {
      setIsLoading(false);
    }
  }, [setValue]);

  useEffect(() => {
    fetchTimeZones();
    fetchGeneralSettings();
  }, [fetchTimeZones, fetchGeneralSettings]);

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      const response = await GeneralSettingsService.update({
        defaultLanguage: data.language,
        defaultTimeZone: data.timeZone,
        defaultMode: data.displayMode,
        introVideoPath: data.introVideoPath,
        birthdayCelebration: data.birthdayCelebration,
        joiningCelebration: data.joiningCelebration,
        lightThemeColors: (lightThemeColors ?? []).map((color) => ({
          ...color,
          isDefault: color.hexCode === data.lightThemeColors,
        })),
        darkThemeColors: (darkThemeColors ?? []).map((color) => ({
          ...color,
          isDefault: color.hexCode === data.darkThemeColors,
        })),
        themeBackgrounds: (backgrounds ?? []).map((bg) => ({
          ...bg,
          isDefault: bg.path === data.background,
        })),
      });
      if (response.success) {
        toast.success("Settings updated successfully!");
      } else {
        toast.error("Failed to update settings.");
      }
    } catch (e) {
      toast.error("Failed to update settings.");
      console.error("Error updating settings:", e);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    show,
    handleOpenThemeColorModal,
    handleCloseThemeColorModal,
    activeThemeColor,
    showChoose,
    setShowChoose,
    timeZoneDictionary,
    backgrounds,
    lightThemeColors,
    darkThemeColors,
    isLoading,
    activeBackground,
    displayMode,
    register,
    handleSubmit: handleSubmit(onSubmit),
    control,
    setValue,
    errors,
    handleCloseChoose,
    handleShowChoose,
    fetchGeneralSettings,
    setLightThemeColors,
    setDarkThemeColors,
    setBackgrounds,
  };
};
