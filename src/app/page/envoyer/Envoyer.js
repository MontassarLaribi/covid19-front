import React from "react";

import group from "./Group40.svg";

import "./envoyer.css";

const Envoyer = (props) => {
  return (
    <>
      <button className="send">
        <img src={group} alt="message sent" />
      </button>

      <div className="jumbotron jumbotron-fluid text-center ">
        <h1>Formulaire envoyé!</h1>
        <p className="lead">
          Nous avons bien reçu votre formulaire, il sera traité dans les plus
          brefs délais par notre équipe.&nbsp;
          <strong>
            Gardez votre téléphone dans les environs, vous recevrez nos
            consignes par SMS.
          </strong>
        </p>

        <p>
          <a className="button" href="/" role="button">
            revenir à la page d'accueil
          </a>
        </p>

        <hr />
      </div>
    </>
  );
};

export default Envoyer;
