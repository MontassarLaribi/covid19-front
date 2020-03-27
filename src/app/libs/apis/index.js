import axios from "axios";
import {DOMAINE} from "config"

export const getPatient = async () => {
  const response = await axios
    .get(`${DOMAINE}/api/v1/secured/treat-patient`)
    .catch(err => {
      throw new Error(err);
    });

  return response;
};

export const getAllPatients = async () => {
  const response = await axios
    .get(`${DOMAINE}/api/v1/secured/patient`)
    .catch(err => {
      throw new Error(err);
    });

  return response;
};

export const patchPatientByDoc = async (status, guid) => {
  if (guid) {
    const response = await axios
      .patch(
        `${DOMAINE}/api/v1/secured/patient/${guid}`,
        {
          flag: status
        }
      )
      .catch(err => {
        //alert(err)
        throw new Error(err);
      });
    return response;
  }
};

export const patchPatientBySAMU = async guid => {
  if (guid) {
    const response = await axios
      .patch(
        `${DOMAINE}/api/v1/secured/patient/${guid}`,
        {
          emergencyStatus: "CLOSED"
        }
      )
      .catch(err => {
        //alert(err)
        throw new Error(err);
      });
    return response;
  }
};
