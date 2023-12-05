import axios from "axios";
import { requestSuccessfull } from "src/utils/operations";

export const createUserApplication = async (userApplicationData) => {
  try {
    const request = await axios.post(`user-applications`, userApplicationData);

    if(requestSuccessfull(request.status)){
      return request.data;
    }else{
      return null;
    }

  } catch (error) {
    return null;
  }
}

export const updateUserApplication = async (userApplicationData) => {
  try {
    const request = await axios.put(`user-applications`, userApplicationData);

    if(requestSuccessfull(request.status)){
      return request.data;
    }else{
      return null;
    }

  } catch (error) {
    return null;
  }
}

export const updateUserApplicationNotes = async (notes) => {
  try {
    const request = await axios.put(`user-applications/notes`, notes);

    if(requestSuccessfull(request.status)){
      return request.data;
    }else{
      return null;
    }

  } catch (error) {
    return null;
  }
}

export const updateUserApplicationState = async (userApplicationData) => {
  try {
    const request = await axios.put(`user-applications/state`, userApplicationData);

    if(requestSuccessfull(request.status)){
      return request.data;
    }else{
      return null;
    }

  } catch (error) {
    return null;
  }
}

export const getUserApplicationById = async (id) => {
  try {
    const request = await axios.get(`user-applications/${id}`);

    if(requestSuccessfull(request.status)){
      return request.data;
    }else{
      return null;
    }

  } catch (error) {
    return null;
  }
}

export const getUserApplicationNotesById = async (id) => {
  try {
    const request = await axios.get(`user-applications/notes/${id}`);

    if(requestSuccessfull(request.status)){
      return request.data;
    }else{
      return null;
    }

  } catch (error) {
    return null;
  }
}

export const getUserApplicationImage = async (id) => {
  try {
    const request = await axios.get(`user-applications/image/${id}`);

    if(requestSuccessfull(request.status)){
      return request.data;
    }else{
      return null;
    }

  } catch (error) {
    return null;
  }
}

