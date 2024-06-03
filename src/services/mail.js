import axios from "axios";
import { requestSuccessfull } from "src/utils/operations";

//These are just the email messages defined to send in every operation
export const scheduledAppointment = {
  subject: "Entrevista agendada!",
  firstText:
    "Es un placer confirmar que hemos agendado una entrevista contigo para el puesto(s) en Turbomaquinas S.A de C.V. a los que te haz postulado. Durante esta entrevista, discutiremos tus habilidades y experiencia en relación con el puesto. También tendrás la oportunidad de aprender más sobre nuestra empresa y hacer cualquier pregunta que puedas tener. Agradecemos tu interés en unirte a nuestro equipo y esperamos conocerte mejor durante la entrevista virtual. Los datos de la entrevista son los siguientes:",
  lastText:
    "Si tienes alguna pregunta o necesitas más información no dudes en contactarnos a este mismo correo.",
  emailType: "appointment",
};

export const modifiedAppointment = {
  subject: "Tu entrevista a sido modificada!",
  firstText:
    "Espero te encuentres bien. En nombre de Turbomaquinas S.A de C.V, te agradezco por tu interés en unirte a nuestro equipo y por haber enviado tu solicitud de empleo. Queremos informarte que hemos tenido que realizar un cambio en la cita de entrevista que teníamos programada contigo. La nueva fecha y hora para la entrevista es la siguiente:",
  lastText:
    "Agradecemos tu comprensión en esta situación. Estamos ansiosos por conocerte mejor y seguir adelante con el proceso para entrevistarte. Si tienes alguna pregunta o necesitas información adicional, no dudes en contactarnos a este mismo correo.",
  emailType: "appointment",
};

export const canceledAppointment = {
  subject: "Entrevista cancelada",
  firstText:
    "Lamentamos informarte que hemos tenido que cancelar la cita para realizar tu entrevista. Sin embargo, estamos trabajando en la reprogramación y te contactaremos pronto para informarte sobre tu nueva cita. Apreciamos tu comprensión y paciencia.",
  lastText:
    "Agradecemos tu paciencia y compromiso con Turbomaquinas S.A de C.V.",
  emailType: "not required",
};

export const canceledRequisitionTemplate = (email, name, jobName) => {
  return {
    to: email,
    subject: "Vacante Cancelada",
    greeting: `Hola ${name}`,
    firstText: `Queremos agradecerte por tu interés en nuestra oferta de trabajo aplicando al puesto ${jobName}.`,
    secondText:
      "De momento la empresa ha decidido cancelar esta vacante, sin embargo te invitamos a estar atento ante una posible reapertura de la vacante en el portal.",
    lastText:
      "¡Te deseamos mucha suerte en tu búsqueda de empleo! ¡Saludos, y hasta pronto!",
  };
};

