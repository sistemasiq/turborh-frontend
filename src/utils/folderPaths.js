export const getAssetsPath = "Assets";

export const getAdminImagesPath = "Admin Images";

export const getUserImagesPath = "Users Images";

export const getJobImagesPath = "Admin JobsImages";

export const getUserDocumentsPath = "Users Documents";

export const getDefaultPath = (uuid, currentPath) => {
    return uuid === null ? getAssetsPath : currentPath;
  }

export const getDefaultJobUUID = (uuid) => {
    return uuid === null || uuid === "" ? "default.png" : uuid;
  }


