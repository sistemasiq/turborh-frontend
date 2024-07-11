import axios from "axios";
import { requestSuccessfull } from "src/utils/operations";
import { useLocalStorageStore } from "src/stores/localStorage";
import { useRequisitionStore } from "src/stores/requisition";
import { useAuthStore } from "src/stores/auth";
import { storeToRefs } from "pinia";

const useLocalStorage = useLocalStorageStore();
const useAuth = useAuthStore()
const useRequisition = useRequisitionStore();

const { user, logged } = storeToRefs(useAuth);


export const removeHeaderAuthorization = () =>{

  delete axios.defaults.headers.common["Authorization"];
}

export const setHeaderAuthorization = (token) => {
  axios.defaults.headers.common['Authorization'] = token;
}

export const logOut = () => {
  useLocalStorage.remove("user");
  useLocalStorage.remove("logged");
  user.value = {};
  logged.value = false;
  removeHeaderAuthorization();
  useRequisition.clearStore();
};

export const logUser = async (userName, password) => {
  const body = {
    userName: userName,
    password: password,
  };

  try {
    const request = await axios.post(`users/login`, body);

    if (requestSuccessfull(request.status)) {
      setHeaderAuthorization(request.data.token)
      return request.data;
    } else {
      console.log("ERROR: ", request.status )
      return null;
    }
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getUserByUserName = async (userName) => {
  try {
    const request = await axios.get(`users/validate-by/name/${userName}`);

    if (requestSuccessfull(request.status)) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const getUserByCurp = async (curp) => {
  try {
    const request = await axios.get(`users/validate-by/curp/${curp}`);

    if (requestSuccessfull(request.status)) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const getUserByEmail = async (email) => {
  try {
    const request = await axios.get(`users/validate-by/email/${email}`);

    if (requestSuccessfull(request.status)) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const createUser = async (userName, email, curp, password) => {
  let newUserData = {
    applicationId: 0,
    id: 0,
    userName: userName,
    email: email,
    curp: curp,
    password: password,
    role: "u",
  };

  try {
    const request = await axios.post(`users/register`, newUserData);

    if (requestSuccessfull(request.status)) {
      newUserData = request.data;
      setHeaderAuthorization()
      return newUserData;
    } else {
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

    if (requestSuccessfull(request.status)) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const updateUserPsychometricTest = async (userId, uuid) => {
  try {
    const request = await axios.put(
      `users/${userId}/psychometric-test/${uuid}`
    );

    if (requestSuccessfull(request.status)) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const updateUserPsychometricTestByApplicationId = async (applicationId, uuid) => {
  try {
    const request = await axios.put(
      `users/${applicationId}/psychometric-test-by-application-id/${uuid}`
    );

    if (requestSuccessfull(request.status)) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const updatePassword = async () => {
  const userCredentials = {};

  try {
    const request = await axios.put(`users/password`, userCredentials);

    if (requestSuccessfull(request.status)) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
};

export const getUserEmail = async (userName) => {
  try {
    const request = await axios.get(`users/email/${userName}`);

    if (requestSuccessfull(request.status)) {
      return request.data;
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
};

export const getPsychometricPlatforms = async () => {
  try {
    const request = await axios.get(`api/pysch-platforms`);

    if (requestSuccessfull(request.status)) {
      return request.data;
    }
  } catch (error) {
    console.log(
      "Something went wrong while getting the psychometric platforms data: " +
        error
    );
    return null;
  }
};

export const updatePsychTestCredentials = async (
  userNameForPsychTests,
  passwordForPsychTest,
  psychTestPlatformId,
  userId
) => {
  const data = {
    psychTestStatus: "E", //this E means that the status of the psych test data has been sended to the user, NOTE: Ajala ese inglich
    userNameForPsychPlatform: userNameForPsychTests,
    userPasswordForPsychPlatform: passwordForPsychTest,
    psychPlatformID: psychTestPlatformId,
    userId: userId,
  };

  try {
    const request = await axios.put("/users/psych-data", data);

    if(requestSuccessfull(request.status)){
      return true;
    }else{{
      return false;
    }}

  } catch (error) {
    return false;
  }
};


export const postUserPsychTestData = async (userId, psychPlatformId, psychPlatformUserName, psychPlatformPassword, userPsychPlatformStatus) => {
  const data = {
    userId: userId,
    psychPlatformId: psychPlatformId,
    psychPlatformUserName: psychPlatformUserName,
    psychPlatformPassword: psychPlatformPassword,
    userPsychPlatformStatus: userPsychPlatformStatus
  };
  console.log("POST OBJECT: ", data);
  try {
    const request = await axios.post("/users/psych-data", data)
    if(requestSuccessfull(request.status)){
      return true;
    }else{{
      return false;
    }}
  } catch (error) {
    console.log(error);
    return false;
  }
}

export const putUserPsychTestData = async(psychPlatformUserName, psychPlatformPassword, userId, psychPlatformId) => {
  const data = {
    psychPlatformUserName: psychPlatformUserName,
    psychPlatformPassword: psychPlatformPassword,
    userId: userId,
    psychPlatformId: psychPlatformId
  }
  console.log("PUT OBJECT: ", data);
  try {
    const request = await axios.put("/users/psych-data", data)
    if(requestSuccessfull(request.status)){
      return true;
    }else{{
      return false;
    }}
  } catch (error) {
    console.log(error);
    return false;
  }
}
