import apiClient from "@/axiosClient";
import { FILE_RECORD_API } from "../endpoints/filerecord";

export const UploadFile = {
  uploadFile: async (file: File, parentId?: string, visibility: number = 0) => {
    const formData = new FormData();
    formData.append("File", file);
    if (parentId) {
      formData.append("parentId", parentId);
    }
    formData.append("Visibility", visibility.toString());
    const response = await apiClient.post(
      FILE_RECORD_API.uploadFile,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  searchFile: async (keyword: string) => {
    const response = await apiClient.post(FILE_RECORD_API.searchFile(keyword));
    return response.data;
  },

  getAll: async () => {
    const response = await apiClient.post(FILE_RECORD_API.getAll);
    return response.data;
  },

  createFolder: async (folderName: string, parentId?: string) => {
    const payload: any = { folderName };
    if (parentId) {
      payload.parentId = parentId;
    }
    const response = await apiClient.post(
      FILE_RECORD_API.createFolder,
      payload
    );
    return response.data;
  },

  getFolderContents: async (folderId: string) => {
    const response = await apiClient.post(
      FILE_RECORD_API.getFolderContents(folderId)
    );
    return response.data;
  },

  deleteFile: async (fileId: string) => {
    const response = await apiClient.delete(FILE_RECORD_API.deleteFile(fileId));
    return response.data;
  },

  moveFile: async (fileId: string, newParentId: string | null) => {
    const payload: any = { id: fileId, newParentId: newParentId };
    const response = await apiClient.put(FILE_RECORD_API.moveFile, payload);
    return response.data;
  },

  getFileMetaData: async (fileId: string) => {
    const response = await apiClient.get(FILE_RECORD_API.getMetaData(fileId));
    return response.data;
  },

  updatePermissions: async (
    fileId: string,
    visibility: number,
    allowedRoleIds?: string[]
  ) => {
    // Build the request payload based on visibility
    const payload: {
      objectId: string;
      visibility: number;
      allowedRoleIds?: string[];
    } = {
      objectId: fileId,
      visibility: visibility,
    };
    
    // Only include allowedRoleIds when visibility is restricted (1)
    // When public (0), don't send allowedRoleIds at all to avoid API validation errors
    if (visibility === 1 && allowedRoleIds && allowedRoleIds.length > 0) {
      payload.allowedRoleIds = allowedRoleIds;
    }
    
    const response = await apiClient.put(
      FILE_RECORD_API.updatePermissions,
      payload
    );
    return response.data;
  },
};
