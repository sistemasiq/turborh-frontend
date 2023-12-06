import axios from "axios";

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
