const BASE_URL = "http://23.254.129.173/api";
// const BASE_URL = 'http://185.35.79.45/api';
// const BASE_URL = 'http://10.55.1.24/api';
// const BASE_URL = 'http://localhost/api';
//  const BASE_URL = 'https://api.mahd.gov.sa/api';
// const BASE_URL = 'http://10.55.1.19/api';
 
export default BASE_URL;

export const EnumPermissions = {
  AddLocalization: "AddLocalization",
  AwarenessCampaign: "AwarenessCampaign",
  CardController: "CardController",
  CMSConfiguration: "CMSConfiguration",
  Corporate: "Corporate",
  FAQConfiguration: "FAQConfiguration",
  GeneralSettings: "GeneralSettings",
  HealthCheck: "HealthCheck",
  ManageAllSurvey: "ManageAllSurvey",
  ManageMySurvey: "ManageMySurvey",
  MilestonesCelebrations: "MilestonesCelebrations",
  Notification: "Notification",
  OperationalCalendar: "OperationalCalendar",
  RolesAndPermissions: "RolesAndPermissions",
  ServiceCatalogConfigurations: "ServiceCatalogConfigurations",
  StepsTour: "StepsTour",
  TabConfiguration: "TabConfiguration",
  UserFeedback: "UserFeedback",
  ViewAuditLogs: "ViewAuditLogs",
  WidgetConfiguration: "WidgetConfiguration",
} as const;
