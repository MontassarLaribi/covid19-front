export const TOGGLE_MODAL = "TOGGLE_MODAL";

export const ModalAction = id => dispatch => {
  dispatch({
    type: TOGGLE_MODAL,
    id
  });
};
