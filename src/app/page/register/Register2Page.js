import DateFnsUtils from "@date-io/date-fns";
import history from "@history";
import {
  Button
  /*   LinearProgress,
  MenuItem,
  FormControl,
  InputLabel,
  FormControlLabel */
} from "@material-ui/core";
import MuiTextField from "@material-ui/core/TextField";
/* import {
  TimePicker,
  DatePicker,
  DateTimePicker
} from "formik-material-ui-pickers"; */
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import { Field, Form, Formik } from "formik";
import { fieldToTextField, TextField } from "formik-material-ui";
import * as React from "react";
import { connect } from "react-redux";
import { submitLogin } from "../../auth/store/actions/login.actions";
import logo from "../../img/Logo-plain.png";
import "../../scss/login_page.scss";

function UpperCasingTextField(props) {
  const {
    form: { setFieldValue },
    field: { name }
  } = props;
  const onChange = React.useCallback(
    event => {
      const { value } = event.target;
      setFieldValue(name, value ? value : "");
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

const Login = props => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  // const userLoged = props.location.state.redirectUrl;
  return (
    <div className="login-page">
      <div className="main-navbar">
        <div className="logo-container">
          <a href="/">
            <img className="logo" src={logo} alt="logo" />
          </a>
        </div>
        <div className="go-home">
          <button
            onClick={() => props.history.push("/welcome")}
            className="homepage"
          >
            Retour à la page d'accueil
          </button>
        </div>
      </div>
      <div className="login-text">
        <h1>
          Connectez-vous pour accéder à l'espace corps médical
          {/* {props.location.state && " " + props.location.state.type} */}
        </h1>
        <h4>
          Cet espace vous permet de voir les demandes envoyées par les patients
          et les traiter chronologiquement.
        </h4>
      </div>
      <Formik
        initialValues={{
          email: "",
          password: ""
        }}
        validate={values => {
          const errors = {};

          if (!values.email) {
            errors.email = "Required";
          } else if (
            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
          ) {
            errors.email = "Invalid email address";
          }
          if (values.password === "") {
            errors.password = "Required";
          }
          if (values.password.length < 8) {
            errors.password = "password must be 8 caractere";
          }
          return errors;
        }}
        onSubmit={(values, { setSubmitting }) => {
          const { submitLogin } = props;
          setSubmitting(false);
          submitLogin(values).then(res => {
            if (res.data) {
              switch (res.role[0]) {
                case "ROLE_DOCTOR":
                  history.push("/docteur");
                  break;

                default:
                  history.push("/samu");
                  break;
              }
            } else {
              alert("user unknown");
            }
          });
        }}
        render={({
          resetForm,
          submitForm,
          isSubmitting,
          values,
          setFieldValue
        }) => (
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <Form className="login-form">
              <div
                style={{
                  margin: 10,
                  marginBottom: 30
                }}
              >
                <div className="email-container">
                  <Field
                    className="email-field"
                    component={UpperCasingTextField}
                    name="email"
                    type="email"
                    label="Email"
                    value={email}
                    onChange={v => setEmail(v.target.value.toLowerCase())}
                  />
                </div>
                <div className="password-container">
                  <Field
                    className="password-field"
                    value={password}
                    component={TextField}
                    type="password"
                    label="Mot de passe"
                    name="password"
                    variant="outlined"
                    onChange={v => setPassword(v.target.value)}
                  />
                </div>
              </div>
              <div>
                <Button
                  className="login-button"
                  variant="contained"
                  color="primary"
                  disabled={isSubmitting}
                  onClick={submitForm}
                >
                  Valider
                </Button>
                {/*<Button*/}
                {/*  variant="contained"*/}
                {/*  color="primary"*/}
                {/*  disabled={isSubmitting}*/}
                {/*  onClick={resetForm}*/}
                {/*>*/}
                {/*  clear*/}
                {/*</Button>*/}
              </div>
            </Form>
          </MuiPickersUtilsProvider>
        )}
      />
    </div>
  );
};
const mapStateToProps = state => {
  return { isAuth: state.auth };
};
export default connect(mapStateToProps, { submitLogin })(Login);
