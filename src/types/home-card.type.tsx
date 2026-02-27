export interface HomeCardProps {
    id: number;
    title: string
    desc: string;
    icon: any;
    urlToGo?: string;
    onClick?: () => void;
}