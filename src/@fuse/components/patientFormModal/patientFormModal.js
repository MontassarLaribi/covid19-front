import DateFnsUtils from "@date-io/date-fns";
import { Modal } from "@fuse";
import { Button, IconButton, MenuItem } from "@material-ui/core";
import MicIcon from "@material-ui/icons/Mic";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import axios from "axios";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { CheckboxWithLabel, TextField } from "formik-material-ui";
import MicRecorder from "mic-recorder-to-mp3";
import * as React from "react";
import { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import * as yup from "yup";
import CharteSnack from "../charteSnack";
import LoiSnack from "../loiSnack";
import QuestionEducation from "./QuestionEducation";
import ReactGA from "react-ga";

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
  sexe: yup.string().required("Champ sexe est requis"),
  acceptTerms: yup.bool().oneOf([true], "Champ requis"),
  comment: yup.string().max(1500),
});

const Mp3Recorder = new MicRecorder({ bitRate: 128 });

const PatientFormModal = ({
  staticCount,
  dynamicCount,
  modalAction,
  dataModal,
  submitFormCallback,
  updateResponse,
  changePhoneNumber,
  setType,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [blobURL, setBlobURL] = useState("");
  const [play, setplay] = useState(true);
  const [stopRecord, setstopRecord] = useState(false);
  const [base64Audio, setbase64Audio] = useState("");

  // const { t } = useTranslation("welcome");

  useEffect(() => {
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
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
          responseType: "blob",
        }).then(function (response) {
          var reader = new FileReader();
          reader.readAsDataURL(response.data);
          reader.onloadend = function () {
            var base64data = reader.result;
            base64data = base64data.split(",")[1];
            setbase64Audio(base64data);
          };
        });
      })
      .catch((e) => console.log(e));
  };

  const start = () => {
    Mp3Recorder.start()
      .then(() => {
        setIsRecording(true);
        setplay(false);
        setstopRecord(true);
      })
      .catch((e) => console.error(e));
  };
  // TIMER START
  const [charte, setCharte] = useState(false);
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
        setMSeconds((mSeconds) => mSeconds + 1);
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

  const handleClose = (id) => {
    modalAction(id);
  };

  const getAllState = (data) => {
    updateResponse(data);
  };

  return (
    <Modal className="patientForm" id="PatientForm" ModalAction={modalAction}>
      <LoiSnack />
      {charte && (
        <CharteSnack
          charte={charte}
          close={() => {
            setCharte(false);
          }}
        />
      )}
      <div className="modal-header">
        <h4>FORMULAIRE DE MALADE</h4>
        <button onClick={() => handleClose("PatientForm")}>x</button>
      </div>
      <div className="modal-content">
        <h5 className="info">
          Vous n’avez droit qu’à un seul formulaire toutes les 6h
        </h5>
        <h5 className="info ar">
          من باب الانصاف، يتاح لكل شخص تعمير جذاذة واحدة كل 6 ساعات
        </h5>
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
          <button
            style={{ color: "red" }}
            onClick={() => {
              if (play) {
                start();
              } else {
                stop();
              }
              toggle();
            }}
          >
            <div style={{ textAlign: "center" }}>
              {play ? "Cliquez ICI" : mSeconds + "/30"}
              <IconButton
                color={play ? "primary" : "secondary"}
                aria-label="record"
                disabled={stopRecord ? !isRecording : isRecording}
              >
                <MicIcon />
              </IconButton>
            </div>
          </button>
        </div>
        <div className="tim4">
          <audio src={blobURL} controls="controls" />
        </div>

        <h4 className="personnal-question-title">
          Données Personnelles معطيات شخصية
        </h4>
        <Formik
          initialValues={{
            acceptTerms: false,
            email: "",
            nom: "",
            prenom: "",
            adresse: "",
            mytel: "",
            zipcode: "",
            sexe: "MALE",
            city: "ARIANA",
          }}
          validationSchema={PatientSchema}
          onSubmit={(values) => {
            const caste = {
              // acceptTerms: values.acceptTerms,
              firstName: values.prenom,
              lastName: values.nom,
              address: values.adresse,
              zipCode: values.zipcode,
              phoneNumber: values.mytel,
              gender: values.sexe,
              audio: base64Audio,
              city: values.city,
              comment: values.comment,
            };
            setType("patient");
            changePhoneNumber(values.mytel);
            submitFormCallback(caste);
          }}
          render={({
            resetForm,
            submitForm,
            isSubmitting,
            values,
            setFieldValue,
          }) => (
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <Form>
                <div
                  style={{
                    textAlign: "center",
                    margin: 10,
                    marginBottom: "30px",
                  }}
                >
                  <Field
                    component={CheckboxWithLabel}
                    type="checkbox"
                    Label={{
                      label: (
                        <div>
                          <h5>
                            <button
                              type="button"
                              onClick={() => setCharte(true)}
                              style={{ color: "royalblue" }}
                            >
                              J'accepte la Charte des Données Personnelles
                            </button>
                          </h5>
                          <h5 className="ar">
                            <button
                              type="button"
                              onClick={() => setCharte(true)}
                              style={{ color: "royalblue" }}
                            >
                              اوافق على ميثاق البيانات الشخصية
                            </button>
                          </h5>
                        </div>
                      ),
                    }}
                    name="acceptTerms"
                    variant="outlined"
                    style={{
                      margin: "0 12px",
                    }}
                  />
                  <ErrorMessage
                    component="p"
                    name="acceptTerms"
                    className="invalid-acceptTerms"
                  />
                </div>
                <div
                  style={{
                    margin: 10,
                  }}
                >
                  <Field
                    component={TextField}
                    type="text"
                    label="Nom / اللقب"
                    name="nom"
                    value={values.nom}
                    variant="outlined"
                    style={{
                      margin: "0 12px",
                    }}
                  />
                  <Field
                    component={TextField}
                    type="text"
                    label="Prenom / الاسم"
                    name="prenom"
                    value={values.prenom}
                    variant="outlined"
                    style={{
                      margin: "0 12px",
                    }}
                  />
                </div>
                <div
                  style={{
                    margin: 10,
                  }}
                >
                  <Field
                    component={TextField}
                    type="text"
                    label="Adresse / العنوان"
                    name="adresse"
                    value={values.adresse}
                    variant="outlined"
                    style={{
                      margin: "0 12px",
                    }}
                  />
                  <Field
                    select
                    component={TextField}
                    label="sexe / الجنس"
                    variant="outlined"
                    fullwidth
                    style={{
                      margin: "0 12px",
                      minWidth: "150px",
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
                    margin: 10,
                  }}
                >
                  <Field
                    select
                    component={TextField}
                    label="Ville / المدينة"
                    variant="outlined"
                    fullwidth
                    style={{
                      margin: "0 12px",
                      minWidth: "150px",
                    }}
                    name="city"
                    id="city"
                    value={values.city}
                  >
                    <MenuItem value={"ARIANA"}>ARIANA</MenuItem>
                    <MenuItem value={"BEJA"}>BEJA</MenuItem>
                    <MenuItem value={"BEN AROUS"}>BEN AROUS</MenuItem>
                    <MenuItem value={"BIZERTE"}>BIZERTE</MenuItem>
                    <MenuItem value={"GABES"}>GABES</MenuItem>
                    <MenuItem value={"GAFSA"}>GAFSA</MenuItem>
                    <MenuItem value={"JENDOUBA"}>JENDOUBA</MenuItem>
                    <MenuItem value={"KAIROUAN"}>KAIROUAN</MenuItem>
                    <MenuItem value={"KASSERINE"}>KASSERINE</MenuItem>
                    <MenuItem value={"KEBILI"}>KEBILI</MenuItem>
                    <MenuItem value={"KEF"}>KEF</MenuItem>
                    <MenuItem value={"MAHDIA"}>MAHDIA</MenuItem>
                    <MenuItem value={"MANOUBA"}>MANOUBA</MenuItem>
                    <MenuItem value={"MEDENINE"}>MEDENINE</MenuItem>
                    <MenuItem value={"MONASTIR"}>MONASTIR</MenuItem>
                    <MenuItem value={"NABEUL"}>NABEUL</MenuItem>
                    <MenuItem value={"SFAX"}>SFAX</MenuItem>
                    <MenuItem value={"SIDI BOUZID"}>SIDI BOUZID</MenuItem>
                    <MenuItem value={"SILIANA"}>SILIANA</MenuItem>
                    <MenuItem value={"SOUSSE"}>SOUSSE</MenuItem>
                    <MenuItem value={"TATAOUINE"}>TATAOUINE</MenuItem>
                    <MenuItem value={"TOZEUR"}>TOZEUR</MenuItem>
                    <MenuItem value={"TUNIS"}>TUNIS</MenuItem>
                    <MenuItem value={"ZAGHOUAN"}>ZAGHOUAN</MenuItem>
                  </Field>
                </div>
                <div
                  style={{
                    margin: 10,
                  }}
                >
                  <Field
                    component={TextField}
                    type="text"
                    label="Téléphone / رقم الهاتف"
                    name="mytel"
                    value={values.mytel}
                    variant="outlined"
                    style={{
                      margin: "0 12px",
                    }}
                  />

                  <Field
                    component={TextField}
                    type="text"
                    label="Code Postal / رقم البريد"
                    name="zipcode"
                    value={values.zipcode}
                    variant="outlined"
                    style={{
                      margin: "0 12px",
                    }}
                  />
                </div>
                <div
                  style={{
                    margin: 10,
                  }}
                >
                  <Field
                    component={TextField}
                    type="text"
                    label="Autres commentaires / تعليقات أخرى"
                    name="comment"
                    multiline
                    rows="8"
                    fullwidth
                    value={values.comment}
                    variant="outlined"
                    style={{
                      margin: "0 12px",
                      width: "100%",
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
                        ReactGA.event({
                          category: "Malade",
                          action:
                            "L'utilisateur a rempli le formulaire et attend l'SMS",
                        });
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
