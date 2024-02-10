import axios from "axios";
import { requestSuccessfull } from "src/utils/operations";

export const createCandidate = async (newCandidateData) => {
  try {
    const request = await axios.post(`candidates`, newCandidateData);

    if (requestSuccessfull(request.status)) {
      return request.data;
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
};

export const getCandidatesByRequisitionId = async (requisitionId) => {
  try {
    const request = await axios.get(`candidates/${requisitionId}`);

    if (requestSuccessfull(request.status)) {
      return request.data;
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
};

export const candidateExists = async (requisitionId, userId) => {
  try {
    const request = await axios.get(
      `candidates/exists/${requisitionId}/user-id/${userId}`
    );
    if (requestSuccessfull(request.status)) {
      return request.data;
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
};

export const getCandidateJobs = async (userId) => {
  try {
    const request = await axios.get(`candidates/jobs/${userId}`);
    if (requestSuccessfull(request.status)) {
      return request.data;
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
};

export const disableCandidate = async (requisitionId, userId) => {
  try {
    const request = await axios.delete(
      `candidates/${requisitionId}/user-id/${userId}`
    );

    if (requestSuccessfull(request.status)) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
};

export const disableAllCandidatesFromRequisition = async (requisitionId) => {
  try {
    const request = await axios.delete(
      `candidates/requisition-id/${requisitionId}`
    );
    if (requestSuccessfull(request.status)) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
};

export const disableCandidateAllRequisitions = async (userId) => {
  try {
    const request = await axios.delete(`candidates/${userId}`);

    if (requestSuccessfull(request.status)) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
};

export const enableCandidate = async (requisitionId, userId) => {
  try {
    const request = await axios.put(
      `candidates/activate/${requisitionId}/user-id/${userId}`
    );

    if (requestSuccessfull(request.status)) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
};

export const selectCandidate = async (candidateId) => {
  try {
    const request = await axios.put(`candidates/select/${candidateId}`);

    if (requestSuccessfull(request.status)) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
};

export const getAllCandidatesDiary = async () => {
  try {
    const request = await axios.get(`candidates/diary`);

    if (requestSuccessfull(request.status)) {
      return request.data;
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
};
