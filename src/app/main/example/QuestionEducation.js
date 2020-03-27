import React, { Component, useState } from "react";
import MuiTextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

const QuestionEducation = props => {
  const [stateNon, setStateNon] = useState(false);
  const [stateOui, setStateOui] = useState(false);
  const [extraField, setExtraField] = useState("");

  const handleClickOui = () => {
    setStateOui(true);
    setStateNon(false);
    props.getState({ stateNon, stateNon, title: props.title });
  };
  const handleClickNon = () => {
    setStateOui(false);
    setStateNon(true);
    props.getState({ stateNon, stateNon, title: props.title });
  };

  return (
    <div>
      <h4>{props.title}</h4>
      <p>{props.description}</p>
      <div>
        <Button
          className=""
          variant={`${stateOui ? "contained" : "outline"}`}
          style={{
            border: "1px solid green",
            borderRadius: 20,
            margin: 10,
            backgroundColor: stateOui ? "green" : "white",
            color: stateOui ? "white" : "green"
          }}
          color="primary"
          onClick={handleClickOui}
        >
          OUI
        </Button>
        <Button
          className=""
          variant={`${stateNon ? "contained" : "outline"}`}
          color="primary"
          style={{
            border: "1px solid red",
            borderRadius: 20,
            margin: 10,
            backgroundColor: stateNon ? "red" : "white",
            color: stateNon ? "white" : "red"
          }}
          onClick={handleClickNon}
        >
          non
        </Button>
        <div>
          {props.withTextField && (
            <>
              <p>{props.textField}</p>
              <MuiTextField
                variant="outlined"
                value={extraField}
                id="filled-basic"
                onChange={v => setExtraField(v.target.value)}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};
export default QuestionEducation;
