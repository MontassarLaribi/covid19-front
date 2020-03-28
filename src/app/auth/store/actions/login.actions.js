import jwtService from "app/services/jwtService";
import { setUserData } from "./user.actions";
import * as Actions from "app/store/actions";

export const LOGIN_ERROR = "LOGIN_ERROR";
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";

export function submitLogin({ email, password }) {
  console.log("{email, password} submitLogin", { email, password });
  return dispatch => {
    return jwtService
      .signInWithEmailAndPassword(email, password)
      .then(user => {
        const userConfig = {
          role: user.roles,
          data: {
            displayName: user.username,
            photoURL: "",
            email: "",
            settings: {},
            shortcuts: []
          }
        };

        dispatch(setUserData(userConfig));

        dispatch({
          type: LOGIN_SUCCESS
        });

        return userConfig;
      })
      .catch(error => {
        dispatch({
          type: LOGIN_ERROR,
          payload: error
        });

        return error;
      });
  };
}