export const sendCanceledRequisitionEmail = async (email, name, jobName) => {
  const data = canceledRequisitionTemplate(email, name, jobName);
  try {
    const request = await axios.post(`/mail/send/requisitions/canceled`, data);
    if (requestSuccessfull(request.status)) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
};

const candidateNotSelectedTemplate = (email, name, jobName) => {
  return {
    to: email,
    subject: "Actualización sobre tu candidatura",
    greeting: `Hola ${name}.`,
    firstText: `Muchas gracias por tu interés en
    Turbomaquinas y por el tiempo que dedicaste durante todo el proceso
    de selección, aplicando al puesto ${jobName}.`,
    secondText:
      "Te escribimos para informarte que de momento consideramos que, para este puesto, tu perfil no se ajusta plenamente a nuestras necesidades actuales, sin embargo, guardaremos tu información en nuestra base de datos por si en el futuro tenemos alguna vacante para ti.",
    lastText:
      "¡Te deseamos mucha suerte en tu búsqueda de empleo! ¡Saludos, y hasta pronto!"
  };
}

export const sendCandidateNotSelectedEmail = async (email, name, jobName) => {
  const data = candidateNotSelectedTemplate(email, name, jobName);
  try {
    const request = await axios.post(`/mail/send/requisitions/candidates/not-selected`, data);
    if (requestSuccessfull(request.status)) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
};

//This is just the template, this method returns an object with the message predifined
const candidateSelectedTemplate = (email, name, jobName) => {
  return {
    to: email,
    subject: "Felicitaciones! Ha sido seleccionado!",
    greeting: `Estimado ${name}.`,
    firstText: `Nos complace comunicarle que ha sido seleccionado(a) para el puesto de ${jobName}. Su experiencia y habilidades profesionales se ajustan a los requisitos del puesto y estamos seguros de que tiene el potencial para tener éxito en este puesto.`,
    secondText: "Apreciamos su interés en nuestra empresa y el tiempo que dedicó a completar el proceso de selección. En breve, recibirá más información del equipo de Recursos Humanos sobre los próximos pasos del proceso de incorporación. Mientras tanto, si tiene alguna pregunta, no dude en contactarnos a este mismo correo.",
    lastText: "¡Felicitaciones por este éxito!"
  }
}

// This is the method to send an email to the selected candidates
export const sendCandidateSelectedEmail = async (email, name, jobName) => { //Receives the needed information to send the email
  const data = candidateSelectedTemplate(email, name, jobName); //this builds the email object to send
  try {
    const request = await axios.post(`/mail/send/requisitions/candidates/selected`, data); //send the email to the endpoint
    if (requestSuccessfull(request.status)) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
};

export const finishedAppointment = {
  subject: "Entrevista Completada!",
  firstText:
    "Me complace informarte que hemos completado la cita de entrevista que teníamos programada contigo. Valoramos el tiempo que invertiste en este proceso. Tu perfil y experiencia son de gran interés para nosotros. Pronto recibirás información adicional sobre el estado de tu solicitud a través de tu perfil en nuestra plataforma. Se te proporcionarán detalles sobre cualquier información necesaria para hacerte saber el estado de tu solicitud.",
  lastText:
    "Agradecemos tu compromiso con Turbomaquinas S.A de C.V. Si tienes alguna pregunta o necesitas información adicional, no dudes en contactarnos a este mismo correo.",
  emailType: "not required",
};

export const sendSecurityCode = (to, code) => {
  return {
    to: to,
    subject: `'${code}' es tu código de seguridad`,
    firstText: `Tu código para restablecer la contraseña es el siguiente:`,
    verificationCode: code,
    lastText: "Copia he ingresa este código en el campo de verificación",
    emailType: "authentication",
  };
};

export const passwordChange = (to, userName) => {
  return {
    to: to,
    subject: "Aviso de cambio de contraseña",
    name: userName,
    firstText: "Queremos comunicarte que tu contraseña a sido cambiada.",
    lastText:
      "Ahora podrás acceder a tu cuenta utilizando tu nueva contraseña. Si tienes alguna pregunta o necesitas información adicional, no dudes en contactarnos a este mismo correo.",
    emailType: "not required",
  };
};

//The main method to send an email message, in the type it receives the email that is going to send, and in the body you have to send the user email
export const sendEmail = async (type, data) => {
  try {
    const mailResponse = await axios.post(`/mail/send/${type}`, data);
    if (requestSuccessfull(mailResponse.status)) {
      return true;
    }
  } catch (error) {
    return false;
  }
};

export const sendPsychometricTestEmail = async (
  email,
  userName,
  platformUserName,
  userPassword
) => {
  const data = psychTestSendedTemplate(
    email,
    userName,
    platformUserName,
    userPassword
  );
  try {
    const request = await axios.post("/mail/send/psychometric-test-data", data);

    if (requestSuccessfull(request.status)) {
      return true;
    } else {
      return false;
    }
  } catch (error) {}
};

const psychTestSendedTemplate = (
  email,
  userName,
  platformUserName,
  userPassword
) => {
  return {
    to: email,
    subject: "Realización de la Prueba Psicométrica",
    userName: userName,
    firstText:
      "Como acordamos en la entrevista. Aquí tienes la información para realizar tu prueba psicométrica, solo necesitaras el siguiente usuario y contraseña:",
    platformUserName: platformUserName,
    userPassword: userPassword,
    secondText:
      "Para acceder la plataforma donde realizarás tu prueba psicométrica, solo sigue los siguientes pasos:",
    stepOne: "1.- Ingresa a la plataforma dando clic en el botón de ",
    stepTwo:
      "2.- Copia y pega el usuario y contraseña en la pantalla principal dentro de las casillas asignadas.",
    stepThree: "3.- Realiza tu registro con los datos personales solicitados.",
    complementText:
      "Y LISTO! Contesta tu evaluación psicométrica siguiendo las instrucciones.",
    lastText:
      "Si tienes alguna duda o algun problema para acceder a tu prueba, escribenos al correo reclutamiento@turbomaquinas.com y con gusto te ayudaremos.",
    link: "http://201.161.74.228/sidesiseph",
    btnText: "Comenzar prueba",
    emailSupport: "reclutamiento@turbomaquinas.com",
  };
};
