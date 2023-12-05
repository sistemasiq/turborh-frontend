import axios from "axios";
import { computed } from "vue";
import { requestSuccessfull } from "src/utils/operations";

const dev = false;

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
        const request = await axios.get(`files/download/${fileName}/path/${folderPath}`)

        if(requestSuccessfull(request.status)){
            return true;
        }else{
            return false;
        }

    } catch (error) {
        return false;
    }
};

export const getFile = computed(() => {
    
})


const getFileURL = (fileName, folderPath) => {
  const url = dev ? `http://localhost:5000/` : `http://192.168.20.59:8181/`;

  return `${url}/${fileName}/path/${folderPath}`;

};

export const deleteFile = async () => {};
