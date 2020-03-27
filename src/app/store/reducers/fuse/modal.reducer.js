export const TOGGLE_MODAL = "TOGGLE_MODAL";

const INIT_STATE = {
  modals: {}
};

export default (state = INIT_STATE, action) => {
  const { type, id } = action;

  let isOpen = true;
  switch (type) {
    case TOGGLE_MODAL:
      if (state.modals[id]) isOpen = !state.modals[id];
      return {
        ...state,
        modals: { ...state.modals, [id]: isOpen }
      };
    default:
      return state;
  }
};
