export const getAssetsPath = "Assets";

export const getAdminImagesPath = "Administration AdminPhoto";

export const getUserImagesPath = "Users Images";

export const getJobImagesPath = "Administration JobsImg";

export const getUserDocumentsPath = "Users Documents";

export const getDefaultPath = (uuid, currentPath) => {
    return uuid === null ? getAssetsPath : currentPath;
  }
  
export const getDefaultJobUUID = (uuid) => {
    return uuid === null ? "imagenpuestos.png" : uuid;
  }

