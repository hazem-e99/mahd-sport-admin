export interface FileItem {
  id: string;
  fileName: string;
  contentType: string;
  extension: string;
  size: number;
  type: string;
  parentId: string | null;
  filePath: string;
  // API returns "visiblity" (with typo) as string "0" or "1"
  visiblity?: string;
  fileAllowedRoles?: string[];
  createdAt?: string;
}

// Helper function to get visibility as number
export const getVisibility = (item: FileItem): number => {
  // API returns "Public" or "Restricted" as string
  const rawValue = item.visiblity || "Public";
  const visibility = rawValue === "Restricted" ? 1 : 0;
  return visibility;
};

// Helper function to get allowed role ids
export const getAllowedRoleIds = (item: FileItem): string[] => {
  return item.fileAllowedRoles || [];
};

export interface DefaultFileItem {
  name: string;
  image: string;
  type: "folder" | "file";
}

export interface SearchFileResponse {
  data: FileItem[];
  message?: string;
  success?: boolean;
  errors?: string[];
}
