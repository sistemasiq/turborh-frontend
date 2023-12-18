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
    const request = await axios.get(`/appointment/list`, {
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
    const request = await axios.get(`/appointment/filter/date?firstDate=${firstDateRange}&lastDate=${secondDateRange}`, {
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

export const postAppointment = async (type, data) => {
  try {
    const request = await axios.post(`/appointment/${type}`, data);
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

export const putAppointment = async (type, data) => {
  try {
    const request = await axios.put(`/appointment/${type}`, data);
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
