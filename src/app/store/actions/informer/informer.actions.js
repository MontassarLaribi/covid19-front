import axios from "axios";
export const ADD_INFORMER_START = "ADD_INFORMER_START";
export const ADD_INFORMER_FAIL = "ADD_INFORMER_FAIl";
export const addInformer = data => async (dispatch, getState) => {
  dispatch({ type: ADD_INFORMER_START });
  try {
    //   await axios.post("http://api.ensembletn.beecoop.co/api/v1/informer", data);
    console.log("actiooooon", data);
  } catch (error) {
    dispatch({ type: ADD_INFORMER_FAIL, payload: error });
  }
};
