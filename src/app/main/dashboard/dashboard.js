import React, { useState, useEffect } from "react";
import { Button, Container, Grid } from "@material-ui/core";
import { get } from "lodash";

import { getPatient, getAllPatients, patchPatientByDoc } from "app/libs/apis";

import ClaimDialog from "./components/claim-dialog";

import "./dashboard.scss";

const listOfStatus = ["non-traité", "en cours de traitement", "traité"];

const Dashboard = () => {
  const [visible, setVisible] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [patient, setPatient] = useState({});
  const [allPatients, setAllPatients] = useState();

  useEffect(() => {
    getAllPatients().then(res => {
      setAllPatients(get(res, "data.payload.patients", {}));
    });
  }, []);

  function matchStatus(status) {
    let currentStatus = "ON_HOLD";
    switch (status) {
      case "non-traité":
        currentStatus = "ON_HOLD";
        break;
      case "en cours de traitement":
        currentStatus = "IN_PROGRESS";
        break;
      case "traité":
        currentStatus = "CLOSED";
        break;

      default:
        break;
    }
    return currentStatus;
  }

  const renderPatients = patients => {
    return patients.map(({ first_name, last_name, phone_number }, key) => (
      <div className="single-patient" key={key}>
        <h4>{first_name + " " + last_name}</h4>
        <span> {phone_number}</span>
      </div>
    ));
  };

  const renderColumns = () => {
    // console.log(allPatients);
    return listOfStatus.map((status, key) => {
      const filtredByStatus = allPatients[matchStatus(status)];
      return (
        <Grid key={key} item md={4} xs={12}>
          <div className={`single-column ${status.replace(/ /g, "-")}`}>
            <div className="column-title">
              {status} <span>({filtredByStatus.count})</span>
            </div>
            <div className="patients">
              {renderPatients(filtredByStatus.patients)}
            </div>
          </div>
        </Grid>
      );
    });
  };

  if (!allPatients) return <></>;

  return (
    <div className="dashboard">
      <Container maxWidth="md">
        <header>
          <h2>Bienvenue au dashboard du corp médical!</h2>
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
              //add dynamic status flag
              setIsSent(true);
              patchPatientByDoc(condition.toUpperCase(), patient.guid);
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
export default Dashboard;
