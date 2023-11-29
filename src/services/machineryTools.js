import axios from "axios";
import { requestSuccessfull } from "src/utils/operations";

export const getAllMachinery = async () => {
  try {
    const request = await axios.get(`machinery-tools`);

    if (requestSuccessfull(request.status)) {
      return request.data;
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
};

export const getAllMachineryActive = async () => {
    try {
      const request = await axios.get(`machinery-tools/active`);
  
      if (requestSuccessfull(request.status)) {
        return request.data;
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  };

export const createNewMachinery = async (machineryData) => {
    try {
        const request = await axios.post(`machinery-tools`, machineryData);

        if(requestSuccessfull(request.status)) {
            return request.data;
        }else{
            return null;
        }

    } catch (error) {
        return null;
    }
}

export const updateMachinery = async (machineryData) => {
    try {
        const request = await axios.put(`machinery-tools`, machineryData);

        if(requestSuccessfull(request.status)) {
            return request.data;
        }else{
            return null;
        }

    } catch (error) {
        return null;
    }
}

export const enableMachinery = async (id) => {
    try {
        const request = await axios.put(`machinery-tools/${id}`);

        if(requestSuccessfull(request.status)) {
            return true;
        }else{
            return false;
        }

    } catch (error) {
        return false;
    }
}

export const disableMachinery = async (id) => {
    try {
        const request = await axios.delete(`machinery-tools/${id}`);

        if(requestSuccessfull(request.status)) {
            return true;
        }else{  
            return false;
        }

    } catch (error) {
        return false;
    }
}