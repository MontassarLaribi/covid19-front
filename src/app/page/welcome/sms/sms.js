import React from "react";
import { Modal } from "@fuse";

import group from "./Groupe.png";
import elilpse from "./Ellipse33.svg";

import "./sms.scss";

const Sms = ({
  modalAction,
  history,
  tel,
  verificationCode,
  submitFinal,
  data,
  type,
  submitFinalPatient
}) => {
  const [code, setCode] = React.useState("");
  const [error, setError] = React.useState(false);

  function handleInputChange(e) {
    const value = e.target.value;
    setCode(value);
    if (value !== verificationCode) {
      setError(true);
    } else {
      setError(false);
      if (type === "informer") {
        submitFinal();
      } else {
        submitFinalPatient();
      }
    }
  }

  return (
    <Modal className="sms" id="sms" ModalAction={modalAction}>
      <div className="modal-content"></div>
      <img className="Ellipse" src={elilpse} alt="ellipse" />
      {/* <button
        onClick={() => history.push("/envoiyer/maladie")}
        className="send"
      >
      </button> */}
      <div className="send">
        <img src={group} alt="sms" />
      </div>

      <div className="jumbotron jumbotron-fluid text-center ">
        <h1>SMS envoyé</h1>
        <p className="lead">
          Nous venons d'envoyer un code à six chiffres au
          <strong>{tel} </strong>. Entrez le code reçu ci-dessous <br /> pour
          confirmer votre identité
        </p>

        <div className="sms-verification-simple">
          {!error ? (
            <input
              style={{
                color: "black",
                border: "2px solid",
                textAlign: "center"
              }}
              type="text"
              className="form-control"
              maxLength="6"
              placeholder=""
              value={code}
              onChange={handleInputChange}
              aria-describedby="basic-addon1"
            />
          ) : (
            <input
              style={{ color: "red", border: "2px solid", textAlign: "center" }}
              type="text"
              className="form-control"
              maxLength="6"
              placeholder=""
              value={code}
              onChange={handleInputChange}
              aria-describedby="basic-addon1"
            />
          )}
        </div>

        <hr />
        {/* <p>
          Having trouble? <br /> <a href="">Contact us</a>
        </p> */}
      </div>
    </Modal>
  );
};

export default Sms;
