import DateFnsUtils from "@date-io/date-fns";
import { Modal } from "@fuse";
import { Button, MenuItem } from "@material-ui/core";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import { Field, Form, Formik } from "formik";
import { TextField } from "formik-material-ui";
import * as React from "react";
import { useEffect } from "react";
import { withRouter } from "react-router-dom";
import * as yup from "yup";
import QuestionEducation from "./QuestionEducation";

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

const PatientDashboardFormModal = ({
  staticCount,
  dynamicCount,
  modalAction,
  dataModal,
  submitFormCallback,
  updateResponse,
  changePhoneNumber,
  setType,
}) => {
  useEffect(() => {
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
  });

  const handleClose = (id) => {
    modalAction(id);
  };

  const getAllState = (data) => {
    updateResponse(data);
  };

  return (
    <Modal className="patientForm" id="PatientForm" ModalAction={modalAction}>
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
            status: "",
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
              city: values.city,
              comment: values.comment,
            };
            submitFormCallback(caste, values.status);
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
                    margin: 10,
                    textAlign: "center",
                  }}
                >
                  <Field
                    select
                    component={TextField}
                    label="Status"
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
                      submitForm();
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

export default withRouter(PatientDashboardFormModal);
