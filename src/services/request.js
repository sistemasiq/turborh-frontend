import axios from "axios";


export const get = async (data) => {
  try {

    const request = await axios.get(`${data.service}`);

    return request.status === data.requestSuccessful ? true : false;
  } catch (error) {
    
    return false;
  }
};

const post = async (data) => {
  try {

    const request = await axios.get(`${data.service}`, data.form);

    return request.status === data.requestSuccessful ? true : false;
    
  } catch (error) {
    return false;
  }
};

const put = async (data) => {
  try {

    const request = await axios.get(`${data.service}`, data.form);

    return request.status === data.requestSuccessful ? true : false;
    
  } catch (error) {
    
    return false;
  }
};
