import DateFnsUtils from "@date-io/date-fns";
import QuestionEducationDoctor from "@fuse/components/patientFormModal/QuestionEducationDoctor";
import { Button, Container, MenuItem } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import { addInformer, ModalAction } from "app/store/actions";
import axios from "axios";
import { DOMAINE } from "config";
import { Field, Form, Formik } from "formik";
import { TextField } from "formik-material-ui";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import * as yup from "yup";
import "../../scss/welcome_page.scss";
import history from "@history";

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
  comment: yup.string().max(1500),
  status: yup
    .string()
    .oneOf(["STABLE", "SUSPECT", "URGENT"])
    .required("Champ requis"),
});

const FormulaireMedecin = (props) => {
  const [question, setquestion] = useState([]);
  const [responses, setReponse] = useState({
    responses: [],
  });

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
      }
    } else {
      newResponse[data.field].push({
        value: data.value,
        question: data.extraData.id,
      });
    }
    setReponse(newResponse);
  };

  const SubmitForm = (data, status) => {
    const newData = { ...responses, ...data };
    // console.log(newData);
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

  const getAllState = (data) => {
    updateResponse(data);
  };

  /* END FROM VARS */

  return (
    <>
      <div className="dashboard">
        <Container maxWidth="md">
          <header>
            <Button
              style={{ marginLeft: "32px" }}
              variant="outlined"
              onClick={() => {
                history.push("/docteur");
                // props.ModalAction("PatientForm");
              }}
            >
              Revenir au dashboard
            </Button>
          </header>
        </Container>
      </div>
      <div className="welcome-page" style={{ marginBottom: "50px" }}>
        <div className="card-wrapper">
          <Formik
            initialValues={{
              acceptTerms: false,
              email: "",
              nom: "",
              prenom: "",
              adresse: "",
              mytel: "",
              comment: "",
              zipcode: "",
              sexe: "MALE",
              city: "ARIANA",
              status: "",
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
                city: values.city,
                comment: values.comment,
              };
              // call add
              SubmitForm(caste, values.status);
            }}
            render={({
              resetForm,
              submitForm,
              isSubmitting,
              values,
              setFieldValue,
            }) => (
              <Grid container className={classes.root}>
                <Grid
                  item
                  xs={12}
                  style={{ display: "flex", justifyContent: "center" }}
                  container
                >
                  <Grid item xs={12} md={3}>
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
                              width: "90%",
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
                              width: "90%",
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
                              width: "90%",
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
                              width: "90%",
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
                              width: "90%",
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
                            <MenuItem value={"SIDI BOUZID"}>
                              SIDI BOUZID
                            </MenuItem>
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
                              width: "90%",
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
                              width: "90%",
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
                              width: "90%",
                            }}
                          />
                        </div>
                      </Form>
                    </MuiPickersUtilsProvider>
                  </Grid>
                  {/* <Grid
                    item
                    xs={12}
                    md={9}
                    style={{ textAlign: "-webkit-center" }}
                  > */}
                  {question &&
                    question
                      // .filter((q) => {
                      //   return q.section === "CATEGORY_GENERAL";
                      // })
                      .map((el, key) => {
                        return (
                          <Grid
                            item
                            xs={12}
                            md={3}
                            key={key}
                            className="question-list"
                            style={{ textAlign: "center" }}
                          >
                            <h2 style={{ marginBottom: "50px" }}>{el.label}</h2>
                            {el.questions.map((elem, i) => (
                              <QuestionEducationDoctor
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
                  {/* </Grid> */}
                </Grid>
                <Grid
                  item
                  xs={12}
                  container
                  style={{ justifyContent: "center" }}
                >
                  <div
                    style={{
                      margin: 10,
                      textAlign: "center",
                    }}
                  >
                    <Field
                      select
                      component={TextField}
                      label="Statut"
                      variant="outlined"
                      style={{
                        margin: "0 12px",
                        minWidth: "150px",
                      }}
                      name="status"
                      id="status"
                      value={values.status}
                    >
                      <MenuItem value={"STABLE"}>STABLE</MenuItem>
                      <MenuItem value={"SUSPECT"}>SUSPECT</MenuItem>
                      <MenuItem value={"URGENT"}>URGENT</MenuItem>
                    </Field>
                  </div>
                </Grid>
                <Grid
                  item
                  xs={12}
                  container
                  style={{ justifyContent: "center" }}
                >
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
                        submitForm();
                      }}
                    >
                      Valider
                    </Button>
                  </div>
                </Grid>
              </Grid>
            )}
          />
        </div>
      </div>
    </>
  );
};

const mapStateToProps = ({ informer }) => ({ informer });

export default connect(mapStateToProps, { ModalAction, addInformer })(
  FormulaireMedecin
);
