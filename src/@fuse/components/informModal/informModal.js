import DateFnsUtils from "@date-io/date-fns";
import { Modal } from "@fuse";
import { Button } from "@material-ui/core";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import { Field, Form, Formik } from "formik";
import { TextField } from "formik-material-ui";
import React from "react";
import { withRouter } from "react-router-dom";
import upload from "../../../app/img/upload-icon.svg";
import LoiSnack from "../loiSnack";
import * as yup from "yup";

const InformModal = ({ modalAction, submitForm, history }) => {
  const handleClose = id => {
    modalAction(id);
  };
  const InformSchema = yup.object().shape({
    numeroDenonciateur: yup
      .string()
      .matches(/^[0-9]{8}$/, "Doit être 8 chiffres")
      .required("Champ téléphone requis"),
    codePostalDenonciateur: yup
      .number("Nombre positif")
      .required("Champ age est requis")
      .typeError("Zip est un nombre")
      .positive("Nombre positif")
      .integer("Nombre positif"),
    nomDenonciateur: yup
      .string()
      .max(30)
      .required("Champ nom est requis"),
    adresseDenonciateur: yup
      .string()
      .max(120)
      .required("Champ adresse est requis"),
    prenomDenonciateur: yup
      .string()
      .max(30)
      .required("Champ prenom est requis"),
    cinDenonciateur: yup
      .string()
      .matches(/^[0-9]{8}$/, "Doit être 8 chiffres")
      .required("Champ sexe est requis"),
    commentaire: yup
      .string()
      .max(700, "Maximum 700 caracteres")
      .required("Champ sexe est requis"),
    nomCoupable: yup
      .string()
      .max(30)
      .required("Champ nom est requis"),
    prenomCoupable: yup
      .string()
      .max(30)
      .required("Champ prenom est requis"),
    adresseCoupable: yup
      .string()
      .max(120)
      .required("Champ adresse est requis")
  });

  return (
    <Modal className="informer" id="Inform" ModalAction={modalAction}>
      <LoiSnack />
      <div className="modal-header">
        <h4>Formulaire De Dénonciation</h4>
        <button onClick={() => handleClose("Inform")}>x</button>
      </div>
      <div className="modal-content">
        <Formik
          initialValues={{
            emailDenonciateur: "",
            nomDenonciateur: "",
            prenomDenonciateur: "",
            cinDenonciateur: "",
            adresseDenonciateur: "",
            codePostalDenonciateur: "",
            numeroDenonciateur: "",

            nomCoupable: "",
            prenomCoupable: "",
            adresseCoupable: "",
            commentaire: ""
          }}
          validate={InformSchema}
          onSubmit={(values, { setSubmitting }) => {
            const caste = {
              firstName: values.prenomDenonciateur,
              lastName: values.nomDenonciateur,
              address: values.adresseDenonciateur,
              cin: values.cinDenonciateur,
              phoneNumber: values.mytel,
              culpableFirstName: "string",
              culpableLastName: "string",
              culpableAddress: "string",
              comment: "string"
            };
            console.log("values", values);
            setTimeout(() => {
              setSubmitting(false);
              // alert(JSON.stringify(values, null, 2));
            }, 500);
          }}
          render={({
            resetForm,
            submitForm,
            isSubmitting,
            values,
            setFieldValue
          }) => (
            <>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <Form
                  onSubmit={() => {
                    submitForm(values);
                  }}
                >
                  <h4 className="form-title">1- Contact du dénonciateur</h4>
                  <div
                    className="d-flex"
                    style={{
                      margin: 10
                    }}
                  >
                    <div className="p-5">
                      <div> Nom</div>
                      <Field
                        component={TextField}
                        type="text"
                        name="nomDenonciateur"
                        variant="outlined"
                      />
                    </div>
                    <div className="p-5">
                      <div> Prenom</div>
                      <Field
                        component={TextField}
                        type="text"
                        name="prenomDenonciateur"
                        variant="outlined"
                      />
                    </div>
                  </div>

                  <div
                    className="d-flex"
                    style={{
                      margin: 10
                    }}
                  >
                    <div className="p-5">
                      <div> Adresse</div>
                      <Field
                        component={TextField}
                        type="text"
                        name="adresseDenonciateur"
                        variant="outlined"
                      />
                    </div>
                  </div>
                  <div
                    className="d-flex"
                    style={{
                      margin: 10
                    }}
                  >
                    <div className="p-5">
                      <div> Code Postal</div>

                      <Field
                        component={TextField}
                        name="codePostalDenonciateur"
                        label="code Postal"
                        variant="outlined"
                      />
                    </div>
                    <div className="p-5">
                      <div> numéro de téléphone</div>
                      <Field
                        component={TextField}
                        type="text"
                        name="numeroDenonciateur"
                        variant="outlined"
                      />
                    </div>
                  </div>
                  <h4 className="form-title">
                    2- Contact de la personne à dénoncer
                  </h4>
                  <div
                    className="d-flex"
                    style={{
                      margin: 10
                    }}
                  >
                    <div className="p-5">
                      <div> Nom</div>

                      <Field
                        component={TextField}
                        type="text"
                        name="nomCoupable"
                        variant="outlined"
                      />
                    </div>
                    <div className="p-5">
                      <div> Prénom</div>
                      <Field
                        component={TextField}
                        type="text"
                        name="prenomCoupable"
                        variant="outlined"
                      />
                    </div>
                  </div>
                  <div className="p-5">
                    <div> Adresse</div>
                    <Field
                      component={TextField}
                      type="text"
                      name="adresseCoupable"
                      variant="outlined"
                      style={{
                        width: "100%"
                      }}
                    />
                  </div>
                  <div className="p-5">
                    <div> Commentaire</div>
                    <Field
                      component={TextField}
                      type="text"
                      name="commentaire"
                      variant="outlined"
                      style={{
                        width: "100%"
                      }}
                    />
                  </div>
                  <div className="browse-wrapper p-5 mt-10 mb-10">
                    <Button
                      className="browse-file"
                      variant="contained"
                      component="label"
                    >
                      <img src={upload} alt="" />
                      Parcourir un fichier
                      <input type="file" style={{ display: "none" }} />
                    </Button>
                  </div>
                  <div className="action-buttons">
                    <Button
                      className="cancel"
                      variant="outlined"
                      color="primary"
                      disabled={isSubmitting}
                      onClick={() => {
                        resetForm();
                        handleClose("Inform");
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
                        //alert('Cette fonction est en cours de developpement')
                        submitForm();
                        handleClose();
                      }}
                    >
                      Valider
                    </Button>
                  </div>
                </Form>
              </MuiPickersUtilsProvider>
            </>
          )}
        />
      </div>
    </Modal>
  );
};

export default withRouter(InformModal);
