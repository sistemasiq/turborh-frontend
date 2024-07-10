//This js file is to administrate the operations of the files
import axios from "axios";
import { requestSuccessfull } from "src/utils/operations";


//This method upload files to a specific folder path in the S3 bucket
export const uploadFile = async (fileName, folderPath) => {
  const formData = new FormData();

  formData.append("file", fileName);
  formData.append("folderPath", folderPath);

  try {
    const request = await axios.post("files/upload", formData, {
      headers: {
        file: "multipart/form-data",
      },
    });

    if (requestSuccessfull(request.status)) {
      return request.data;
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
};

//Update an specific file, we need the name of the file that is going to be updated, the new file and the folder path
export const updateFile = async (oldFileName, newFileName, folderPath) => {
  const formData = new FormData();

  formData.append("file", newFileName);
  formData.append("folderPath", folderPath);

  try {
    const request = await axios.put(`files/${oldFileName}`, formData, {
      headers: {
        file: "multipart/form-data",
      },
    });

    if (requestSuccessfull(request.status)) {
      return request.data;
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
};

export const downloadFile = async (fileName, folderPath) => {
  try {
    const request = await axios.get(
      `files/download/${fileName}/path/${folderPath}`,
      {
        responseType: "arraybuffer",
      }
    );

    if (requestSuccessfull(request.status)) {
      const blob = new Blob([request.data], { type: "application/pdf" });
      return URL.createObjectURL(blob);
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
};
