/* This JS file is used to manage the request that are made by the agenda
  Here are all the operations of the appointments that are basically a CRUD
*/
import axios from 'axios';
import { requestSuccessfull } from "src/utils/operations"; //This is used to check if the response status of all request are successful

//This get the psych platforms information
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

//This get ALL the active appointments of the users
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


//Gets All the hisotory of appointments that have been registered, it doesn't matter the state of the appointments
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

//This creates a new appointment
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

//this update and appointment
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

//this one change the state of the appointment to inactive and the status of the candidate (with his user id not with the candidate id)
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
