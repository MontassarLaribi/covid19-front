import DateFnsUtils from "@date-io/date-fns";
import { Modal } from "@fuse";
import { Button, MenuItem, IconButton } from "@material-ui/core";
import MicIcon from "@material-ui/icons/Mic";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import axios from "axios";
import { Field, Form, Formik } from "formik";
import { TextField } from "formik-material-ui";
import MicRecorder from "mic-recorder-to-mp3";
import * as React from "react";
import { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import QuestionEducation from "./QuestionEducation";
import * as yup from "yup";
import LoiSnack from "../loiSnack";

const PatientSchema = yup.object().shape({
  mytel: yup
    .string()
    .matches(/^[0-9]{8}$/, "Doit être 8 chiffres")
    .required("Champ téléphone requis"),
  zipcode: yup
    .number("Nombre positif")
    .required("Champ age est requis")
    .typeError("Zip est un nombre")
    .positive("Nombre positif")
    .integer("Nombre positif"),
  nom: yup.string().required("Champ nom est requis"),
  adresse: yup.string().required("Champ adresse est requis"),
  prenom: yup.string().required("Champ prenom est requis"),
  sexe: yup.string().required("Champ sexe est requis")
});

navigator.getUserMedia =
  navigator.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia ||
  navigator.msGetUserMedia;

const Mp3Recorder = new MicRecorder({ bitRate: 128 });

const PatientFormModal = ({
  staticCount,
  dynamicCount,
  modalAction,
  dataModal,
  submitFormCallback,
  updateResponse
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [blobURL, setBlobURL] = useState("");
  const [isBlocked, setIsBlocked] = useState(false);
  const [play, setplay] = useState(true);
  const [stopRecord, setstopRecord] = useState(false);
  const [base64Audio, setbase64Audio] = useState("");

  useEffect(() => {
    navigator.getUserMedia(
      { audio: true },
      () => {
        console.log("Permission Granted");
        setIsBlocked(false);
      },
      () => {
        console.log("Permission Denied");
        setIsBlocked(true);
      }
    );
  });
  const stop = () => {
    Mp3Recorder.stop()
      .getMp3()
      .then(([buffer, blob]) => {
        const blobURL = URL.createObjectURL(blob);
        setIsRecording(false);
        setBlobURL(blobURL);
        setplay(true);
        setstopRecord(false);
        axios({
          method: "get",
          url: blobURL,
          responseType: "blob"
        }).then(function(response) {
          var reader = new FileReader();
          reader.readAsDataURL(response.data);
          reader.onloadend = function() {
            var base64data = reader.result;
            base64data = base64data.split(",")[1];
            setbase64Audio(base64data);
          };
        });
      })
      .catch(e => console.log(e));
  };

  const start = () => {
    if (isBlocked) {
      console.log("Permission Denied");
    } else {
      Mp3Recorder.start()
        .then(() => {
          setIsRecording(true);
          setplay(false);
          setstopRecord(true);
        })
        .catch(e => console.error(e));
    }
  };
  // TIMER START
  const [mSeconds, setMSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);

  function toggle() {
    setIsActive(!isActive);
    setMSeconds(0);
  }

  function reset() {
    setMSeconds(0);
    setIsActive(false);
  }
  useEffect(() => {
    let interval = null;
    if (isActive && mSeconds < 30) {
      interval = setInterval(() => {
        setMSeconds(mSeconds => mSeconds + 1);
      }, 1000);
    } else if (!isActive && mSeconds !== 0) {
      clearInterval(interval);
    }
    if (mSeconds >= 30) {
      clearInterval(interval);
      stop();
      reset();
    }
    return () => clearInterval(interval);
  }, [isActive, mSeconds]);

  const handleClose = id => {
    modalAction(id);
  };

  const getAllState = data => {
    updateResponse(data);
  };

  console.log("dynamicCount,  staticCount,", dynamicCount, staticCount);
  return (
    <Modal className="patientForm" id="PatientForm" ModalAction={modalAction}>
      <LoiSnack />
      <div className="modal-header">
        <h4>FORMULAIRE DE MALADE</h4>
        <button onClick={() => handleClose("PatientForm")}>x</button>
      </div>
      <div className="modal-content">
        {dataModal &&
          dataModal.map((el, key) => {
            return (
              <div key={key} className="question-list">
                <h4>{el.label}</h4>
                {el.questions.map((elem, i) => (
                  <QuestionEducation
                    index={i}
                    key={i}
                    getState={getAllState}
                    title={elem.fr_value}
                    description={elem.ar_value}
                    {...elem}
                  />
                ))}
              </div>
            );
          })}
        <h4 className="personnal-question-title">MESSAGE VOCAL</h4>
        <label className="small">
          Vous avez 30 secondes pour décrire votre état et pour qu'on puisse
          mieux vous diagnostiquer
        </label>
        <br></br>
        <label className="small" style={{ float: "right" }}>
          عندك 30 ثانية بش توصف حالتك و تعاوننا في عملية التشخيص
        </label>
        <br />
        <div className="tim3">
          <div style={{ textAlign: "center" }}>
            {play ? "Cliquez ICI" : mSeconds + "/30"}
            <IconButton
              color={play ? "primary" : "secondary"}
              aria-label="record"
              onClick={() => {
                if (play) {
                  start();
                } else {
                  stop();
                }
                toggle();
              }}
              disabled={stopRecord ? !isRecording : isRecording}
            >
              <MicIcon />
            </IconButton>
            <br></br>
            <div className="tim4">
              <audio src={blobURL} controls="controls" />
            </div>
          </div>
        </div>

        <h4 className="personnal-question-title">
          Données Personnelles معطيات شخصية
        </h4>
        <Formik
          initialValues={{
            email: "",
            nom: "",
            prenom: "",
            adresse: "",
            mytel: "",
            zipcode: "",
            sexe: "MALE"
          }}
          validationSchema={PatientSchema}
          onSubmit={(values, { setSubmitting }) => {
            const caste = {
              firstName: values.prenom,
              lastName: values.nom,
              address: values.adresse,
              zipCode: values.zipcode,
              phoneNumber: values.mytel,
              gender: values.sexe,
              audio: base64Audio
            };
            submitFormCallback(caste);
          }}
          render={({
            resetForm,
            submitForm,
            isSubmitting,
            values,
            setFieldValue
          }) => (
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <Form>
                <div
                  style={{
                    margin: 10
                  }}
                >
                  <Field
                    component={TextField}
                    type="text"
                    label="Nom"
                    name="nom"
                    value={values.nom}
                    variant="outlined"
                    style={{
                      margin: "0 12px"
                    }}
                  />
                  <Field
                    component={TextField}
                    type="text"
                    label="Prenom"
                    name="prenom"
                    value={values.prenom}
                    variant="outlined"
                    style={{
                      margin: "0 12px"
                    }}
                  />
                </div>
                <div
                  style={{
                    margin: 10
                  }}
                >
                  <Field
                    component={TextField}
                    type="text"
                    label="Adresse"
                    name="adresse"
                    value={values.adresse}
                    variant="outlined"
                    style={{
                      margin: "0 12px"
                    }}
                  />
                  <Field
                    select
                    component={TextField}
                    label="sexe"
                    variant="outlined"
                    fullwidth="true"
                    style={{
                      margin: "0 12px"
                    }}
                    name="sexe"
                    id="sexe"
                    value={values.sexe}
                  >
                    <MenuItem value={"MALE"}>Homme</MenuItem>
                    <MenuItem value={"FEMALE"}>Femme</MenuItem>
                  </Field>
                </div>
                <div
                  style={{
                    margin: 10
                  }}
                >
                  <Field
                    component={TextField}
                    type="text"
                    label="Téléphone"
                    name="mytel"
                    value={values.mytel}
                    variant="outlined"
                    style={{
                      margin: "0 12px"
                    }}
                  />

                  <Field
                    component={TextField}
                    type="text"
                    label="Code Postal"
                    name="zipcode"
                    value={values.zipcode}
                    variant="outlined"
                    style={{
                      margin: "0 12px"
                    }}
                  />
                </div>

                <div className="action-buttons">
                  <Button
                    className="cancel"
                    variant="outlined"
                    color="primary"
                    disabled={isSubmitting}
                    onClick={() => {
                      resetForm();
                      handleClose("PatientForm");
                    }}
                  >
                    Annuler
                  </Button>
                  <Button
                    className="submit"
                    variant="contained"
                    color="primary"
                    disabled={isSubmitting}
                    onClick={() => {
                      if (staticCount === dynamicCount) {
                        submitForm();
                      } else {
                        alert("Merci de répondre à toutes les questions");
                      }
                    }}
                  >
                    Valider
                  </Button>
                </div>
              </Form>
            </MuiPickersUtilsProvider>
          )}
        />
      </div>
    </Modal>
  );
};

export default withRouter(PatientFormModal);
