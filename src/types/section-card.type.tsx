export interface SectionCardProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  onAction?: () => void;
  buttonName?: string;
  hasButtonAction?: boolean;
}