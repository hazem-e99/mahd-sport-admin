export const TourStep_API = {
  getAll: 'TourStepApi/GetAll',
  getDetails: (id: number | string) => `TourStepApi/GetDetails/${id}`,
  create: 'TourStepApi/AddTourStep',
  update: 'TourStepApi/UpdateTourStep',
  delete: 'TourStepApi/DeleteTourStep',
};
