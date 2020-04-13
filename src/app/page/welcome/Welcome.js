import { InformModal, PatientFormModal, WelcomeCard } from "@fuse";
import history from "@history";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import { addInformer, ModalAction } from "app/store/actions";
import axios from "axios";
import { DOMAINE } from "config";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import logo from "../../img/logo-plain.png";
import associaMed from "../../img/associaMed.png";
import ministere from "../../img/ministere.png";
import facebook from "../../img/social/facebook-icon.svg";
import samu from "../../img/samu.png";
import instagram from "../../img/social/instagram-icon.svg";
import tunisieTelecom from "../../img/tunisieTelecom.png";
import beecoop from "../../img/beecoop.png";
import esprit from "../../img/esprit.png";
import "../../scss/welcome_page.scss";
import Sms from "./sms";
import { useTranslation } from "react-i18next";
import Alert from "@material-ui/icons/AddAlert";
import AboutModal from "../../../@fuse/components/aboutModal";
import ReactGA from "react-ga";

// const styles = theme => ({
//   layoutRoot: {
//     height: "100vh",
//     // paddingTop: "5rem",
//     textAlign: "center"
//   },
//   title: {
//     paddingBottom: "1.2rem"
//   }
// });
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
const Welcome = (props) => {
  const [question, setquestion] = useState([]);
  const [lengthFormStatic, setlengthFormStatic] = useState(0);
  const [lengthFormDynamic, setlengthFormDynamic] = useState(0);
  const [responses, setReponse] = useState({
    firstName: "string",
    lastName: "string",
    address: "string",
    zipCode: 0,
    phoneNumber: 0,
    responses: [],
  });

  const [about, setAbout] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [data, setData] = useState({});
  const [type, setType] = useState("");

  const classes = useStyles();
  const cardProps = [
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
      },
    },
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
          state: { type: "docteur" },
        });
      },
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
      },
    },
  ];

  function renderSamu() {
    if (i18n.language === "ar" || i18n.language === undefined) {
      return (
        <>
          <span>
            <img src={samu} alt="samu" style={{ maxWidth: "30px" }} />
            <span className="span-samu">{t("SAMU")}</span>
          </span>
        </>
      );
    } else {
      return (
        <>
          <span>
            <span className="span-samu">{t("SAMU")}</span>
            <img src={samu} alt="samu" style={{ maxWidth: "30px" }} />
          </span>
        </>
      );
    }
  }

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

  const submitInformerAfterVerification = () => {
    axios
      .post(`${DOMAINE}/api/v1/informer`, { ...data })
      .then((res) => {
        ReactGA.event({
          category: "Dénonciation",
          action: "L'utilisateur a validé le formulaire de dénonciation",
        });
        history.push("/envoiyer/maladie");
      })
      .catch((error) => {
        if (error.response.data.code === 403) {
          ReactGA.event({
            category: "Dénonciation",
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

  const submitPatientAfterVerification = () => {
    const newData = { ...responses, ...data };
    axios
      .post(`${DOMAINE}/api/v1/patient`, { ...newData })
      .then((res) => {
        ReactGA.event({
          category: "Malade",
          action: "L'utilisateur a validé le formulaire de malade",
        });
        history.push("/envoiyer/maladie");
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

  const { t, i18n } = useTranslation("welcome");

  return (
    <div className="welcome-page">
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
      <Grid container style={{ placeContent: "center" }}>
        <Grid item xs={9}>
          {/* <h3 style={{ textAlign: "center", justifyContent: "center" }}>
            Plateforme en test / الموقع قيد الاختبار
          </h3> */}
          <div className="welcome-title">
            <h1>مع بعضنا</h1>
            <h1>Ensemble</h1>
            <h4>{renderSamu()}</h4>
          </div>
          <div className="welcome-subtitle">
            {t("TEXT_WELCOME")} <br />
            {t("TEXT_24H")}
          </div>
        </Grid>
      </Grid>

      {/*  <GroupedWelcomeCards/> */}
      <div className="card-wrapper">
        <Grid container className={classes.root} spacing={2}>
          <Grid item xs={12}>
            <Grid
              container
              justify="center"
              style={
                i18n.language === "ar" || i18n.language === undefined
                  ? { flexDirection: "row-reverse" }
                  : {}
              }
              spacing={9}
            >
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
            <button
              onClick={() => setAbout(true)}
              // href="javascript:;"
            >
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
        <ul className="logos">
          <li>
            <a href="mailto:Maabaadhna.corona@gmail.com">
              Maabaadhna.corona@gmail.com
            </a>
          </li>
        </ul>

        <button
          onClick={() =>
            (window.location.href = "https://api.maabaadhna.com/admin/login")
          }
          style={{ display: "flex", marginLeft: "auto" }}
          className="MuiButtonBase-root MuiButton-root makeStyles-button-877 MuiButton-textPrimary MuiButton-text MuiButton-sizeSmall"
          tabIndex="0"
          type="button"
        >
          <span
            className="MuiButton-label"
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
              right: "30px",
            }}
          >
            <Alert />
            <span style={{ verticalAlign: "super" }}>
              {t("ESPACE_SHOC_ROOM")}
            </span>
          </span>
          <span className="MuiTouchRipple-root"></span>
        </button>
        {/* </div> */}
        {lengthFormStatic !== 0 && (
          <PatientFormModal
            updateResponse={updateResponse}
            changePhoneNumber={setPhoneNumber}
            dataModal={question ? question : []}
            modalAction={props.ModalAction}
            submitFormCallback={submitForm}
            staticCount={lengthFormStatic}
            dynamicCount={lengthFormDynamic}
            setType={setType}
          />
        )}
        <InformModal
          changePhoneNumber={setPhoneNumber}
          modalAction={props.ModalAction}
          submitFormCallback={submitForm}
          setType={setType}
        />
        <Sms
          tel={phoneNumber}
          type={type}
          history={history}
          data={data}
          submitFinal={submitInformerAfterVerification}
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

export default connect(mapStateToProps, { ModalAction, addInformer })(Welcome);
