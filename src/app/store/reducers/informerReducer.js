export const ADD_INFORMER_FAIL = "ADD_INFORMER_FAIL";
export const ADD_INFORMER_START = "ADD_INFORMER_START";

const INIT_STATE = {
  userList: [],
  error: null,
  user: {}
};

export default (state = INIT_STATE, action) => {
  const { type, error } = action;

  switch (type) {
    case ADD_INFORMER_START:
      return { ...state };

    case ADD_INFORMER_FAIL:
      return { ...state, error };

    default:
      return state;
  }
};
