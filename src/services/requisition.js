import axios from "axios";
import { requestSuccessfull } from "src/utils/operations";

export const createRequisition = async (requisitionData) => {
  try {
    const request = await axios.post(`requisicion`, requisitionData);

    if (requestSuccessfull(request.status)) {
      return request.data;
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
};

export const getAllRequisitions = async () => {
  try {
    const request = await axios.get(`requisicion`);

    if (requestSuccessfull(request.status)) {
      return request.data;
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
};

export const getRequisitionByNum = async (numRequisition) => {
  try {
    const request = await axios.get(`requisicion/${numRequisition}`);

    if (requestSuccessfull(request.status)) {
      return request.data;
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
};

export const getRequisitionsByPersonalId = async (personalId) => {
  try {
    const request = await axios.get(`requisicion/personal/${personalId}`);

    if (requestSuccessfull(request.status)) {
      return request.data;
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
};

export const getRequisitionsByState = async (state) => {
  try {
    const request = await axios.get(`requisicion/estado/${state}`);

    if (requestSuccessfull(request.status)) {
      return request.data;
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
};

export const updateRequisition = async (requisitionData) => {
  try {
    const request = await axios.put(`requisicion`, requisitionData);

    if (requestSuccessfull(request.status)) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
};

export const updateRequisitionStateByAdmin = async (numRequisition, madeByIng) => {
    try {
        const request = await axios.put(`requisicion/estado/${numRequisition}/hecho-por-ing/${madeByIng}`)

        if(requestSuccessfull(request.status)){
            return request.data;
        }else{
            return null;
        }

    } catch (error) {
        return null;
    }
}

export const updateRequisitionState = async (state, numRequisition) => {
    try {

        const request = await axios.put(`requisicion/estado/${state}/num/${numRequisition}`)

        if(requestSuccessfull(request.status)){
            return true;
        }else{
            return false;
        }

    } catch (error) {
        return false;
    }
}

export const updateRequisitionNotes = async (newNote, numRequisition) => {
    try {
        const request = await axios.put(`requisicion/${numRequisition}/nota/${newNote}`)

        if(requestSuccessfull(request.status)){
            return true;
        }else{
            return false;
        }

    } catch (error) {
        return false;
    }
}

export const cancelRequisition = async (numRequisition) => {

    try {
        const request = await axios.delete(`requisicion/${numRequisition}`)

        if(requestSuccessfull(request.status)){
            return true;
        }else{
            return false;
        }

    } catch (error) {
        return false;
    }

}