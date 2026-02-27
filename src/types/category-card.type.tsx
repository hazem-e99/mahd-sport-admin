import type { SelectedWidgetsType } from "./selected-widgets-type"

export interface CategoryCardProps {
      
    title?: string;
    onEdit?: () => void;
    onDelete?: () => void;
    selectedwidgets?: SelectedWidgetsType[];
}