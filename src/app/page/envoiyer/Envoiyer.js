import React, { Component } from "react";

import group from "./Group40.svg";

import "./envoiyer.css";

const Envoiyer = props => {
  return (
    <>
      <button class="send">
        <img src={group} />
      </button>

      <div class="jumbotron jumbotron-fluid text-center ">
        <h1> Formulaire {props.match.params.id} envoyé!</h1>
        <p class="lead">
          Nous avons bien reçu votre formulaire, il sera traité dans les plus
          brefs délais par notre équipe.
          <strong>
            Gardez votre téléphone dans les environs, vous recevrez nos
            consignes par SMS.
          </strong>
        </p>

        <p>
          <a class="button" href="" role="button">
            revenir à la page d'accueil
          </a>
        </p>

        <hr />
        <p>
          Having trouble? <br /> <a href="">Contact us</a>
        </p>
      </div>
    </>
  );
};

export default Envoiyer;
