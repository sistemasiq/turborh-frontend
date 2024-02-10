import axios from 'axios';
import { requestSuccessfull } from "src/utils/operations";

export const getLinksList = async () => {
  try {
    const request = await axios.get(`/links/list`, {
      timeout: 18000,
    });
    if(requestSuccessfull(request.status)){
      return request.data;
    } else {
      return null;
    }
  } catch (error) {
    console.log("ERROR trying to get the meeting platforms information: ", error);
    return null;
  }
};

export const getAppointmentsCatalog = async () => {
  try {
    const request = await axios.get(`/api/agenda/appointments`, {
      timeout: 18000,
    });
    if(requestSuccessfull(request.status)){
      return request.data;
    } else {
      return null;
    }
  } catch (error) {
    console.log("ERROR trying to get appointments catalog: ", error);
    return null;
  }
};

export const getAppointmentsHistory = async (firstDateRange, secondDateRange) => {
  try {
    const request = await axios.get(`/api/agenda/appointments/history?firstDate=${firstDateRange}&lastDate=${secondDateRange}`, {
      timeout: 18000,
    });
    if(requestSuccessfull(request.status)){
      return request.data;
    } else {
      return null;
    }
  } catch (error) {
    console.log("ERROR trying to get the appointments history: ", error);
    return null;
  }
};

export const postAppointment = async (data) => {
  try {
    const request = await axios.post(`/api/agenda/appointments`, data);
    if(requestSuccessfull(request.status)){
      return request.data;
    } else {
      return null;
    }
  } catch (error) {
    console.log("ERROR trying to post a new appointment: ", error);
    return null;
  }
};

export const putAppointment = async (data) => {
  try {
    const request = await axios.put(`/api/agenda/appointments`, data);
    if(requestSuccessfull(request.status)){
      return request.data;
    } else {
      return null;
    }
  } catch (error) {
    console.log("ERROR trying to put an appointment: ", error);
    return null;
  }
};

export const deleteAppointment = async (candidateStatus, userId, appointmentStatus, appointmentId) => {
  try {
    const request = await axios.delete(`/api/agenda/appointments?candidateStatus=${candidateStatus}&userID=${userId}&appointmentStatus=${appointmentStatus}&appointmentId=${appointmentId}`);
    if(requestSuccessfull(request.status)){
      return true;
    } else {
      return null;
    }
  } catch (error) {
    console.log("ERROR trying to delete an appointment: ", error);
    return null;
  }
};
