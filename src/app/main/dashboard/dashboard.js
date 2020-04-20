import React, { useState, useEffect } from "react";
import { Button, Container, TextField, Grid } from "@material-ui/core";
import { get } from "lodash";
import axios from "axios";
import { DOMAINE } from "config";
import {
  getPatient,
  getPatientSingle,
  getAllPatients,
  patchPatientByDoc,
  patchPatientByDocDenoncer,
} from "app/libs/apis";
import Patient from "./Patient";
import ClaimDialog from "./components/claim-dialog";
import PatientModal from "./components/PatientModal";
import { connect } from "react-redux";
import "./dashboard.scss";
import PatientDashboardFormModal from "@fuse/components/patientFormModal/PatientDashboardFormModal";
import { ModalAction } from "app/store/actions";

const listOfStatus = ["non-traité", "en cours de traitement", "traité"];

const Dashboard = (props) => {
  const [visible, setVisible] = useState(false);
  const [show, setShow] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [patient, setPatient] = useState({});
  const [search, setSearch] = useState("");
  const [allPatients, setAllPatients] = useState();

  //START FORM PATIENT
  const [question, setquestion] = useState([]);
  const [lengthFormStatic, setlengthFormStatic] = useState(0);
  const [lengthFormDynamic, setlengthFormDynamic] = useState(0);
  const [responses, setReponse] = useState({
    responses: [],
  });

  const renderLabelCategroy = (cat) => {
    switch (cat) {
      case "CATEGORY_GENERAL":
        return "Questions générales";
      case "CATEGORY_SYMPTOMS":
        return "Les symptômes";
      case "CATEGORY_ANTECEDENT":
        return "Questions médicales";
      default:
        break;
    }
  };

  useEffect(() => {
    axios
      .get(`${DOMAINE}/api/v1/question`)
      .then((res) => {
        if (res && res.data && res.data.payload && res.data.payload.questions) {
          let cleanData = [];
          let currentSome = 0;
          for (let key in res.data.payload.questions) {
            currentSome = currentSome + res.data.payload.questions[key].length;
            cleanData.push({
              section: key,
              label: renderLabelCategroy(key),
              key: key,
              questions: res.data.payload.questions[key],
            });
          }
          setquestion(cleanData);
          setlengthFormStatic(currentSome);
        } else {
          setquestion([]);
        }
      })
      .catch((err) => setquestion(err));
  }, []);

  const updateResponse = (data) => {
    const newResponse = responses;
    const findIt = newResponse[data.field].findIndex(
      (d) => d.question === data.extraData.id
    );
    if (findIt !== -1) {
      if (data.value) {
        newResponse[data.field].splice(findIt, 1, {
          value: data.value,
          question: data.extraData.id,
        });
      } else {
        newResponse[data.field].splice(findIt, 1);
        setlengthFormDynamic(lengthFormDynamic - 1);
      }
    } else {
      newResponse[data.field].push({
        value: data.value,
        question: data.extraData.id,
      });
      setlengthFormDynamic(lengthFormDynamic + 1);
    }
    setReponse(newResponse);
  };

  const SubmitForm = (data, status) => {
    const newData = { ...responses, ...data };
    axios
      .post(`${DOMAINE}/api/v1/secured/add-patient`, { ...newData })
      .then(async (res) => {
        await axios
          .patch(
            `${DOMAINE}/api/v1/secured/patient/${res.data.payload.patient.guid}`,
            {
              flag: status,
            }
          )
          .catch((err) => {
            //alert(err)
            throw new Error(err);
          });
        window.location.reload();
      })
      .catch((error) => {
        alert(error.response.data.message);
      });
  };

  //END FORM PATIENT

  useEffect(() => {
    getAllPatients().then((res) => {
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

  const renderPatients = (patients) => {
    return patients.map((patient, key) => (
      <Patient
        key={key}
        guid={patient.guid}
        text={patient.phone_number}
        title={patient.first_name + " " + patient.last_name}
        flag={patient.flag}
        created_at={patient.created_at}
        search={search}
        handleClick={() => {
          if (patient.status === "CLOSED") {
            setShow(true);
            getPatientSingle(patient.guid).then((res) => {
              setPatient(get(res, "data.payload.patient", {}));
            });
            setPatient(patient);
          }
        }}
      />
    ));
  };

  const renderColumns = () => {
    // console.log(allPatients);
    return listOfStatus.map((status, key) => {
      const filtredByStatus = allPatients[matchStatus(status)];
      return (
        <Grid key={key} item md={4} xs={12}>
          <div className={`single-column ${status.replace(/ /g, "-")}`}>
            <div
              className="column-title"
              style={{ textTransform: "capitalize" }}
            >
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

  const handleChange = (e) => {
    setSearch(e.target.value);
  };

  if (!allPatients) return <></>;

  return (
    <div className="dashboard">
      <Container maxWidth="md">
        <header>
          <h2>Bienvenue au dashboard du corps médical</h2>
          <p>Cliquez sur "traiter un dossier" pour traiter un patient</p>

          <Button
            variant="outlined"
            disabled={
              allPatients && allPatients["ON_HOLD"].patients.length === 0
            }
            onClick={() => {
              setVisible(true);
              getPatient().then((res) => {
                setPatient(get(res, "data.payload.patient", {}));
              });
            }}
          >
            Traiter un dossier
          </Button>
          <Button
            style={{ marginLeft: "32px" }}
            variant="outlined"
            onClick={() => {
              props.ModalAction("PatientForm");
            }}
          >
            Ajouter un dossier
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
              getAllPatients().then((res) => {
                setAllPatients(get(res, "data.payload.patients", {}));
              });
            }}
            onSendSMS={(condition, textToSend) => {
              //add dynamic status flag
              setIsSent(true);
              patchPatientByDoc(
                condition.toUpperCase(),
                patient.guid,
                textToSend
              );
              getAllPatients().then((res) => {
                setAllPatients(get(res, "data.payload.patients", {}));
              });
            }}
            onDenoncer={() => {
              setIsSent(true);
              patchPatientByDocDenoncer(patient.guid);
              getAllPatients().then((res) => {
                setAllPatients(get(res, "data.payload.patients", {}));
              });
            }}
            onClickNext={() => {
              setIsSent(false);
              getPatient().then((res) => {
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
            }}
          ></PatientModal>
        )}
        {lengthFormStatic !== 0 && (
          <PatientDashboardFormModal
            updateResponse={updateResponse}
            dataModal={question ? question : []}
            modalAction={props.ModalAction}
            submitFormCallback={SubmitForm}
            staticCount={lengthFormStatic}
            dynamicCount={lengthFormDynamic}
          />
        )}
      </Container>
    </div>
  );
};

const mapStateToProps = () => ({});

/* export default withStyles(styles, { withTheme: true })(Welcome); */

export default connect(mapStateToProps, { ModalAction })(Dashboard);
