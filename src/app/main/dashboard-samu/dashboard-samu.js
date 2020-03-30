import React, { useState, useEffect } from "react";
import { Button, Container, TextField, Grid } from "@material-ui/core";
import { get } from "lodash";

import {
  getPatient,
  getPatientSingle,
  getAllPatients,
  patchPatientBySAMU,
  patchPatientBySAMUTESTED
} from "app/libs/apis";
import Patient from "../dashboard/Patient";
import ClaimDialog from "./components/claim-dialog";
import PatientModal from "../dashboard/components/PatientModal";

import "../dashboard/dashboard.scss";

const listOfStatus = ["non-traité", "en cours de traitement", "traité"];

const Dashboard = () => {
  const [visible, setVisible] = useState(false);
  const [show, setShow] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [patient, setPatient] = useState({});
  const [search, setSearch] = useState("");
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
    return patients.map((patient, key) => {
      return (
        <Patient
          key={key}
          text={patient.phone_number}
          guid={patient.guid}
          title={patient.first_name + " " + patient.last_name}
          flag={patient.flag}
          search={search}
          positive={patient.test_positive}
          medicalStatus={patient.medical_status}
          handleClick={() => {
            if (patient.status === "CLOSED") {
              setShow(true);
              getPatientSingle(patient.guid).then(res => {
                setPatient(get(res, "data.payload.patient", {}));
              });
              setPatient(patient);
            }
          }}
        />
      );
    });
  };
  const renderPatientsTested = (patients, notToBeTested) => {
    return patients.map((patient, key) => {
      if (notToBeTested && patient.medical_status === "NOT_TO_BE_TESTED")
        return (
          <Patient
            key={key}
            text={patient.phone_number}
            guid={patient.guid}
            title={patient.first_name + " " + patient.last_name}
            flag={patient.flag}
            search={search}
            positive={patient.test_positive}
            medicalStatus={patient.medical_status}
            handleClick={() => {
              if (patient.status === "CLOSED") {
                setShow(true);
                getPatientSingle(patient.guid).then(res => {
                  setPatient(get(res, "data.payload.patient", {}));
                });
                setPatient(patient);
              }
            }}
          />
        );
      return <></>;
    });
  };

  const handleChange = e => {
    setSearch(e.target.value);
  };

  const renderColumns = () => {
    // console.log(allPatients);
    return listOfStatus.map((status, key) => {
      let notToBeTested = false;
      const filtredByStatus = allPatients[matchStatus(status)];
      let countToRender = filtredByStatus.count;
      let statusToRender = status;
      if (status === "traité") {
        statusToRender = "A Ne pas tester";
        notToBeTested = true;
        countToRender = filtredByStatus.patients.filter(function(el) {
          return el.medical_status === "NOT_TO_BE_TESTED";
        }).length;
      }
      return (
        <Grid key={key} item md={4} xs={12}>
          <div className={`single-column ${status.replace(/ /g, "-")}`}>
            <div
              className="column-title"
              style={{ textTransform: "capitalize" }}
            >
              {statusToRender} <span>({countToRender})</span>
            </div>
            <div className="patients">
              {notToBeTested
                ? renderPatientsTested(filtredByStatus.patients, notToBeTested)
                : renderPatients(filtredByStatus.patients)}
            </div>
          </div>
        </Grid>
      );
    });
  };

  const renderColumnsTested = () => {
    const filtredByStatus = allPatients["CLOSED"];

    const toTest = filtredByStatus.patients.filter(function(el) {
      return el.medical_status === "TO_BE_TESTED";
    });
    const positive = filtredByStatus.patients.filter(function(el) {
      return el.medical_status === "TESTED" && el.test_positive === true;
    });
    const negative = filtredByStatus.patients.filter(function(el) {
      return el.medical_status === "TESTED" && el.test_positive === false;
    });

    return (
      <>
        <Grid item md={4} xs={12}>
          <div className={`single-column en-cours-de-traitement`}>
            <div
              className="column-title "
              style={{ textTransform: "capitalize" }}
            >
              A tester
              <span>({toTest.length})</span>
            </div>
            <div className="patients">{renderPatients(toTest)}</div>
          </div>
        </Grid>
        <Grid item md={4} xs={12}>
          <div className={`single-column traité`}>
            <div
              className="column-title"
              style={{ textTransform: "capitalize" }}
            >
              négatif
              <span>({negative.length})</span>
            </div>
            <div className="patients">{renderPatients(negative)}</div>
          </div>
        </Grid>
        <Grid item md={4} xs={12}>
          <div className={`single-column non-traité`}>
            <div
              className="column-title"
              style={{ textTransform: "capitalize" }}
            >
              positif
              <span>({positive.length})</span>
            </div>
            <div className="patients">{renderPatients(positive)}</div>
          </div>
        </Grid>
      </>
    );
  };

  if (!allPatients) return <></>;

  return (
    <div className="dashboard">
      <Container maxWidth="md">
        <header>
          <h2>Bienvenue au dashboard du corps médical SAMU</h2>
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
          <TextField
            style={{ margin: "32px 0 8px 32px" }}
            id="standard-multiline-static"
            className="text-response"
            label="Recherche"
            placeholder="Recherche..."
            variant="outlined"
            value={search}
            onChange={handleChange}
          />
        </header>
        <Grid
          className="columns"
          style={{ justifyContent: "center" }}
          container
          spacing={4}
        >
          {renderColumns()}
        </Grid>
        <Grid className="columns" container spacing={4}>
          {renderColumnsTested()}
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
            onSendSMS={async (condition, textToSend) => {
              //add dynamic status flag
              setIsSent(true);
              await patchPatientBySAMU(patient.guid, textToSend, condition);
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
        {show && (
          <PatientModal
            visible={show}
            patient={patient}
            onClose={() => {
              setShow(false);
              getAllPatients().then(res => {
                setAllPatients(get(res, "data.payload.patients", {}));
              });
            }}
            onToTest={async positive => {
              //add dynamic status flag
              setIsSent(true);
              await patchPatientBySAMUTESTED(patient.guid, positive);
              getAllPatients().then(res => {
                setAllPatients(get(res, "data.payload.patients", {}));
              });
            }}
          ></PatientModal>
        )}
      </Container>
    </div>
  );
};
export default Dashboard;
