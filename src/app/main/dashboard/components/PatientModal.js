import { Button, Dialog, Divider, Grid, TextField } from "@material-ui/core";
import React, { useState } from "react";

const ClaimDialog = ({ visible = false, isSent = false, onClose, patient }) => {
  const [response, setResponse] = useState("");
  const [open, setOpen] = useState(false);

  const {
    guid,
    first_name,
    last_name,
    address,
    zip_code,
    phone_number,
    gender,
    audio,
    responses,
    flag
  } = patient;

  const handleChange = event => {
    setResponse(event.target.value);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const renderClassName = value => {
    const test = value === "false" || value === false || value === "0";
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
    const test = value === "false" || value === false || value === "0";
    switch (test) {
      case false:
        return "non";
      case true:
        return "oui";
      default:
        break;
    }
  };

  const renderQuestions = cat => {
    const newArray = responses.filter(function(resp) {
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
            <TextField
              id={String(q.question.id)}
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
      responses &&
      responses.map((response, index) => {
        switch (response.question.category) {
          case 1:
            return (
              <div key={index}>
                <h3>{index + 1}.Questions générales</h3>
                {renderQuestions(response.question.category)}
              </div>
            );
          case 2:
            return (
              <div key={index}>
                <h3>{index + 1}.Questions médicales</h3>
                {renderQuestions(response.question.category)}
              </div>
            );
          case 3:
            return (
              <div key={index}>
                <h3>{index + 1}.Les symptômes</h3>
                {renderQuestions(response.question.category)}
              </div>
            );

          default:
            break;
        }
      })
    );
  };

  const renderAudio = audio => {
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
                  adresse: <span>{address}</span>
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
                    flag.toLowerCase() === "urgent" ? "urgent-active" : ""
                  }
                >
                  urgent
                </Button>
                <Button
                  variant="outlined"
                  className={
                    flag.toLowerCase() === "critique" ? "critique-active" : ""
                  }
                >
                  critique
                </Button>
              </div>
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
