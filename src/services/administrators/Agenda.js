import axios from 'axios';
import { requestSuccessfull } from "src/utils/operations";

export const getLinksList = async () => {
  try {
    const request = await axios.get(`/links/list`, {
      timeout: 18000,
    });
    if(requestSuccessfull(request.status)){
      console.log("LINK DATA: ", request.data);
      return request.data;
    } else {
      console.log("getLinksList Request Status: ", request.status);
      return null;
    }
  } catch (error) {
    console.log("getLinksList ERROR: ", error);
    return null;
  }
};

export const getAppointmentsCatalog = async () => {
  try {
    const request = await axios.get(`/api/agenda/appointments`, {
      timeout: 18000,
    });
    if(requestSuccessfull(request.status)){
      console.log("Appointments Catalog DATA: ", request.data);
      return request.data;
    } else {
      console.log("getAppointmentsCatalog Request Status: ", request.status);
      return null;
    }
  } catch (error) {
    console.log("getAppointmentsCatalog ERROR: ", error);
    return null;
  }
};

export const getAppointmentsHistory = async (firstDateRange, secondDateRange) => {
  try {
    const request = await axios.get(`/api/agenda/appointments/history?firstDate=${firstDateRange}&lastDate=${secondDateRange}`, {
      timeout: 18000,
    });
    if(requestSuccessfull(request.status)){
      console.log("Appointments History DATA: ", request.data);
      return request.data;
    } else {
      console.log("getAppointmentsHistory Request Status: ", request.status);
      return null;
    }
  } catch (error) {
    console.log("getAppointmentsHistory ERROR: ", error);
    return null;
  }
};

export const postAppointment = async (data) => {
  try {
    const request = await axios.post(`/api/agenda/appointments`, data);
    if(requestSuccessfull(request.status)){
      console.log("post Appointment data: ", request.data);
      return request.data;
    } else {
      console.log("postAppointment Request Status: ", request.status);
      return null;
    }
  } catch (error) {
    console.log("postAppointment ERROR: ", error);
    return null;
  }
};

export const putAppointment = async (data) => {
  try {
    const request = await axios.put(`/api/agenda/appointments`, data);
    if(requestSuccessfull(request.status)){
      console.log("put Appointment data: ", request.data);
      return request.data;
    } else {
      console.log("putAppointment Request Status: ", request.status);
      return null;
    }
  } catch (error) {
    console.log("putAppointment ERROR: ", error);
    return null;
  }
};

export const deleteAppointment = async (candidateStatus, userId, appointmentStatus, appointmentId) => {
  try {
    const request = await axios.delete(`/api/agenda/appointments?candidateStatus=${candidateStatus}&userID=${userId}&appointmentStatus=${appointmentStatus}&appointmentId=${appointmentId}`);
    if(requestSuccessfull(request.status)){
      console.log("Delete Appointment data: ", request.status);
      return true;
    } else {
      console.log("Delete Request Status: ", request.status);
      return null;
    }
  } catch (error) {
    console.log("deleteAppointment ERROR: ", error);
    return null;
  }
};
