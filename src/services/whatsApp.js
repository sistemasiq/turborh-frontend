import axios from "axios";
import { requestSuccessfull } from "src/utils/operations";

export const presentialAppointmentData = (phoneNumber, name, date, hour) => {
  const data = {
    phoneNumber: phoneNumber,
    name: name,
    date: date,
    hour: hour,
    supportEmail: "reclutamiento@turbomaquinas.com",
  }
  return data;
};

export const virtualAppointmentData = (
  phoneNumber,
  name,
  date,
  hour,
  platformName,
  link
) => {
  return {
    phoneNumber: phoneNumber,
    name: name,
    date: date,
    hour: hour,
    platformName: platformName,
    link: link,
    supportEmail: "reclutamiento@turbomaquinas.com",
  };
};

export const canceledAppointmentData = (phoneNumber, name) => {
  return {
    phoneNumber: phoneNumber,
    name: name,
    supportEmail: "reclutamiento@turbomaquinas.com",
  };
};

export const finishedAppointmentData = (phoneNumber, name) => {
  return {
    phoneNumber: phoneNumber,
    name: name,
    supportEmail: "reclutamiento@turbomaquinas.com",
  };
};

export const sendWhatsAppMessage = async (type, data) => {
  try {
    const response = await axios.post(`/api/whatsapp/send/appointments/${type}`, data);
    if (response.status === 200) {
      return true;
    }
  } catch (error) {
    return false;
  }
};

export const sendPsychTestMessage= async (phoneNumber, userName, platformUserName, userPassword) => {

  const data = psychTestSendedTemplate(phoneNumber, userName, platformUserName, userPassword);
  try {
    const request = await axios.post(`/api/whatsapp/sender/psych-test-data`, data);
    if (requestSuccessfull(request.status)) {
      return true;
    }
  } catch (error) {
    return false;
  }
};

const psychTestSendedTemplate = (phoneNumber, userName, platformUserName, userPassword) => {
  return {
    "phoneNumber": phoneNumber,
    "userName": userName,
    "platformUserName": platformUserName,
    "userPassword": userPassword,
    "emailSupport": "reclutamiento@turbomaquinas.com"

  }
}

/*
export const sendMessage = async (data) => {
  try {
    const response = await axios.post(`/whatsapp/senders/new-appointment`,data);
    if (response.status === 200) {
      return true;
    }
  } catch (error) {
    return false;
  }
};
 */
