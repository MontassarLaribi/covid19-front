import { InformModal, PatientFormModal, WelcomeCard } from "@fuse";
import history from "@history";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import { addInformer, ModalAction } from "app/store/actions";
import axios from "axios";
import { DOMAINE } from "config";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import associaMed from "../../img/associaMed.png";
import ministere from "../../img/ministere.png";
import facebook from "../../img/social/facebook-icon.svg";
import instagram from "../../img/social/instagram-icon.svg";
import tunisieTelecom from "../../img/tunisieTelecom.png";
import "../../scss/welcome_page.scss";
import Sms from "./sms";
import { useTranslation } from "react-i18next";
import Alert from "@material-ui/icons/AddAlert";

const styles = theme => ({
  layoutRoot: {
    height: "100vh",
    // paddingTop: "5rem",
    textAlign: "center"
  },
  title: {
    paddingBottom: "1.2rem"
  }
});
const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    paddingTop: "5rem"
  },
  paper: {
    height: 140,
    width: 100
  },
  control: {
    padding: theme.spacing(2)
  },
  samu: {
    width: "80px",
    background: "rebeccapurple",
    color: "white",
    padding: "10px",
    display: "flex",
    alignItems: "center",
    position: "absolute",
    top: "50%"
  },
  subsamu: {
    color: "white"
  }
}));
const Welcome = props => {
  const [question, setquestion] = useState([]);
  const [lengthFormStatic, setlengthFormStatic] = useState(0);
  const [lengthFormDynamic, setlengthFormDynamic] = useState(0);
  const [responses, setReponse] = useState({
    firstName: "string",
    lastName: "string",
    address: "string",
    zipCode: 0,
    phoneNumber: 0,
    responses: []
  });
  const classes = useStyles();
  const cardProps = [
    {
      disabled: false,
      title: "CARD_DOCTOR_TITLE",
      className: "medecin",
      text: "CARD_DOCTOR_TEXT",
      redirect: "/login",
      buttonContent: "CARD_DOCTOR_BTN",
      src: "assets/images/welcome/doctor.png",
      handleClick: () => {
        history.push({
          pathname: "/login",
          state: { type: "docteur" }
        });
      }
    },
    {
      disabled: false,
      title: "CARD_PATIENT_TITLE",
      className: "malade",
      text: "CARD_PATIENT_TEXT",
      redirect: "/malade",
      buttonContent: "CARD_PATIENT_BTN",
      src: "assets/images/welcome/sick.png",
      handleClick: () => {
        props.ModalAction("PatientForm");
      }
    },
    {
      disabled: false,
      title: "CARD_INFORMER_TITLE",
      className: "informer",
      text: "CARD_INFORMER_TEXT",
      redirect: "/informer",
      buttonContent: "CARD_INFORMER_BTN",
      src: "assets/images/welcome/inform.png",
      handleClick: () => {
        props.ModalAction("Inform");
      }
    }
  ];
  const renderLabelCategroy = cat => {
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
      .then(res => {
        if (res && res.data && res.data.payload && res.data.payload.questions) {
          let cleanData = [];
          let currentSome = 0;
          for (let key in res.data.payload.questions) {
            currentSome = currentSome + res.data.payload.questions[key].length;
            cleanData.push({
              section: key,
              label: renderLabelCategroy(key),
              key: key,
              questions: res.data.payload.questions[key]
            });
          }
          setquestion(cleanData);
          setlengthFormStatic(currentSome);
        } else {
          setquestion([]);
        }
      })
      .catch(err => setquestion(err));
  }, []);

  const updateResponse = data => {
    console.log("lengthFormStatic", lengthFormStatic);
    const newResponse = responses;
    const findIt = newResponse[data.field].findIndex(
      d => d.question === data.extraData.id
    );
    if (findIt !== -1) {
      newResponse[data.field].splice(findIt, 1, {
        value: data.value,
        question: data.extraData.id
      });
    } else {
      newResponse[data.field].push({
        value: data.value,
        question: data.extraData.id
      });
      setlengthFormDynamic(lengthFormDynamic + 1);
    }
    console.log("newResponse", newResponse);
    setReponse(newResponse);
  };

  const submitForm = data => {
    const newData = { ...responses, ...data };
    console.log("newDataaaaaaaaaaaa", newData);
    axios.post(`${DOMAINE}/api/v1/patient`, { ...newData }).then(res => {
      console.log(res);
      props.ModalAction("sms");
    });
  };

  const { t, i18n } = useTranslation("welcome");

  return (
    <div className="welcome-page">
      {/* <div className={classes.samu}>
        <button
          onClick={() => props.history.push("/login", { type: "samu" })}
          className={classes.subsamu}
        >
          Samu
        </button>
      </div> */}
      <div className="main-navbar">
        {/*<div className="logo-container">*/}
        {/*   <img className="logo" src={logo} alt="logo" /> */}
        {/*</div>*/}
        <div className="language-selection-container">
          <ul className="language-list">
            <li>
              <span
                className={
                  i18n.language === "ar" || i18n.language === undefined
                    ? "selected"
                    : ""
                }
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
              <a href="#">
                <img src={facebook} alt="facebook" />
              </a>
            </li>
            <li>
              <a href="#">
                <img src={instagram} alt="instagram" />
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="welcome-title">
        <h1>مع بعضنا</h1>
        <h1> Ensemble</h1>
      </div>
      <div className="welcome-subtitle">
        {t("TEXT_WELCOME")} <br />
        {t("TEXT_24H")}
      </div>
      {/*  <GroupedWelcomeCards/> */}
      <div className="card-wrapper">
        <Grid container className={classes.root} spacing={2}>
          <Grid item xs={12}>
            <Grid container justify="center" spacing={9}>
              {cardProps.map((item, key) => (
                <Grid key={key} item>
                  <WelcomeCard
                    text={t(item.text)}
                    title={t(item.title)}
                    handleClick={item.handleClick}
                    buttonContent={t(item.buttonContent)}
                    src={item.src}
                    disabled={item.disabled}
                  ></WelcomeCard>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
        {/* <div className=""> */}
        <div className="partenariat">Agréée par | En partenariat avec</div>
        <ul className="logos">
          <li>
            <img className="associaMed" src={associaMed} alt="facebook" />
          </li>
          <li>
            <img className="ministere" src={ministere} alt="instagram" />
          </li>
          <li>
            <img
              className="tunisieTelecom"
              src={tunisieTelecom}
              alt="twitter"
            />
          </li>
        </ul>

        <button
          onClick={() => props.history.push("/login", { type: "samu" })}
          style={{ display: "flex", marginLeft: "auto" }}
          class="MuiButtonBase-root MuiButton-root makeStyles-button-877 MuiButton-textPrimary MuiButton-text MuiButton-sizeSmall"
          tabindex="0"
          type="button"
        >
          <span
            class="MuiButton-label"
            style={{
              fontSize: "1em",
              display: "table",
              width: "auto",
              border: "1px solid #707070",
              padding: "12px 15px",
              borderRadius: "50px",
              margin: "10px",
              color: "#707070",
              // position: "fixed",
              bottom: "50px",
              right: "30px"
            }}
          >
            <Alert />
            <span style={{ verticalAlign: "super" }}>
              {t("ESPACE_SHOC_ROOM")}
            </span>
          </span>
          <span class="MuiTouchRipple-root"></span>
        </button>
        {/* </div> */}
        {lengthFormStatic !== 0 && (
          <PatientFormModal
            updateResponse={updateResponse}
            dataModal={question ? question : []}
            modalAction={props.ModalAction}
            submitFormCallback={submitForm}
            staticCount={lengthFormStatic}
            dynamicCount={lengthFormDynamic}
          />
        )}
        <InformModal modalAction={props.ModalAction} />
        <Sms
          tel={responses && responses.phoneNumber}
          history={history}
          modalAction={props.ModalAction}
        />
      </div>
    </div>
  );
};

const mapStateToProps = ({ informer }) => ({ informer });

/* export default withStyles(styles, { withTheme: true })(Welcome); */

export default connect(mapStateToProps, { ModalAction, addInformer })(Welcome);
