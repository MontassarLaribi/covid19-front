import { InformModal, WelcomeCard } from "@fuse";
import history from "@history";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import { addInformer, ModalAction } from "app/store/actions";
import axios from "axios";
import { DOMAINE } from "config";
import React, { useState } from "react";
import { connect } from "react-redux";
import logo from "../../img/logo-plain.png";
import associaMed from "../../img/associaMed.png";
// import ministere from "../../img/ministere.png";
import facebook from "../../img/social/facebook-icon.svg";
import samu from "../../img/samu.png";
import instagram from "../../img/social/instagram-icon.svg";
import tunisieTelecom from "../../img/tunisieTelecom.png";
import couffin from "../../img/couffin-du-tunisien.jpg";
import beecoop from "../../img/beecoop.png";
import esprit from "../../img/esprit.png";
import "../../scss/welcome_page.scss";
import Sms from "./sms";
import { useTranslation } from "react-i18next";
import Alert from "@material-ui/icons/AddAlert";
import AboutModal from "../../../@fuse/components/aboutModal";
import ReactGA from "react-ga";

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
  const [about, setAbout] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  // const [verificationCode, setVerificationCode] = useState("");
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
        history.push({
          pathname: "/formulaire",
        });
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

  const submitForm = (data, type) => {
    const body = { number: data.phoneNumber, type: type };
    setData(data);

    axios
      .post(`${DOMAINE}/api/v1/sms/authentication`, {
        ...body,
      })
      .then((res) => {
        // setVerificationCode(res.data.payload.verificationCode);
        props.ModalAction("sms");
      });
  };

  const submitInformerAfterVerification = (pinCode) => {
    axios
      .post(`${DOMAINE}/api/v1/informer`, { ...data, ...{ pinCode } })
      .then((res) => {
        ReactGA.event({
          category: "Dénonciation",
          action: "L'utilisateur a validé le formulaire de dénonciation",
        });
        history.push("/envoyer/maladie");
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
        if (error.response.data.code === 404) {
          ReactGA.event({
            category: "Dénonciation",
            action: "L'utilisateur à entré un code erroné",
          });
          alert("Code erroné veuillez ressayer!");
          return 404;
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
        <ul className="logos">
          <li>
            <a href="mailto:Maabaadhna.corona@gmail.com">
              Maabaadhna.corona@gmail.com
            </a>
          </li>
        </ul>
        <div style={{ display: "flex", marginLeft: "auto" }}>
          <button
            onClick={() =>
              (window.location.href =
                "https://www.cha9a9a.tn/fund/detail/le-couffin-du-tunisien-covid-19-792537")
            }
            style={{ marginLeft: "auto" }}
            className="MuiButtonBase-root MuiButton-root makeStyles-button-877 MuiButton-textPrimary MuiButton-text MuiButton-sizeSmall"
            tabIndex="0"
            type="button"
          >
            <span
              className="MuiButton-label"
              style={{
                fontSize: "1em",
                display: "flex",
                flexDirection: "column",
                width: "auto",
                padding: "12px 15px",
                margin: "10px",
                color: "#707070",
                // position: "fixed",
                bottom: "50px",
                right: "30px",
              }}
            >
              <img
                src={couffin}
                alt="le couffin du tunisien"
                style={{ maxWidth: "100px" }}
              />
              <span style={{ verticalAlign: "super" }}>
                Pour soutenir la cause du couffin du Tunisien <br />
                cliquez ici
              </span>
            </span>
            <span className="MuiTouchRipple-root"></span>
          </button>
          <button
            onClick={() =>
              (window.location.href = "https://api.maabaadhna.com/admin/login")
            }
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
        </div>

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
          modalAction={props.ModalAction}
          // verificationCode={verificationCode}
        />
      </div>
    </div>
  );
};

const mapStateToProps = ({ informer }) => ({ informer });

/* export default withStyles(styles, { withTheme: true })(Welcome); */

export default connect(mapStateToProps, { ModalAction, addInformer })(Welcome);
