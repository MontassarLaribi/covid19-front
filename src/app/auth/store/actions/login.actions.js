import firebaseService from 'app/services/firebaseService';
import jwtService from 'app/services/jwtService';
import {setUserData} from './user.actions';
import * as Actions from 'app/store/actions';

export const LOGIN_ERROR = 'LOGIN_ERROR';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';

export function submitLogin({email, password})
{
    console.log('{email, password} submitLogin', {email, password})
    return (dispatch) =>{
        return jwtService.signInWithEmailAndPassword(email, password)
        .then((user) => {
            const userConfig = {
                role: user.roles,
                data: {
                    displayName: user.username,
                    photoURL   : '',
                    email      : '',
                    settings   : {},
                    shortcuts  : []
                }
            };

               dispatch(setUserData(userConfig));

               dispatch({
                    type: LOGIN_SUCCESS
                });
   
                return userConfig
            }
        )
        .catch(error => {
         dispatch({
                type   : LOGIN_ERROR,
                payload: error
            });

            return error 
        });
    }
}

export function submitLoginWithFireBase({username, password})
{
    return (dispatch) =>
        firebaseService.auth && firebaseService.auth.signInWithEmailAndPassword(username, password)
            .then(() => {
                return dispatch({
                    type: LOGIN_SUCCESS
                });
            })
            .catch(error => {
                const usernameErrorCodes = [
                    'auth/email-already-in-use',
                    'auth/invalid-email',
                    'auth/operation-not-allowed',
                    'auth/user-not-found',
                    'auth/user-disabled'
                ];
                const passwordErrorCodes = [
                    'auth/weak-password',
                    'auth/wrong-password'
                ];

                const response = {
                    username: usernameErrorCodes.includes(error.code) ? error.message : null,
                    password: passwordErrorCodes.includes(error.code) ? error.message : null
                };

                if ( error.code === 'auth/invalid-api-key' )
                {
                    dispatch(Actions.showMessage({message: error.message}));
                }

                return dispatch({
                    type   : LOGIN_ERROR,
                    payload: response
                });
            });
}
