export interface WidgetConfig {
  id: number;
  positionX: number;
  positionY: number;
  widgetWidth: number;
  widgetHeight: number;
  noMove: string;
  noResize: string;
  content?: React.ReactNode;
  header?: React.ReactNode;
  headerActions?: React.ReactNode;
  searchComponent?: React.ReactNode;
  sorterComponent?: React.ReactNode;
  footer?: React.ReactNode;
  handleClick?: () => void;
}


export interface WidgetProps {
  id: number;
  content?: React.ReactNode;
  positionX: number;
  positionY: number;
  widgetWidth: number;
  widgetHeight: number;
  noMove: string
  noResize: string;
  handleClick?: () => void;
  header?: React.ReactNode;
  headerActions?: React.ReactNode;
  searchComponent?: React.ReactNode;
  sorterComponent?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export type WidgetTypeProps = {
  widgetType: string;
};

export type BasicWidgetInformationProps = {
  widgetType: string;
  setWidgetType: (value: string) => void;
};