export const notifyPositive = (message, duration = 2000) => {
  return {
    type: "positive",
    message: `<p style='font-size:medium;' class='q-mt-md'>${message}</p>`,
    timeout: duration,
    progress: true,
    html: true,
    position: "top",
    actions: duration > 2000 ? [{ label: "CERRAR", color: "yellow" }] : ""
  };
};

export const notifyNegative = (message) => {
  return {
    type: "negative",
    message: `<p style='font-size:medium;' class='q-mt-md'>${message}</p>`,
    actions: [{ label: "CERRAR", color: "yellow" }],
    html: true,
    position: "top"
  };
};
