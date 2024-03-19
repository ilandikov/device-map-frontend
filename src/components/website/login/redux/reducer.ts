import { LoginModalAction, LoginModalActionTypes, LoginModalInputTypes, LoginModalVerifyTypes } from './actions';
import { LoginModalState, UserAuthState, loginModalInitialState } from './state';
import { getMailInputError, getPasswordInputErrorAndNextState, userAuthStateFromUserLogin } from './reducerUtils';

export function loginModalReducer(state: LoginModalState = loginModalInitialState, action: LoginModalAction) {
    switch (action.type) {
        case LoginModalActionTypes.INPUT: {
            switch (action.input.type) {
                case LoginModalInputTypes.USER_EMAIL:
                    return { ...state, userEmail: action.input.payload };
                case LoginModalInputTypes.USER_PASSWORD:
                    return { ...state, userPassword: action.input.payload };
                case LoginModalInputTypes.USER_PASSWORD_REPEAT:
                    return { ...state, userPasswordRepeat: action.input.payload };
                default:
                    return state;
            }
        }
        case LoginModalActionTypes.VERIFY_REQUEST: {
            switch (action.verify) {
                case LoginModalVerifyTypes.USER_EMAIL: {
                    const mailInputError = getMailInputError(state.userEmail);
                    if (state.userAuthState === UserAuthState.LOGIN_PASSWORD_RESET) {
                        return { ...state, userAuthState: UserAuthState.LOGIN_OTP };
                    }

                    if (mailInputError === null) {
                        return {
                            ...state,
                            userAuthState: UserAuthState.SIGNUP_PASSWORD,
                            userEmailError: null,
                        };
                    }

                    return { ...state, userEmailError: mailInputError };
                }
                case LoginModalVerifyTypes.USER_PASSWORD: {
                    // TODO move or inline getPasswordInputErrorAndNextState() to this file
                    const { passwordInputError, nextUserAuthState } = getPasswordInputErrorAndNextState(
                        state.userPassword,
                        state.userPasswordRepeat,
                    );
                    return { ...state, userAuthState: nextUserAuthState, userPasswordError: passwordInputError };
                }
                case LoginModalVerifyTypes.USER_EMAIL_AND_PASSWORD: {
                    return { ...state, userAuthState: userAuthStateFromUserLogin(state.userEmail, state.userPassword) };
                }
                default:
                    return state;
            }
        }
        case LoginModalActionTypes.BUTTON_CLICKED:
            switch (action.button) {
                case 'accountRegister':
                    return { ...state, userAuthState: UserAuthState.MAIL_INPUT };
                case 'accountLogin':
                    return { ...state, userAuthState: UserAuthState.LOGIN, userEmailError: null };
                case 'cancel':
                    return { ...state, userAuthState: UserAuthState.WELCOME };
                case 'resetPassword':
                    return { ...state, userAuthState: UserAuthState.LOGIN_PASSWORD_RESET, userPassword: '' };
                case 'next':
                    switch (state.userAuthState) {
                        case UserAuthState.SIGNUP_OTP:
                            return { ...state, userAuthState: UserAuthState.SIGNUP_OTP_LOADING };
                        case UserAuthState.LOGIN_OTP:
                            return { ...state, userAuthState: UserAuthState.LOGIN_OTP_LOADING };
                        default:
                            return state;
                    }
                case 'goBack':
                    switch (state.userAuthState) {
                        case UserAuthState.MAIL_INPUT:
                        case UserAuthState.LOGIN:
                            return { ...state, userAuthState: UserAuthState.WELCOME };
                        case UserAuthState.SIGNUP_PASSWORD:
                            return { ...state, userAuthState: UserAuthState.MAIL_INPUT };
                        case UserAuthState.LOGIN_PASSWORD_RESET:
                            return { ...state, userAuthState: UserAuthState.LOGIN };
                    }
            }
    }
    return state;
}
