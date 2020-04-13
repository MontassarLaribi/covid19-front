import { Button, Dialog, Divider, Grid, TextField } from "@material-ui/core";
import React, { useState } from "react";
//STABLE / SUSPECT / URGENT
import ellipse from "../ellipse.svg";
import group from "../group.svg";
import moment from "moment";

const predefinedResponses = [
  {
    title: "Dossier traité et accepté :",
    text:
      "Votre dossier a été traité par l'équipe SAMU.  Un prélèvement est jugé nécessaire, notre équipe SAMU se déplacera vers xxadressexx. Entre temps, restez dans votre chambre et évitez tout contact avec les membres de votre famille.",
  },
  {
    title: "Dossier traité et refusé :",
    text:
      "L'équipe SAMU vous informe que votre état ne semble pas préoccupant.Protégez-vous et protégez les autres en restant chez vous. En cas de modification de votre état de santé veuillez nous re-contacter.",
  },
];

const ClaimDialog = ({
  visible = false,
  isSent = false,
  onClose,
  onSendSMS,
  onClickNext,
  patient,
  allPatientsCount,
}) => {
  const [response, setResponse] = useState("");
  // const [open, setOpen] = useState(false);
  const [condition, setCondition] = useState(null);

  // console.log("patient", patient);

  const {
    first_name,
    last_name,
    address,
    zip_code,
    phone_number,
    gender,
    audio,
    responses,
    city,
    created_at,
  } = patient;

  const handleChange = (event) => {
    setResponse(event.target.value);
  };

  // const handleClose = () => {
  //   setOpen(false);
  // };

  // const handleOpen = () => {
  //   setOpen(true);
  // };

  const renderClassName = (value) => {
    const test = String(value) === "1";
    switch (test) {
      case false:
        return "critique-active";

      case true:
        return "stable-active";

      default:
        break;
    }
  };

  const renderValue = (value, type) => {
    const test = String(value) === "1";
    switch (test) {
      case false:
        return "non";
      case true:
        return "oui";
      default:
        break;
    }
  };

  const renderQuestions = (cat) => {
    return responses[cat].map((q, key) => {
      return (
        <div key={key} className="single-question">
          <p> {q.question.fr_value}</p>
          {q.question.type === 1 && (
            <Button
              variant="outlined"
              disabled
              className={renderClassName(q.response.value)}
            >
              {renderValue(q.response.value, q.question.type)}
            </Button>
          )}
          {q.question.type === 2 && (
            <TextField
              className="question-textfield"
              label=""
              disabled
              variant="outlined"
              value={q.response.value}
            />
          )}
        </div>
      );
    });
  };

  const renderCategories = () => {
    return (
      responses &&
      Object.keys(responses).map((cat, index) => {
        switch (cat) {
          case "CATEGORY_GENERAL":
            return (
              <div key={index}>
                <h3>{index + 1}.Questions générales</h3>
                {renderQuestions(cat)}
              </div>
            );
          case "CATEGORY_ANTECEDENT":
            return (
              <div key={index}>
                <h3>{index + 1}.Questions médicales</h3>
                {renderQuestions(cat)}
              </div>
            );
          case "CATEGORY_SYMPTOMS":
            return (
              <div key={index}>
                <h3>{index + 1}.Les symptômes</h3>
                {renderQuestions(cat)}
              </div>
            );

          default:
            return <></>;
        }
      })
    );
  };

  const renderAudio = (audio) => {
    if (!audio) return "Pas d'enregistrement";
    return <audio controls src={"data:audio/mp3;base64," + audio} />;
  };

  return (
    <Dialog
      className="claim-dialog"
      // onClose={onClose}
      aria-labelledby="Claim Dialog"
      open={visible}
      fullWidth={true}
      maxWidth={"md"}
    >
      {!isSent && (
        <Grid container spacing={0}>
          <Grid item md={6} xs={12}>
            <div className="claim-dialog-form">
              <div className="claim-dialog-user-info">
                <p>
                  Envoyé le:{" "}
                  <span>{moment(created_at).format("DD/MM/YYYY HH:mm")}</span>
                </p>
                <p>
                  nom: <span>{last_name}</span>
                </p>
                <p>
                  prénom: <span>{first_name}</span>
                </p>
                <p>
                  sexe : <span>{gender === "MALE" ? "Homme" : "Femme"}</span>
                </p>
                <p>
                  adresse: <span>{address}</span>
                </p>
                <p>
                  ville: <span>{city}</span>
                </p>
                <p>
                  code postal: <span>{zip_code}</span>
                </p>
                <p>
                  numéro de téléphone: <span>{phone_number}</span>
                </p>
                <p>{renderAudio(audio)}</p>
              </div>
              <Divider />
              <div className="claim-dialog-message">
                <TextField
                  id="standard-multiline-static"
                  className="text-response"
                  label=""
                  placeholder="ecrire un message"
                  multiline
                  rows="4"
                  variant="outlined"
                  value={response}
                  onChange={handleChange}
                />
              </div>
              <div className="conditions">
                <Button
                  variant="outlined"
                  className={
                    condition === "NOT_TO_BE_TESTED" ? "stable-active" : ""
                  }
                  onClick={() => {
                    condition === "NOT_TO_BE_TESTED"
                      ? setCondition(null)
                      : setCondition("NOT_TO_BE_TESTED");
                    setResponse(predefinedResponses[1].text);
                  }}
                >
                  Cas non suspect
                </Button>
                <Button
                  variant="outlined"
                  className={
                    condition === "TO_BE_TESTED" ? "critique-active" : ""
                  }
                  onClick={() => {
                    condition === "TO_BE_TESTED"
                      ? setCondition(null)
                      : setCondition("TO_BE_TESTED");
                    setResponse(
                      predefinedResponses[0].text.replace(
                        "xxadressexx",
                        patient.address
                      )
                    );
                  }}
                >
                  Envoyer pour un test
                </Button>
              </div>
              <div className="sms">
                <Button
                  variant="outlined"
                  size="large"
                  // style="align:right"
                  onClick={() => {
                    if (response.length > 620) {
                      alert("maxiumum 620 caracteres");
                    } else {
                      onSendSMS(condition, response);
                      setCondition(null);
                      setResponse("");
                    }
                  }}
                  disabled={!condition || !response}
                >
                  Envoyer SMS Et Valider
                </Button>
              </div>
            </div>
          </Grid>
          <Grid item md={6} xs={12}>
            <div className="claim-dialog-questions">{renderCategories()}</div>
          </Grid>
        </Grid>
      )}

      {isSent && (
        <div className="issent">
          <div className="issent-content">
            <img alt="" className="Ellipse" src={ellipse} />
            <button className="send">
              <img alt="" src={group} />
            </button>
            <h2> Merci Beaucoup docteur!</h2>
            <div>Le document a été traité avec succés…..</div>
          </div>
          <Divider />
          <div className="issent-actions">
            <Button variant="outlined" size="small" onClick={onClose}>
              revenir au dashboard
            </Button>
            {allPatientsCount > 0 && (
              <Button
                className="issent-actions-btn"
                size="large"
                onClick={onClickNext}
              >
                traiter le dossier suivant
              </Button>
            )}
          </div>
        </div>
      )}
    </Dialog>
  );
};
export default ClaimDialog;
