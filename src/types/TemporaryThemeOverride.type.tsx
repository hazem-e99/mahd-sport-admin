export interface TemporaryThemeOverride {
  id: string;
  holidayName: string;
  startDateTime: string;
  endDateTime: string;
  primaryColor?: string;
  backgroundImageUrl?: string;
  userName?: string;
  createdOn?: string;
}

export interface TemporaryThemeOverrideForm {
  holidayName: string;
  startDateTime: string;
  endDateTime: string;
  primaryColor?: string;
  backgroundImage?: File;
}
