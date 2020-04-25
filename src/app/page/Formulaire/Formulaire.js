import LoiSnack from "@fuse/components/loiSnack";
import CharteSnack from "@fuse/components/charteSnack";
import history from "@history";
import { Button, IconButton, MenuItem } from "@material-ui/core";
import MicIcon from "@material-ui/icons/Mic";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import { addInformer, ModalAction } from "app/store/actions";
import axios from "axios";
import { DOMAINE } from "config";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { CheckboxWithLabel, TextField } from "formik-material-ui";
import React, { useEffect, useState } from "react";
import ReactGA from "react-ga";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";
import AboutModal from "../../../@fuse/components/aboutModal";
import associaMed from "../../img/associaMed.png";
import beecoop from "../../img/beecoop.png";
import esprit from "../../img/esprit.png";
import logo from "../../img/logo-plain.png";
// import ministere from "../../img/ministere.png";
import facebook from "../../img/social/facebook-icon.svg";
import instagram from "../../img/social/instagram-icon.svg";
import tunisieTelecom from "../../img/tunisieTelecom.png";
import "../../scss/welcome_page.scss";
import Sms from "../welcome/sms/sms";
import DateFnsUtils from "@date-io/date-fns";
import MicRecorder from "mic-recorder-to-mp3";
import * as yup from "yup";
import QuestionEducation from "@fuse/components/patientFormModal/QuestionEducation";

const useStyles = makeStyles((theme) => ({
  arabi: {
    flexDirection: "row-reverse",
  },
  root: {
    flexGrow: 1,
    paddingTop: "5rem",
  },
  paper: {
    height: 140,
    width: 100,
  },
  control: {
    padding: theme.spacing(2),
  },
  samu: {
    width: "80px",
    background: "rebeccapurple",
    color: "white",
    padding: "10px",
    display: "flex",
    alignItems: "center",
    position: "absolute",
    top: "50%",
  },
  subsamu: {
    color: "white",
  },
}));

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

