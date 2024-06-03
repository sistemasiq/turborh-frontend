/*
IMPORTANT: ALL the whastApp messages are predefined in the twilio platform, to send a whatsApp message (business initiated conversation)
we need to create a template with the content template builder in the twilio platform to send that message to the users
the messages sended state and more information is at the monitor section and there are different options to see stats of the messages
and its performance
*/
import axios from "axios";
import { requestSuccessfull } from "src/utils/operations";

//This functions are just to create the message object for every whatsApp message
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

//this is the MAIN function to send the APPOINTMENTS messages
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
    const request = await axios.post(`/api/whatsapp/send/psych-test-data`, data);
    if (requestSuccessfull(request.status)) {
      return true;
    }
  } catch (error) {
    return false;
  }
};


export const sendCanceledRequisitionMessage = async (phoneNumber, name, jobName) => {

  const data = requisitionInformationTemplate(phoneNumber, name, jobName);

  try {
    const request = await axios.post(`/api/whatsapp/send/requisitions/canceled`, data);
    if (requestSuccessfull(request.status)) {
      return true;
    }
  } catch (error) {
    return false;
  }
}

export const sendUserNotSelectedMessage = async (phoneNumber, name, jobName) => {

  const data = requisitionInformationTemplate(phoneNumber, name, jobName);

  try {
    const request = await axios.post(`/api/whatsapp/send/requisitions/candidates/not-selected`, data);
    if (requestSuccessfull(request.status)) {
      return true;
    }
  } catch (error) {
    return false;
  }
}

export const sendUserSelectedMessage = async (phoneNumber, name, jobName) => {

  const data = requisitionInformationTemplate(phoneNumber, name, jobName);

  try {
    const request = await axios.post(`/api/whatsapp/send/requisitions/candidates/selected`, data);
    if (requestSuccessfull(request.status)) {
      return true;
    }
  } catch (error) {
    return false;
  }
}

export const sendLinkMessage = async(phoneNumber, userName, link) => {
  const data = psychTestLinkTemplate(phoneNumber, userName, link);
  try {
    const request = await axios.post(`/api/whatsapp/send/psych-forms-data`, data);
    if (requestSuccessfull(request.status)) {
      return true;
    }
  } catch (error) {
    return false;
  }
}

const psychTestSendedTemplate = (phoneNumber, userName, platformUserName, userPassword) => {
  return {
    "phoneNumber": phoneNumber,
    "userName": userName,
    "platformUserName": platformUserName,
    "userPassword": userPassword,
    "emailSupport": "reclutamiento@turbomaquinas.com"

  }
}
const psychTestLinkTemplate = (phoneNumber, userName, link) => {
  return {
    "phoneNumber": phoneNumber,
    "userName": userName,
    "link": link,
    "emailSupport": "reclutamiento@turbomaquinas.com"

  }
}


const requisitionInformationTemplate = (phoneNumber, name, jobName) => {
  return {
    "phoneNumber":phoneNumber,
    "name": name,
    "jobName":jobName
}
}

export const sendVerificationCodeMessage = async(data) => {
  try {
    const request = await axios.post(`/api/whatsapp/send/verification-code`, data);
    if (requestSuccessfull(request.status)) {
      return true;
    }
  } catch (error) {
    return false;
  }
}

export const verificationCodeData = (phoneNumber, verificationCode) => {
  return {
    phoneNumber: phoneNumber,
    verificationCode: verificationCode
  }
}

export const sendPasswordChangedInformation = async(data) => {
  try {
    const request = await axios.post(`/api/whatsapp/send/password-changed-information`, data);
    if (requestSuccessfull(request.status)) {
      return true;
    }
  } catch (error) {
    return false;
  }
}

export const passwordChangedInformation = (phoneNumber, supportEmail) => {
  return {
    phoneNumber: phoneNumber,
    supportEmail: supportEmail
  }
}
