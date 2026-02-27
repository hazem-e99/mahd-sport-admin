import BASE_URL from "@/constants";

export const FILE_RECORD_API = {
  uploadFile: "/FileRecord/Upload",
  searchFile: (keyword: string) => `/FileRecord/Get?Q=${keyword}`,
  getAll: `/FileRecord/Get`,
  getFile: (objectId: string) => `${BASE_URL}/FileRecord/Download/${objectId}`,
  previewFile: (objectId: string) =>
    `${BASE_URL}/FileRecord/Preview/${objectId}`,
  createFolder: "/FileRecord/CreateFolder",
  getFolderContents: (id: string) => `/FileRecord/Get?Id=${id}`,
  deleteFile: (fileId: string) => `/FileRecord/Delete/${fileId}`,
  moveFile: `/FileRecord/UpdateParent`,
  getMetaData: (id: string) => `/FileRecord/File/MetaData/${id}`,
  updatePermissions: "/FileRecord/UpdatePermission",
};
