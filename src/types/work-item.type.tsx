

export type Widget = {
  id: number;
  name: string;
  selected: boolean;
  pinAble: boolean;
  isLocked: boolean;
};

export type WidgetsData = {
  general: Widget[];
  analytics: Widget[];
};

export type CategoryWidgetsData = {
  [categoryId: number]: Widget[];
};

export type WidgetsItemProps = {
  title: string;
  widgetsType?: keyof WidgetsData;
  selectedwidgetsData: WidgetsData;

  setSelectedwidgetsData?: React.Dispatch<React.SetStateAction<WidgetsData>>;
};

export type WidgetGroup = {
  id: number;
  name: string;
  widgets: WidgetsData;
};

export type CategoryWidgetGroup = {
  id: number;
  name: string;
  categoryId: number;
  categoryName: string;
  widgets: Widget[];
};

export type PropsCategoryCard = {
  widgetGroup: WidgetGroup;
  onDeleteWidget: (widgetId: number) => void
};

export type PropsCategoryWidgetCard = {
  widgetGroup: CategoryWidgetGroup;
  onDeleteWidget: (widgetId: number) => void
};