import axios from "axios";
import { requestSuccessfull } from "src/utils/operations";

export const getAllJobs = async () => {
    try {
        const request = await axios.get(`jobs`);

        if(requestSuccessfull(request.status)){
            return request.data;
        }else{
            return null;
        }

    } catch (error) {
        return null;
    }
}

export const getJobById = async (id) => {

    try {
        const request = await axios.get(`jobs/${id}`);

        if(requestSuccessfull(request.status)){
            return request.data;
        }else{
            return null;
        }

    } catch (error) {
        return null;
    }

}

export const getJobsByPersonalId = async (id) => {

    try {
        const request = await axios.get(`jobs/personal-id/${id}`);

        if(requestSuccessfull(request.status)){
            return request.data;
        }else{
            return null;
        }

    } catch (error) {
        return null;
    }

}

export const getAllDepartments = async () => {

    try {
        const request = await axios.get(`jobs/departments`);

        if(requestSuccessfull(request.status)){
            return request.data;
        }else{
            return null;
        }

    } catch (error) {
        return null;
    }

}

export const createJob = async (jobData) => {
    try {
        const request = await axios.post(`jobs`, jobData);

        if(requestSuccessfull(request.status)){
            return request.data;
        }else{
            return null;
        }

    } catch (error) {
        return null;
    }
}

export const updateJob = async (jobData) => {
    try {
        const request = await axios.put(`jobs`, jobData);

        if(requestSuccessfull(request.status)){
            return request.data;
        }else{
            return null;
        }

    } catch (error) {
        return null;
    }
}

export const updateJobState = async (jobData) => {
    try {
        const request = await axios.put(`jobs/state`, jobData);

        if(requestSuccessfull(request.status)){
            return request.data;
        }else{
            return null;
        }

    } catch (error) {
        return null;
    }
}
