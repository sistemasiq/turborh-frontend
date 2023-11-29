import axios from "axios";
import { requestSuccessfull } from "src/utils/operations";


export const getAllPersonal = async () => {
    try {
        const request = await axios.get(`personal`);

        if(requestSuccessfull(request.status)) {
            return request.data;
        }else{
            return null;
        }

    } catch (error) {
        return null;
    }
}

export const getPersonalById = async (id) => {
    try {
        const request = await axios.get(`personal/${id}`);

        if(requestSuccessfull(request.status)) {
            return request.data;
        }else{
            return null;
        }

    } catch (error) {
        return null;
    }
}

export const getPersonalByName = async (name) => {
    try {
        const request = await axios.get(`personal/name/${name}`);

        if(requestSuccessfull(request.status)) {
            return request.data;
        }else{
            return null;
        }

    } catch (error) {
        return null;
    }
}