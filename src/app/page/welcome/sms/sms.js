import React from "react";
import { Modal } from "@fuse";

import group from "./Groupe.png";
import elilpse from "./Ellipse33.svg";

import "./sms.scss";

const Sms =({modalAction,history,tel})=> {
  return (
    <Modal className="sms" id="sms" ModalAction={modalAction}>
      <img className="Ellipse" src={elilpse} />
      <button onClick={()=>history.push("/envoiyer/maladie")} className="send">
         <img src={group} />
      </button>

      <div className="jumbotron jumbotron-fluid text-center ">
        <h1>SMS envoyé</h1>
        <p className="lead">
          Nous venons d'envoyer un code à six chiffres au{" "}
          <strong>{tel} </strong>. Entrez le code reçu ci-dessous <br />{" "}
          pour confirmer votre identité
        </p>

        <div className="sms-verification-simple">
          <input
            type="text"
            className="form-control"
            maxlength="6"
            placeholder=""
            aria-describedby="basic-addon1"
          />
        </div>

        <hr />
        <p>
          Having trouble? <br /> <a href="">Contact us</a>
        </p>
      </div>
    </Modal>
  );
}

export default Sms;