const Formulaire = (props) => {
  const [question, setquestion] = useState([]);
  const [lengthFormStatic, setlengthFormStatic] = useState(0);
  const [lengthFormDynamic, setlengthFormDynamic] = useState(0);
  const [responses, setReponse] = useState({
    responses: [],
  });

  const [about, setAbout] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [data, setData] = useState({});

  const classes = useStyles();

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

  const submitForm = (data) => {
    const number = { number: data.phoneNumber };
    setData(data);

    axios
      .post(`${DOMAINE}/api/v1/sms/authentication`, {
        ...number,
      })
      .then((res) => {
        setVerificationCode(res.data.payload.verificationCode);
        props.ModalAction("sms");
      });
  };

  const submitPatientAfterVerification = () => {
    const newData = { ...responses, ...data };
    console.log(newData);
    axios
      .post(`${DOMAINE}/api/v1/patient`, { ...newData })
      .then((res) => {
        ReactGA.event({
          category: "Malade",
          action: "L'utilisateur a validé le formulaire de malade",
        });
        history.push("/envoyer/maladie");
      })
      .catch((error) => {
        if (error.response.data.code === 403) {
          ReactGA.event({
            category: "Malade",
            action: "L'utilisateur à été bloqué il doit attendre 6H",
          });
          alert(
            error.response.data.message
              .replace(
                "Patient with phone number",
                "Nous avons déjà reçu un formulaire avec ce numéro"
              )
              .replace(
                "can submit again in",
                "vous serez en mesure d'en renvoyer un autre que dans"
              )
          );
          window.location.reload();
        }
      });
  };

  const { i18n } = useTranslation("welcome");

  /* START FORM VARS */

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

  const getAllState = (data) => {
    updateResponse(data);
  };

  /* END FROM VARS */

  return (
    <div className="welcome-page">
      <LoiSnack />
      {charte && (
        <CharteSnack
          charte={charte}
          close={() => {
            setCharte(false);
          }}
        />
      )}
      {about && <AboutModal about={about} close={() => setAbout(false)} />}
      <div className="main-navbar">
        <div className="language-selection-container">
          <ul className="language-list">
            <li>
              <span
                className={i18n.language === "ar" ? "selected" : ""}
                onClick={() => i18n.changeLanguage("ar")}
              >
                AR
              </span>
            </li>
            <li>
              <span
                className={i18n.language === "fr" ? "selected" : ""}
                onClick={() => i18n.changeLanguage("fr")}
              >
                FR
              </span>
            </li>
          </ul>
        </div>
        <div className="social-container">
          <ul className="social-list">
            <li>
              <a
                href="https://www.facebook.com/%D9%85%D8%B9-%D8%A8%D8%B9%D8%B6%D9%86%D8%A7-Ensemble-106624560981010/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src={facebook} alt="facebook" />
              </a>
            </li>
            <li>
              <a
                href="https://www.instagram.com/maabaadhna/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src={instagram} alt="instagram" />
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="card-wrapper">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <h5 className="info">
            Vous n’avez droit qu’à un seul formulaire toutes les 6h
          </h5>
          <h5 className="info ar">
            من باب الانصاف، يتاح لكل شخص تعمير جذاذة واحدة كل 6 ساعات
          </h5>
        </div>

        <Formik
          initialValues={{
            acceptTerms: false,
            email: "",
            nom: "",
            prenom: "",
            adresse: "",
            mytel: "",
            zipcode: "",
            comment: "",
            sexe: "MALE",
            city: "ARIANA",
          }}
          validationSchema={PatientSchema}
          onSubmit={(values) => {
            const caste = {
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
            setPhoneNumber(values.mytel);
            setData(caste);
            submitForm(caste);
          }}
          render={({
            resetForm,
            submitForm,
            isSubmitting,
            values,
            setFieldValue,
          }) => (
            <Grid container className={classes.root} spacing={2}>
              <Grid
                item
                xs={12}
                style={{ display: "flex", justifyContent: "center" }}
                container
              >
                <Grid item xs={12} md={6}>
                  <h2
                    className="personnal-question-title"
                    style={{ textAlign: "center" }}
                  >
                    Données Personnelles معطيات شخصية
                  </h2>
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
                            width: "100%",
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
                          label="Prenom / الاسم"
                          name="prenom"
                          value={values.prenom}
                          variant="outlined"
                          style={{
                            margin: "0 12px",
                            width: "100%",
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
                            width: "100%",
                          }}
                        />
                      </div>
                      <div
                        style={{
                          margin: 10,
                        }}
                      >
                        <Field
                          select
                          component={TextField}
                          label="sexe / الجنس"
                          variant="outlined"
                          fullWidth
                          style={{
                            margin: "0 12px",
                            minWidth: "150px",
                            width: "100%",
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
                          fullWidth
                          style={{
                            margin: "0 12px",
                            minWidth: "150px",
                            width: "100%",
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
                            width: "100%",
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
                          label="Code Postal / رقم البريد"
                          name="zipcode"
                          value={values.zipcode}
                          variant="outlined"
                          style={{
                            margin: "0 12px",
                            width: "100%",
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
                          fullWidth
                          value={values.comment}
                          variant="outlined"
                          style={{
                            margin: "0 12px",
                            width: "100%",
                          }}
                        />
                      </div>

                      <div
                        style={{
                          textAlign: "center",
                          marginTop: "50px",
                          marginBottom: "50px",
                        }}
                      >
                        <h2
                          className="personnal-question-title"
                          style={{ marginBottom: "20px" }}
                        >
                          MESSAGE VOCAL
                        </h2>
                        <label
                          className="small"
                          style={{ textAlign: "center" }}
                        >
                          Vous avez 30 secondes pour décrire votre état et pour
                          qu'on puisse mieux vous diagnostiquer
                        </label>
                        <br></br>
                        <label
                          className="small"
                          style={{ textAlign: "center" }}
                        >
                          عندك 30 ثانية بش توصف حالتك و تعاوننا في عملية التشخيص
                        </label>
                        <br />
                        <div className="tim3">
                          <span
                            style={{ color: "red", cursor: "pointer" }}
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
                                disabled={
                                  stopRecord ? !isRecording : isRecording
                                }
                              >
                                <MicIcon />
                              </IconButton>
                            </div>
                          </span>
                        </div>
                        <div className="tim4">
                          <audio src={blobURL} controls="controls" />
                        </div>
                      </div>
                    </Form>
                  </MuiPickersUtilsProvider>
                </Grid>
                <Grid
                  item
                  xs={12}
                  md={6}
                  style={{ textAlign: "-webkit-center" }}
                >
                  {question &&
                    question
                      .filter((q) => {
                        return q.section === "CATEGORY_GENERAL";
                      })
                      .map((el, key) => {
                        return (
                          <Grid
                            item
                            xs={12}
                            md={6}
                            key={key}
                            className="question-list"
                            style={{ textAlign: "center" }}
                          >
                            <h2 style={{ marginBottom: "50px" }}>{el.label}</h2>
                            {el.questions.map((elem, i) => (
                              <QuestionEducation
                                index={i}
                                key={i}
                                getState={getAllState}
                                title={elem.fr_value}
                                description={elem.ar_value}
                                {...elem}
                                style={{ marginBottom: "20px" }}
                              />
                            ))}
                          </Grid>
                        );
                      })}
                </Grid>
              </Grid>
              <Grid item xs={12} spacing={2} container>
                {question &&
                  question
                    .filter((q) => {
                      return q.section !== "CATEGORY_GENERAL";
                    })
                    .map((el, key) => {
                      return (
                        <Grid
                          item
                          xs={12}
                          md={6}
                          key={key}
                          className="question-list"
                          style={{ textAlign: "center" }}
                        >
                          <h2 style={{ marginBottom: "50px" }}>{el.label}</h2>
                          {el.questions.map((elem, i) => (
                            <QuestionEducation
                              index={i}
                              key={i}
                              getState={getAllState}
                              title={elem.fr_value}
                              description={elem.ar_value}
                              {...elem}
                              style={{ marginBottom: "20px" }}
                            />
                          ))}
                        </Grid>
                      );
                    })}
              </Grid>

              <Grid item xs={12} container style={{ justifyContent: "center" }}>
                <div className="action-buttons">
                  <Button
                    className="cancel"
                    variant="outlined"
                    color="primary"
                    disabled={isSubmitting}
                    onClick={() => {
                      resetForm();
                    }}
                  >
                    Annuler
                  </Button>
                  <Button
                    className="submit"
                    variant="contained"
                    color="primary"
                    disabled={isSubmitting}
                    style={{ margin: "0 20px" }}
                    onClick={() => {
                      if (lengthFormStatic === lengthFormDynamic) {
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
              </Grid>
            </Grid>
          )}
        />

        <div className="partenariat">Agréée par | En partenariat avec</div>
        <ul className="logos">
          <li>
            <button onClick={() => setAbout(true)}>
              <img className="logo" src={logo} alt="logo" />
            </button>
          </li>
          <li>
            <a
              href="http://www.fmt.rnu.tn/index.php?id=55"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img className="associaMed" src={associaMed} alt="assciaMed" />
            </a>
          </li>
          {/* <li>
            <a
              href="http://www.santetunisie.rns.tn/fr/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img className="ministere" src={ministere} alt="ministere" />
            </a>
          </li> */}
          <li>
            <a
              href="http://www.tunisietelecom.tn"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                className="tunisieTelecom"
                src={tunisieTelecom}
                alt="tunisieTelecom"
              />
            </a>
          </li>
          <li>
            <a
              href="https://beecoop.co"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img className="beecoop" src={beecoop} alt="beecoop" />
            </a>
          </li>
          <li>
            <a
              href="http://esprit.tn/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img className="esprit" src={esprit} alt="esprit" />
            </a>
          </li>
        </ul>
        <div className="partenariat">Contactez Nous:</div>
        <ul className="logos" style={{ margin: "20px 0" }}>
          <li>
            <a href="mailto:Maabaadhna.corona@gmail.com">
              Maabaadhna.corona@gmail.com
            </a>
          </li>
        </ul>

        <Sms
          tel={phoneNumber}
          type={"patient"}
          history={history}
          data={data}
          submitFinalPatient={submitPatientAfterVerification}
          modalAction={props.ModalAction}
          verificationCode={verificationCode}
        />
      </div>
    </div>
  );
};

const mapStateToProps = ({ informer }) => ({ informer });

/* export default withStyles(styles, { withTheme: true })(Welcome); */

export default connect(mapStateToProps, { ModalAction, addInformer })(
  Formulaire
);
