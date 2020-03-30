import axios from "axios";
import { DOMAINE } from "config";

export const getPatient = async () => {
  const response = await axios
    .get(`${DOMAINE}/api/v1/secured/treat-patient`)
    .catch(err => {
      throw new Error(err);
    });

  return response;
};

export const getPatientSingle = async guid => {
  const response = await axios
    .get(`${DOMAINE}/api/v1/secured/patient/${guid}`)
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

export const patchPatientByDoc = async (status, guid, textToSend) => {
  if (guid) {
    const response = await axios
      .patch(`${DOMAINE}/api/v1/secured/patient/${guid}`, {
        flag: status
      })
      .catch(err => {
        //alert(err)
        throw new Error(err);
      });
    await axios
      .post(`${DOMAINE}/api/v1/secured/sms/consultation/${guid}`, {
        content: textToSend
      })
      .catch(err => {
        //alert(err)
        throw new Error(err);
      });
    return response;
  }
};

export const patchPatientByDocDenoncer = async guid => {
  if (guid) {
    const response = await axios
      .patch(`${DOMAINE}/api/v1/secured/denounce-patient/${guid}`)
      .catch(err => {
        //alert(err)
        throw new Error(err);
      });
    return response;
  }
};

export const patchPatientBySAMU = async (guid, textToSend, condition) => {
  if (guid) {
    const response = await axios
      .patch(`${DOMAINE}/api/v1/secured/patient/${guid}`, {
        emergencyStatus: "CLOSED"
      })
      .catch(err => {
        //alert(err)
        throw new Error(err);
      });
    await axios
      .patch(`${DOMAINE}/api/v1/secured/patient-medical-status/${guid}`, {
        medicalStatus: condition
      })
      .catch(err => {
        //alert(err)
        throw new Error(err);
      });
    await axios
      .post(`${DOMAINE}/api/v1/secured/sms/consultation/${guid}`, {
        content: textToSend
      })
      .catch(err => {
        //alert(err)
        throw new Error(err);
      });
    return response;
  }
};
export const patchPatientBySAMUTESTED = async (guid, positive) => {
  if (guid) {
    await axios
      .patch(`${DOMAINE}/api/v1/secured/patient-medical-status/${guid}`, {
        medicalStatus: "TESTED"
      })
      .catch(err => {
        //alert(err)
        throw new Error(err);
      });
    const response = await axios
      .patch(`${DOMAINE}/api/v1/secured/patient-test-result/${guid}`, {
        testPositive: positive
      })
      .catch(err => {
        //alert(err)
        throw new Error(err);
      });
    return response;
  }
};
