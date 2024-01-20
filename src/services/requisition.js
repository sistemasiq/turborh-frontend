import axios from "axios";
import { requestSuccessfull } from "src/utils/operations";

export const createRequisition = async (requisitionData) => {
  try {
    const request = await axios.post(`requisitions`, requisitionData);

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
    const request = await axios.get(`requisitions`);

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
    const request = await axios.get(`requisitions/${numRequisition}`);

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
    const request = await axios.get(`requisitions/personal/${personalId}`);

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
    const request = await axios.get(`requisitions/state/${state}`);

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
    const request = await axios.put(`requisitions`, requisitionData);

    if (requestSuccessfull(request.status)) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
};

export const updateRequisitionStateByAdmin = async (numRequisition, updateByIng) => {
    try {
        const request = await axios.put(`requisitions/${numRequisition}/by-ing/${updateByIng}`)

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

        const request = await axios.put(`requisitions/state/${state}/num/${numRequisition}`)

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
        const request = await axios.put(`requisitions/${numRequisition}/note/${newNote}`)

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
        const request = await axios.delete(`requisitions/${numRequisition}`)

        if(requestSuccessfull(request.status)){
            return true;
        }else{
            return false;
        }

    } catch (error) {
        return false;
    }

}

export const completeRequisition = async (numRequisition) => {
  try {
    const request = await axios.put(`requisitions/complete/${numRequisition}`)

    if(requestSuccessfull(request.status)){
      return request.data;
    }else{
      return false;
  }

} catch (error) {
  return false;
}
}
