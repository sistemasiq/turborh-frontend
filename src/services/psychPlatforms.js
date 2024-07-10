import axios from "axios";
import { requestSuccessfull } from "src/utils/operations";

export const putUserPsychTestData = async(modifiedBy, psychPlatformName, link, psychPlatformId) => {
    const data = {
        modifiedBy: modifiedBy,
        psychPlatformName: psychPlatformName,
        link: link
    }
    try {
      const request = await axios.put(`/api/pysch-platforms/${psychPlatformId}`, data)
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