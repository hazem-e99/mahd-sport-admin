export interface AwarnessCampaignConfig {
    id: string;
    campaignTitle: string;
    type: string;
    startDate: string;
    endDate: string;
    visibility: "Public" | "Restricted";
    status: "Active" | "Not Active";
    handleClick?: () => void;
}