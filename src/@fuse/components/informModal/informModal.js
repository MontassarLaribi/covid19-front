import React from "react";
import { Modal } from "@fuse";
import { Formik, Form, Field } from "formik";
import { withRouter } from "react-router-dom";
import { Button } from "@material-ui/core";
import MuiTextField from "@material-ui/core/TextField";
import upload from "../../../app/img/upload-icon.svg";
import {
  fieldToTextField,
  TextField,
  TextFieldProps
} from "formik-material-ui";

import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

const InformModal = ({ modalAction, submitForm, history }) => {
  const handleClose = id => {
    modalAction(id);
  };

  function UpperCasingTextField(props) {
    const {
      form: { setFieldValue },
      field: { name }
    } = props;
    const onChange = React.useCallback(
      event => {
        const { value } = event.target;
        setFieldValue(name, value ? value.toUpperCase() : "");
      },
      [setFieldValue, name]
    );
    return (
      <MuiTextField
        {...fieldToTextField({
          label: "Outlined",
          variant: "outlined",
          ...props
        })}
        onChange={onChange}
      />
    );
  }

  return (
    <Modal className="informer" id="Inform" ModalAction={modalAction}>
      <div className="modal-header">
        <h4>formulaire de dénonciation</h4>
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
          validate={values => {
            const errors = {};

            if (!values.emailDenonciateur) {
              errors.emailDenonciateur = "Required";
            } else if (
              !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(
                values.emailDenonciateur
              )
            ) {
              errors.emailDenonciateur = "Invalid email address";
            }
            if (values.nomDenonciateur === "") {
              errors.nomDenonciateur = "Required";
            }
            if (values.prenomDenonciateur === "") {
              errors.prenomDenonciateur = "Required";
            }
            if (values.cinDenonciateur === "") {
              errors.cinDenonciateur = "Required";
            } else if (!/^[0-9]*$/i.test(values.cinDenonciateur)) {
              errors.cinDenonciateur = "Invalid CIN number";
            }
            if (values.adresseDenonciateur === "") {
              errors.adresseDenonciateur = "Required";
            }
            if (values.codePostalDenonciateur === "") {
              errors.codePostalDenonciateur = "Required";
            } else if (!/^[0-9]*$/i.test(values.codePostalDenonciateur)) {
              errors.codePostalDenonciateur = "Invalid postal code";
            }
            if (values.numeroDenonciateur === "") {
              errors.numeroDenonciateur = "Required";
            } else if (
              values.numeroDenonciateur.length !== 8 ||
              !/^[0-9]*$/i.test(values.numeroDenonciateur)
            ) {
              errors.numeroDenonciateur = "Invalid phone number";
            }
            if (values.nomCoupable === "") {
              errors.nomCoupable = "Required";
            }
            if (values.prenomCoupable === "") {
              errors.prenomCoupable = "Required";
            }
            if (values.adresseCoupable === "") {
              errors.adresseCoupable = "Required";
            }

            return errors;
          }}
          onSubmit={(values, { setSubmitting }) => {
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
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <Form
                onSubmit={() => {
                  submitForm(values);
                }}
              >
                <h4 className="form-title">1- Données du dénonciateur</h4>
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
{/*                   <div className="p-5">
                    <div> CIN</div>

                    <Field
                      component={TextField}
                      type="text"
                      name="cinDenonciateur"
                      variant="outlined"
                    />
                  </div> */}
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
                <h4 className="form-title">2- Données du coupable</h4>
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
                    Parcourir un fichier{" "}
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
          )}
        />
      </div>
    </Modal>
  );
};

export default withRouter(InformModal);