import React, { useState, useEffect } from "react";
import { Button, Container, Grid } from "@material-ui/core";
import { get } from "lodash";

import { getPatient, getAllPatients, patchPatientBySAMU } from "app/libs/apis";

import ClaimDialog from "./components/claim-dialog";

import "./dashboard-samu.scss";

const listOfStatus = ["non-traité", "en cours de traitement", "traité"];

const DashboardSAMU = () => {
  const [visible, setVisible] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [patient, setPatient] = useState({});
  const [allPatients, setAllPatients] = useState();

  useEffect(() => {
    getAllPatients().then(res => {
      setAllPatients(get(res, "data.payload.patients", {}));
    });
  }, []);

  const filterPatients = status => {
    let currentStatus = "ON_HOLD";
    switch (status) {
      case "non-traité":
        currentStatus = "ON_HOLD";
        break;
      case "en cours de traitment":
        currentStatus = "IN_PROGRESS";
        break;
      case "traité":
        currentStatus = "CLOSED";
        break;

      default:
        break;
    }

    return allPatients ? allPatients[currentStatus].patients : [];
  };

  const renderPatients = status => {
    return filterPatients(status).map(
      ({ first_name, last_name, phone_number }) => (
        <div className="single-patient">
          <h4>{first_name + " " + last_name}</h4>
          <span> {phone_number}</span>
        </div>
      )
    );
  };

  const renderColumns = () => {
    return listOfStatus.map(elem => (
      <Grid item md={4} xs={12}>
        <div className={`single-column ${elem.replace(/ /g, "-")}`}>
          <div className="column-title">
            {elem} <span>({filterPatients(elem).length})</span>
          </div>
          <div className="patients">{renderPatients(elem)}</div>
        </div>
      </Grid>
    ));
  };

  return (
    <div className="dashboard">
      <Container maxWidth="md">
        <header>
          <h2>Bienvenue au dashboard de Samu</h2>
          <p>Cliquez sur "traiter un dossier" pour traiter un patient</p>

          <Button
            variant="outlined"
            disabled={
              allPatients && allPatients["ON_HOLD"].patients.length === 0
            }
            onClick={() => {
              setVisible(true);
              getPatient().then(res => {
                setPatient(get(res, "data.payload.patient", {}));
                /* patchPatientBySAMU(
                  "IN_PROGRESS",
                  get(res, "data.payload.patient.guid")
                );  */
              });
            }}
          >
            Traiter un dossier
          </Button>
        </header>
        <Grid className="columns" container spacing={4}>
          {renderColumns()}
        </Grid>
        {visible && (
          <ClaimDialog
            visible={visible}
            isSent={isSent}
            onClose={() => {
              setVisible(false);
              setIsSent(false);
              getAllPatients().then(res => {
                setAllPatients(get(res, "data.payload.patients", {}));
              });
            }}
            onSendSMS={condition => {
              setIsSent(true);
              patchPatientBySAMU(condition.toUpperCase(), patient.guid);
              getAllPatients().then(res => {
                setAllPatients(get(res, "data.payload.patients", {}));
              });
            }}
            onClickNext={() => {
              setIsSent(false);
              getPatient().then(res => {
                setPatient(get(res, "data.payload.patient", {}));
              });
            }}
            patient={patient}
            allPatientsCount={
              allPatients ? allPatients["ON_HOLD"].patients.length : 0
            }
          />
        )}
      </Container>
    </div>
  );
};
export default DashboardSAMU;
