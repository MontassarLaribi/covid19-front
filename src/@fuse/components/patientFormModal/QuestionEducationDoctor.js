import React, { useState } from "react";
import MuiTextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

const QuestionEducationDoctor = (props) => {
  const [error, setError] = useState(false);
  const [stateNon, setStateNon] = useState(false);
  const [stateOui, setStateOui] = useState(false);
  const [extraField, setExtraField] = useState("");

  const removeExponent = (e) => {
    if (e.which === 69) {
      e.preventDefault();
    }
  };

  const handleClickOui = () => {
    setStateOui(true);
    setStateNon(false);
    props.getState({
      field: "responses",
      value: "1",
      stateOui,
      title: props.title,
      extraData: props,
    });
  };
  const handleClickNon = () => {
    setStateOui(false);
    setStateNon(true);
    props.getState({
      field: "responses",
      value: "0",
      stateNon,
      title: props.title,
      extraData: props,
    });
  };

  function renderTextField(props) {
    if (props.type === 3 && props.title.indexOf("âge") > -1) {
      return (
        <>
          <p>{props.textField}</p>
          <MuiTextField
            type="number"
            onKeyDown={removeExponent}
            inputProps={{ min: "0", max: "120", step: "1" }}
            error={error}
            variant="outlined"
            value={extraField}
            id="filled-basic"
            onChange={(v) => handleText(v.target.value)}
          />
        </>
      );
    } else if (props.type === 3 && props.title.indexOf("temperature")) {
      return (
        <>
          <p>{props.textField}</p>
          <MuiTextField
            type="number"
            onKeyDown={removeExponent}
            inputProps={{ min: "35", max: "50", step: "0.1" }}
            error={error}
            variant="outlined"
            value={extraField}
            id="filled-basic"
            onChange={(v) => handleText(v.target.value)}
          />
        </>
      );
    } else if (props.type === 2) {
      return (
        <>
          <p>{props.textField}</p>
          <MuiTextField
            fullWidth
            error={error}
            variant="outlined"
            value={extraField}
            id="filled-basic"
            onChange={(v) => handleText(v.target.value)}
          />
        </>
      );
    } else {
      return (
        <>
          <p>{props.textField}</p>
          <MuiTextField
            type="number"
            inputProps={{ min: "35", max: "50", step: "0.1" }}
            error={error}
            variant="outlined"
            value={extraField}
            id="filled-basic"
            onChange={(v) => handleText(v.target.value)}
          />
        </>
      );
    }
  }

  const handleText = (data) => {
    props.getState({
      field: "responses",
      value: data,
      stateNon,
      title: props.title,
      extraData: props,
    });
    setExtraField(data);
    setError(false);
  };

  return (
    <div className="question-item" style={props.style}>
      <h6>{props.title}</h6>
      {/* <p className="arabic-question">{props.description}</p> */}
      {props.type === 1 && (
        <div>
          <Button
            className=""
            variant={`${stateOui ? "contained" : "outlined"}`}
            style={{
              border: "1px solid #11B683",
              borderRadius: 20,
              marginRight: 5,
              backgroundColor: stateOui ? "#11B683" : "white",
              color: stateOui ? "white" : "#11B683",
              boxShadow: stateOui ? "none" : "none",
              lineHeight: "1",
              // padding: "8px 28px",
            }}
            color="primary"
            onClick={handleClickOui}
          >
            OUI
          </Button>
          <Button
            className=""
            variant={`${stateNon ? "contained" : "outlined"}`}
            color="primary"
            style={{
              border: "1px solid #E23B42",
              borderRadius: 20,
              marginRight: 5,
              backgroundColor: stateNon ? "#E23B42" : "white",
              color: stateNon ? "white" : "#E23B42",
              boxShadow: stateNon ? "none" : "none",
              lineHeight: "1",
              // padding: "8px 28px",
            }}
            onClick={handleClickNon}
          >
            non
          </Button>
        </div>
      )}

      {(props.type === 2 || props.type === 3) && renderTextField(props)}
    </div>
  );
};
export default QuestionEducationDoctor;
