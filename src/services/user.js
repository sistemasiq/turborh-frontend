import axios from "axios";
import { requestSuccessfull } from "src/utils/operations";

export const logUser = async (userName, password) => {
  const body = {
    userName: userName,
    password: password,
  };

  try {
    const request = await axios.post(`users/login`, body);

    if (requestSuccessfull(request.status)) {
      return request.data;
    } else {
      console.log(request.status);
      return null;
    }
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getUserByUserName = async (userName) => {
  try {
    const request = await axios.get(`users/${userName}`);

    if (requestSuccessfull(request.status)) {
      return true;
    } else {
      console.log(request.status);
      return false;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const    getUserByCurp = async (curp) => {
  try {
    const request = await axios.get(`users/curp/${curp}`);

    if (requestSuccessfull(request.status)) {
      return true;
    } else {
      console.log(request.status);
      return false;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const createUser = async (userName, email, curp, password) => {
  const newUserData = {
    applicationId: 0,
    id: 0,
    userName: userName,
    email: email,
    curp: curp,
    password: password,
    role: "u",
  };

  try {

    const request = await axios.post(`users`, newUserData);

    if (requestSuccessfull(request.status)) {
      newUserData.id = request.data;
      return newUserData;
    } else {
      console.log(request.status);
      return null;
    }
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const updateUserImage = async (userId, imageUUID) => {
    try {
        const request = await axios.put(`users/${userId}/image/${imageUUID}`);

        if(requestSuccessfull(request.status)) {
            return true;
        }else{
            console.log("failed with status " + request.status)
            return false;
        }

    } catch (error) {
        console.log(error);
        return false;
    }
}

export const updateUserPsychometricTest = async (userId, uuid) => {
  try {
      const request = await axios.put(`users/${userId}/psychometric-test/${uuid}`);

      if(requestSuccessfull(request.status)) {
          return true;
      }else{
          console.log("failed with status " + request.status)
          return false;
      }

  } catch (error) {
      console.log(error);
      return false;
  }
}

export const updatePassword = async () => {

  const userCredentials = {

  }

  try {
    const request = await axios.put(`users/password`, userCredentials)

    if(requestSuccessfull(request.status)){
      return true;
    }
    else{
      return false;
    }

  } catch (error) {
    return false;
  }

}

export const getUserEmail = async (userName) => {

  try {
    const request = await axios.get(`users/email/${userName}`);

    if(requestSuccessfull(request.status)){

      return request.data;
    }else{
      return null;
    }


  } catch (error) {
    return null;
  }

}
