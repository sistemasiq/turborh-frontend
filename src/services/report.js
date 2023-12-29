import axios from "axios";
import { requestSuccessfull } from "src/utils/operations";
import { getAxiosBaseUrl } from "./profiles";

export const createRequisitionReport = async (numRequisition) => {
  try {
    const request = await axios.get(
      `reports/requisition?numRequisition=${numRequisition}&endpointURL=${getAxiosBaseUrl()}`,
      {
        responseType: "arraybuffer",
      }
    );
    if (requestSuccessfull(request.status)) {
      const blob = new Blob([request.data], { type: "application/pdf" });
      return URL.createObjectURL(blob);
    } else {
      return null;
    }
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const createUserApplicationReport = async (
  applicationId,
  createReportWithNotes
) => {

  try {
    const request = await axios.get(
      `reports/user-application?id=${applicationId}&addNotes=${createReportWithNotes}`,
      {
        responseType: "arraybuffer",
      }
    );

    if (requestSuccessfull(request.status)) {
      const blob = new Blob([request.data], { type: "application/pdf" });
      return URL.createObjectURL(blob);
    } else {
      return null;
    }
  } catch (error) {
    console.log(error);
    return null;
  }
};
