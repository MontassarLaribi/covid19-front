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
import ReactGA from "react-ga";

const InformModal = ({
  modalAction,
  submitFormCallback,
  changePhoneNumber,
  setType,
}) => {
  const handleClose = (id) => {
    modalAction(id);
  };

  const [file, setFile] = React.useState(null);

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

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
    nomDenonciateur: yup.string().max(30).required("Champ nom est requis"),
    adresseDenonciateur: yup
      .string()
      .max(120)
      .required("Champ adresse est requis"),
    prenomDenonciateur: yup
      .string()
      .max(30)
      .required("Champ prenom est requis"),
    // cinDenonciateur: yup
    //   .string()
    //   .matches(/^[0-9]{8}$/, "Doit être 8 chiffres")
    //   .required("Champ cin est requis"),
    commentaire: yup
      .string()
      .max(700, "Maximum 700 caracteres")
      .required("Champ commentaire est requis"),
    nomCoupable: yup.string().max(30).required("Champ nom est requis"),
    prenomCoupable: yup.string().max(30).required("Champ prenom est requis"),
    adresseCoupable: yup.string().max(120).required("Champ adresse est requis"),
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
            commentaire: "",
          }}
          validationSchema={InformSchema}
          onSubmit={async (values, { setSubmitting }) => {
            if (file) {
              let base64 = await toBase64(file);
              base64 = base64.split(",")[1];
              const caste = {
                firstName: values.prenomDenonciateur,
                lastName: values.nomDenonciateur,
                address: values.adresseDenonciateur,
                zipCode: values.codePostalDenonciateur,
                phoneNumber: values.numeroDenonciateur,
                culpableFirstName: values.nomCoupable,
                culpableLastName: values.prenomCoupable,
                culpableAddress: values.adresseCoupable,
                comment: values.commentaire,
                image: base64,
              };
              changePhoneNumber(values.numeroDenonciateur);
              submitFormCallback(caste, 2);
              setType("informer");
            } else {
              alert("Le fichier de preuve est requis! ملف الأدلة مطلوب");
            }
          }}
          render={({
            resetForm,
            submitForm,
            isSubmitting,
            values,
            setFieldValue,
          }) => (
            <>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <Form
                  onSubmit={() => {
                    submitForm(values);
                  }}
                >
                  <h4 className="form-title">
                    1- Contact du dénonciateur / معلومات الشاكي
                  </h4>
                  <div
                    className="d-flex"
                    style={{
                      margin: 10,
                    }}
                  >
                    <div className="p-5">
                      <Field
                        component={TextField}
                        type="text"
                        name="nomDenonciateur"
                        label="Nom / اللقب"
                        variant="outlined"
                      />
                    </div>
                    <div className="p-5">
                      <Field
                        component={TextField}
                        type="text"
                        name="prenomDenonciateur"
                        label="Prenom / الاسم"
                        variant="outlined"
                      />
                    </div>
                  </div>

                  <div
                    className="d-flex"
                    style={{
                      margin: 10,
                    }}
                  >
                    <div className="p-5">
                      <Field
                        component={TextField}
                        type="text"
                        name="adresseDenonciateur"
                        label="Adresse / العنوان"
                        variant="outlined"
                      />
                    </div>
                  </div>
                  <div
                    className="d-flex"
                    style={{
                      margin: 10,
                    }}
                  >
                    <div className="p-5">
                      <Field
                        component={TextField}
                        name="codePostalDenonciateur"
                        label="Code Postal / رقم البريد"
                        variant="outlined"
                      />
                    </div>
                    <div className="p-5">
                      <Field
                        component={TextField}
                        type="text"
                        name="numeroDenonciateur"
                        label="Téléphone / رقم الهاتف"
                        variant="outlined"
                      />
                    </div>
                  </div>
                  <h4 className="form-title">
                    2- Contact de la personne à dénoncer / معلومات المخالف
                  </h4>
                  <div
                    className="d-flex"
                    style={{
                      margin: 10,
                    }}
                  >
                    <div className="p-5">
                      <Field
                        component={TextField}
                        type="text"
                        name="nomCoupable"
                        label="Nom / اللقب"
                        variant="outlined"
                      />
                    </div>
                    <div className="p-5">
                      <Field
                        component={TextField}
                        type="text"
                        name="prenomCoupable"
                        label="Prénom / الاسم"
                        variant="outlined"
                      />
                    </div>
                  </div>
                  <div className="p-5">
                    <Field
                      component={TextField}
                      type="text"
                      name="adresseCoupable"
                      label="Adresse / العنوان"
                      variant="outlined"
                      style={{
                        width: "100%",
                      }}
                    />
                  </div>
                  <div className="p-5">
                    <Field
                      component={TextField}
                      multiline
                      rows="8"
                      name="commentaire"
                      label="Commentaire / تعليق"
                      variant="outlined"
                      style={{
                        width: "100%",
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
                      Preuve / الدليل
                      <input
                        id="file"
                        name="file"
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={(event) => {
                          const tmp = event.currentTarget.files[0];
                          if (tmp.type.startsWith("image")) {
                            if (tmp.size > 5 * 1024 * 1024) {
                              alert("L'image ne doit pas dépasser les 5Mo");
                            } else {
                              setFile(event.currentTarget.files[0]);
                            }
                          } else {
                            alert("Le fichier doit être une image valide!");
                          }
                        }}
                      />
                    </Button>
                    {file && (
                      <div style={{ margin: "20px" }}>
                        <img src={URL.createObjectURL(file)} alt="preview" />
                      </div>
                    )}
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
                        ReactGA.event({
                          category: "Dénonciation",
                          action:
                            "L'utilisateur a rempli le formulaire et attend l'SMS",
                        });
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
