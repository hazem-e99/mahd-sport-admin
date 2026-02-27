export const TABS_API = {
  getAll: 'TabsApi/GetAll',
  getDetails: (id: string) => `TabsApi/GetDetails?Id=${id}`,
  create: 'TabsApi/Create',
  update: 'TabsApi/Update',
  delete: 'TabsApi/Delete'
};
