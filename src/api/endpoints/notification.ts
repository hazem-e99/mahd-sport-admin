export const NOTIFICATION_API = {
  getAll: "Notifcation/GetAll",
  getById: (id: string | number) => `Notifcation/GetById?id=${id}`,
  delete: (id: string | number) => `Notifcation/Delete?id=${id}`,
  create: "Notifcation/Create",
  update: "Notifcation/Update",
};
