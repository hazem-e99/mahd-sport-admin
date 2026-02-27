export const CONFLICT_DECLARATIONS_API = {
  getConflictDeclarations: "GeneralSettingConflictDeclarationsApi/GetAll",
  create: "GeneralSettingConflictDeclarationsApi/Create",
  delete: (id: string | number) =>
    `GeneralSettingConflictDeclarationsApi/Delete/${id}`,
  exportConflictDeclarations: "GeneralSettingConflictDeclarationsApi/ExportConflictDeclarations",
  exportViewers: "GeneralSettingConflictDeclarationsApi/ExportViewers",
};
