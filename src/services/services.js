import { getAxiosBaseUrl } from "src/services/profiles"
import { get } from "./request"

const userApplication = () => {
    return `solicitud/`
}

export const login = async (userName, password) => {
    const data = {
        service: `auth/${userName}/pass/${password}`,
        requestSuccessful: 200
    }
    
    return await get(data);

}




