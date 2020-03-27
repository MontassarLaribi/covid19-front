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
import twitter from "../../img/social/twitter-icon.svg";
import tunisieTelecom from "../../img/tunisieTelecom.png";
import "../../scss/welcome_page.scss";
import Sms from "./sms";

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
      title: "Médecin",
      className: "medecin",
      text:
        "Vous êtes un medecin déjà inscrit sur la plateforme? Connectez-vous et aidez-nous à traiter les dossiers.",
      redirect: "/login",
      buttonContent: "Connectez-vous",
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
      title: "Malade",
      className: "malade",
      text:
        "Vous ressentez les symptômes du COVID-19 mais vous n'arrivez pas à évaluer votre cas? Notre équipe des médecins pourra traiter votre dossier dans les plus brefs délais.",
      redirect: "/malade",
      buttonContent: "Contactez un médecin",
      src: "assets/images/welcome/sick.png",
      handleClick: () => {
        props.ModalAction("PatientForm");
      }
    },
    {
      disabled: false,
      title: "Informer",
      className: "informer",
      text:
        "Vous connaissez quelqu'un qui ne respecte pas les règles du confinement? Protégez-vous et protégez votre entourage en remplissant ce formulaire.",
      redirect: "/informer",
      buttonContent: "choisissez d'informer",
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
    console.log(JSON.stringify(newData));
    axios.post(`${DOMAINE}/api/v1/patient`, { ...newData }).then(res => {
      console.log(res);
      props.ModalAction("sms");
    });
  };

  return (
    <div className="welcome-page">
      <div className={classes.samu}>
        <button
          onClick={() => props.history.push("/login", { type: "samu" })}
          className={classes.subsamu}
        >
          Samu
        </button>
      </div>
      <div className="main-navbar">
        <div className="logo-container">
          {/* <img className="logo" src={logo} alt="logo" /> */}
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
            <li>
              <a href="#">
                <img src={twitter} alt="twitter" />
              </a>
            </li>
          </ul>
        </div>
        {/*<div className="homepage">*/}
        {/*    <button className="btn">*/}
        {/*        go back*/}
        {/*    </button>*/}
        {/*</div>*/}
      </div>
      <div className="welcome-title">
        <h1>مع بعضنا</h1>
        <h1> Ensemble</h1>
      </div>
      <div className="welcome-subtitle">
        Mabaadhna est une plateforme permettant la mise en relation rapide des
        porteurs des <br />
        symptômes du Covid-19 avec le corps médical et l'accélération de leur
        prise en charge
      </div>
      {/*  <GroupedWelcomeCards/> */}
      <div className="card-wrapper">
        <Grid container className={classes.root} spacing={2}>
          <Grid item xs={12}>
            <Grid container justify="center" spacing={9}>
              {cardProps.map((item, key) => (
                <Grid key={key} item>
                  <WelcomeCard
                    text={item.text}
                    title={item.title}
                    handleClick={item.handleClick}
                    buttonContent={item.buttonContent}
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
