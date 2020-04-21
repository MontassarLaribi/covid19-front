import { Button, Dialog, Divider, Grid, TextField } from "@material-ui/core";
import React from "react";

const ClaimDialog = ({
  visible = false,
  isSent = false,
  onClose,
  patient,
  onToTest,
}) => {
  const {
    first_name,
    last_name,
    address,
    zip_code,
    phone_number,
    gender,
    audio,
    responses,
    flag,
    medical_status,
    test_positive,
    comment,
  } = patient;

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

  const renderTested = () => {
    if (medical_status === "TO_BE_TESTED") {
      return (
        <div className="conditions">
          <Button
            variant="outlined"
            className={"stable-active"}
            onClick={() => {
              onToTest(false);
              onClose();
            }}
          >
            NÉGATIF
          </Button>
          <Button
            variant="outlined"
            className={"critique-active"}
            onClick={() => {
              onToTest(true);
              onClose();
            }}
          >
            POSITIF
          </Button>
        </div>
      );
    } else if (medical_status === "TESTED") {
      return (
        <div className="conditions">
          {test_positive === false ? (
            <Button variant="outlined" className={"stable-active"}>
              NÉGATIF
            </Button>
          ) : (
            <Button variant="outlined" className={"critique-active"}>
              POSITIF
            </Button>
          )}
        </div>
      );
    }
  };

  const renderQuestions = (cat) => {
    const newArray = responses.filter(function (resp) {
      return resp.question.category === cat;
    });
    return newArray.map((q, key) => {
      return (
        <div key={key} className="single-question">
          <p> {q.question.fr_value}</p>
          {q.question.type === 1 && (
            <Button
              variant="outlined"
              disabled
              className={renderClassName(q.value)}
            >
              {renderValue(q.value, q.question.type)}
            </Button>
          )}
          {q.question.type === 2 && (
            <>
              <TextField
                className="question-textfield"
                label=""
                disabled
                multiline
                fullWidth
                rows={4}
                variant="outlined"
                value={q.value}
              />
            </>
          )}
          {q.question.type === 3 && (
            <TextField
              className="question-textfield"
              label=""
              disabled
              variant="outlined"
              value={q.value}
            />
          )}
        </div>
      );
    });
  };

  const renderCategories = () => {
    return (
      responses && (
        <>
          <div>
            <h3>1.Questions générales</h3>
            {renderQuestions(1)}
          </div>
          <div>
            <h3>2.Questions médicales</h3>
            {renderQuestions(2)}
          </div>
          <div>
            <h3>3.Les symptômes</h3>
            {renderQuestions(3)}
          </div>
        </>
      )
    );
  };

  const renderAudio = (audio) => {
    if (!audio) return "Pas d'enregistrement";
    return <audio controls src={"data:audio/mp3;base64," + audio} />;
  };

  return (
    <Dialog
      className="claim-dialog"
      onClose={onClose}
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
                  code postal: <span>{zip_code}</span>
                </p>
                <p>
                  numéro de téléphone: <span>{phone_number}</span>
                </p>
                <p>
                  commentaire: <span>{comment}</span>
                </p>
                <p>{renderAudio(audio)}</p>
              </div>
              <Divider />
              <div className="conditions">
                <Button
                  variant="outlined"
                  className={
                    flag.toLowerCase() === "stable" ? "stable-active" : ""
                  }
                >
                  stable
                </Button>
                <Button
                  variant="outlined"
                  className={
                    flag.toLowerCase() === "suspect" ? "urgent-active" : ""
                  }
                >
                  suspect
                </Button>
                <Button
                  variant="outlined"
                  className={
                    flag.toLowerCase() === "urgent" ? "critique-active" : ""
                  }
                >
                  urgent
                </Button>
              </div>
              <Divider />
              {renderTested()}
              <Divider />
              <Button variant="outlined" size="small" onClick={onClose}>
                revenir au dashboard
              </Button>
            </div>
          </Grid>
          <Grid item md={6} xs={12}>
            <div className="claim-dialog-questions">{renderCategories()}</div>
          </Grid>
        </Grid>
      )}
    </Dialog>
  );
};
export default ClaimDialog;
