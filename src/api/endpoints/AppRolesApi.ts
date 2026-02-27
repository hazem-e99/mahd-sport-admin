export const AppRoles_Api = {
  getDictionary: "AppRolesApi/GetDictionary",
  getAll: "AppRolesApi/GetAll",
  getRoleDetails: (id: number | string) => `AppRole/GetDetails?Id=${id}`,
  assignActionsToRole: "AppRole/AssignActionsToRole",
};
