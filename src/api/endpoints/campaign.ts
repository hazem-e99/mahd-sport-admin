export const CAMPAIGN_API = {
  getDetails: (id: string) => `Campaign/GetDetails?Id=${id}`,
  getAllByType: "campaign/GetAllByType",
  getAll: "campaign/GetAll",
  update: "campaign/Update",
  delete: "campaign/Delete",
  create: "campaign",
  getStatus: "campaign/campaign_status",

  addCampaignType: "CampaignType",
  updateCampaignType: "CampaignType/Update",
  deleteCampaignType: "CampaignType/Delete",
  getCampaignTypeDetails: (id: string) => `CampaignType/GetDetails?Id=${id}`,

  // Dictionary endpoints
  getCampaignTypes: "CampaignType/GetDictionary",
  getAppRoles: "AppRolesApi/GetDictionary",
  getVisibilityOptions: "Comman/GetVisibilityDictionary",
};
