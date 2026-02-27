export interface SingleTabProps {
    id: number;
    content: string;
    icon: React.ReactNode;
    isActive?: boolean;
    handleClick: () => void;
}
