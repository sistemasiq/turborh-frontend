//true = dev mode
//false = production mode
const dev = false;

/* BACKEND FUNCIONAL ELASTIC BEANSTALK: http://TurboMBERH-env.eba-imamt22j.us-east-2.elasticbeanstalk.com
BACKEND DE PRUEBAS ELASTIC BEANSTALK: http://test-back-end-1.eba-75di3x8z.us-east-2.elasticbeanstalk.com
*/

export const getAxiosBaseUrl = () => {
  return dev ? "http://localhost:5000" : "http://TurboMBERH-env.eba-imamt22j.us-east-2.elasticbeanstalk.com";
};

export const getS3UploadUrl = () => {
  return dev
    ? "http://localhost:5000/upload"
    : "http://TurboMBERH-env.eba-imamt22j.us-east-2.elasticbeanstalk.com/upload";
};

export const getS3FileUrl = (folderPath, fileName) => {
  return dev
    ? `http://localhost:5000/files/${fileName}/path/${folderPath}`
    : `http://TurboMBERH-env.eba-imamt22j.us-east-2.elasticbeanstalk.com/files/${fileName}/path/${folderPath}`;
};

export const getImageSource = (imgName) => {
  return dev ? `/src/assets/img/${imgName}` : `~/assets/${imgName}`;
};

export const getUserRoleRoute = (userRole) => {
  return userRole === "u" ? "/userHome/perfil" : "/home";
};

export const getUserRoute = () => {
  return "/userHome/perfil";
};

export const getAdminRoute = () => {
  return "/home";
};


//DEV and Prod configuration in Turbomaquinas´s server
/*
export const getAxiosBaseUrl = () => {
  return dev ? "http://localhost:5000" : "http://192.168.20.59:8181";
};

export const getS3UploadUrl = () => {
  return dev
    ? "http://localhost:5000/upload"
    : "http://192.168.20.59:8181/upload";
};

export const getS3FileUrl = (folderPath, fileName) => {
  return dev
    ? `http://localhost:5000/files/${fileName}/path/${folderPath}`
    : `http://192.168.20.59:8181/files/${fileName}/path/${folderPath}`;
};
*/
