export interface PageHeaderProps {
    title: string;
    breadcrumb?: React.ReactNode;
    onCancel?: () => void;
    onSubmit?: () => void;
    submitLabel?: string;
    cancelLabel?: string;
    showBtns?: boolean;
    previewButton?: React.ReactNode;
    loadingSubmit?: boolean;
}