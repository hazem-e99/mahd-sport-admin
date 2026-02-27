export const WIDGET_API = {
  getAll: "TabWidgetsApi/GetAll",
  create: "TabWidgetsApi/Create",
  getCategories: "TabWidgetCategoriesApi/GetDictionary",
  getCategoriesWidget: "TabWidgetCategoriesApi/GetDictionaryByLanguage",
  getWidgetTypes: "TabWidgetsApi/GetWidgetTypeDictionary",
  delete: "TabWidgetsApi/Delete",
  update: "TabWidgetsApi/Update",
  getById: "TabWidgetsApi/GetDetails",
  createUserWidgetSub: "TabWidgetsApi/CreateUserWidgetSub",
  getAllServiceCatalogParents: "TabWidgetsApi/GetAllServiceCatalogParents",
  updateUserWidgetSub: "TabWidgetsApi/UpdateUserWidgetSub",
  getUserWidgetSub:"TabWidgetsApi/GetUserWidgetSub",
  
  CATEGORY: {
    CREATE: "TabWidgetCategoriesApi/Create",
    update: "TabWidgetCategoriesApi/Update",

    delete: "TabWidgetCategoriesApi/Delete",

    GET_DICTIONARY: "TabWidgetCategoriesApi/GetDictionary",
  },
  ROLES: {
    GET_DICTIONARY: "AppRolesApi/GetDictionary",
    GET_VISIBILITY_LIST: "Comman/GetVisibilityDictionary",
  },
};
