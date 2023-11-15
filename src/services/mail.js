import axios from "axios";

export const scheduledAppointment = {
  subject: "Entrevista agendada!",
  firstText:
    "Es un placer confirmar que hemos agendado una entrevista contigo para el puesto(s) en Turbomaquinas S.A de C.V. a los que te haz postulado. Durante esta entrevista, discutiremos tus habilidades y experiencia en relación con el puesto. También tendrás la oportunidad de aprender más sobre nuestra empresa y hacer cualquier pregunta que puedas tener. Agradecemos tu interés en unirte a nuestro equipo y esperamos conocerte mejor durante la entrevista virtual. Los datos de la entrevista son los siguientes:",
  lastText:
    "Si tienes alguna pregunta o necesitas más información no dudes en contactarnos a este mismo correo.",
  emailType: "required",
};

export const modifiedAppointment = {
  subject: "Tu entrevista a sido modificada!",
  firstText:
    "Espero te encuentres bien. En nombre de Turbomaquinas S.A de C.V, te agradezco por tu interés en unirte a nuestro equipo y por haber enviado tu solicitud de empleo. Queremos informarte que hemos tenido que realizar un cambio en la cita de entrevista que teníamos programada contigo. La nueva fecha y hora para la entrevista es la siguiente:",
  lastText:
    "Agradecemos tu comprensión en esta situación. Estamos ansiosos por conocerte mejor y seguir adelante con el proceso para entrevistarte. Si tienes alguna pregunta o necesitas información adicional, no dudes en contactarnos a este mismo correo.",
  emailType: "required",
};

export const canceledAppointment = {
  subject: "Entrevista cancelada",
  firstText:
    "Lamentamos informarte que hemos tenido que cancelar la cita para realizar tu entrevista. Sin embargo, estamos trabajando en la reprogramación y te contactaremos pronto para informarte sobre tu nueva cita. Apreciamos tu comprensión y paciencia.",
  lastText:
    "Agradecemos tu paciencia y compromiso con Turbomaquinas S.A de C.V.",
  emailType: "not required",
};

export const canceledRequisition = (emailToSend, recipientName, jobName) => {
  return {
    to: emailToSend,
    name: recipientName,
    subject: "Postulacion cancelada",
    firstText: `Lamentamos informarte que hemos tenido que cancelar su postulación al puesto '${jobName}'. Sin embargo, estamos trabajando en la reprogramación y te contactaremos pronto para informarte sobre nuevas vacantes. Apreciamos tu comprensión y paciencia.`,
    lastText:
      "Agradecemos tu paciencia y compromiso con Turbomaquinas S.A de C.V.",
    emailType: "not required",
  };
};

export const finishedAppointment = {
  subject: "Entrevista Completada!",
  firstText:
    "Me complace informarte que hemos completado la cita de entrevista que teníamos programada contigo. Valoramos el tiempo que invertiste en este proceso. Tu perfil y experiencia son de gran interés para nosotros. Pronto recibirás información adicional sobre el estado de tu solicitud a través de tu perfil en nuestra plataforma. Se te proporcionarán detalles sobre cualquier información necesaria para hacerte saber el estado de tu solicitud.",
  lastText:
    "Agradecemos tu compromiso con Turbomaquinas S.A de C.V. Si tienes alguna pregunta o necesitas información adicional, no dudes en contactarnos a este mismo correo.",
  emailType: "not required",
};

export const sendSecurityCode = (to, userName, code) => {
  return {
    to: to,
    subject: "Código de seguridad",
    name: userName,
    firstText: `Tu código para restablecer la contraseña es '${code}'`,
    lastText: "Copia he ingresa este código en el campo de verificación",
    emailType: "not required",
  };
};

export const passwordChange = (to, userName) => {
  return {
    to: to,
    subject: "Aviso de cambio de contraseña",
    name: userName,
    firstText: "Queremos comunicarte que tu contraseña a sido cambiada.",
    lastText:  "Ahora podrás acceder a tu cuenta utilizando tu nueva contraseña. Si tienes alguna pregunta o necesitas información adicional, no dudes en contactarnos a este mismo correo.",
    emailType: "not required",
  }
}

export const sendEmail = async (type, data) => {
  try {
    const mailResponse = await axios.post(`/mail/send/${type}`, data);
    if (mailResponse.status === 200) {
      return true;
    }
  } catch (error) {
    return false;
  }
};
