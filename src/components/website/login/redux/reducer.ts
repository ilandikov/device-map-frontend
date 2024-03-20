import { LoginModalAction, LoginModalActionTypes, LoginModalInputTypes, LoginModalVerifyTypes } from './actions';
import { AuthenticationState, AuthenticationStep, MailInputError, authenticationInitialState } from './state';
import {
    authenticationStepFromUserLogin,
    getMailInputError,
    getPasswordInputErrorAndNextState,
    isValidEmail,
} from './reducerUtils';

export function isEmailRegistered(userEmail: string) {
    return getMailInputError(userEmail) && getMailInputError(userEmail).message === MailInputError.ALREADY_EXISTS;
}

export function authentication(
    state: AuthenticationState = authenticationInitialState,
    action: LoginModalAction,
): AuthenticationState {
    switch (action.type) {
        case LoginModalActionTypes.INPUT: {
            switch (action.input.type) {
                case LoginModalInputTypes.USER_EMAIL:
                    return { ...state, email: action.input.payload };
                case LoginModalInputTypes.USER_PASSWORD:
                    return { ...state, password: action.input.payload };
                case LoginModalInputTypes.USER_PASSWORD_REPEAT:
                    return { ...state, passwordRepeat: action.input.payload };
                default:
                    return state;
            }
        }
        case LoginModalActionTypes.VERIFY_REQUEST: {
            switch (action.verify) {
                case LoginModalVerifyTypes.USER_EMAIL: {
                    if (isValidEmail(state.email) === false) {
                        return { ...state, emailError: new Error(MailInputError.NOT_VALID) };
                    }

                    if (state.step === AuthenticationStep.LOGIN_PASSWORD_RESET) {
                        if (isEmailRegistered(state.email)) {
                            return {
                                ...state,
                                step: AuthenticationStep.LOGIN_OTP,
                                emailError: null,
                            };
                        }

                        return { ...state, emailError: new Error(MailInputError.NOT_REGISTERED) };
                    }

                    if (isEmailRegistered(state.email)) {
                        return { ...state, emailError: new Error(MailInputError.ALREADY_EXISTS) };
                    }

                    return {
                        ...state,
                        step: AuthenticationStep.SIGNUP_PASSWORD,
                        emailError: null,
                    };
                }
                case LoginModalVerifyTypes.USER_PASSWORD: {
                    // TODO move or inline getPasswordInputErrorAndNextState() to this file
                    const { passwordInputError, nextUserAuthState } = getPasswordInputErrorAndNextState(
                        state.password,
                        state.passwordRepeat,
                    );
                    return { ...state, step: nextUserAuthState, passwordError: passwordInputError };
                }
                case LoginModalVerifyTypes.USER_EMAIL_AND_PASSWORD: {
                    return { ...state, step: authenticationStepFromUserLogin(state.email, state.password) };
                }
                default:
                    return state;
            }
        }
        case LoginModalActionTypes.BUTTON_CLICKED:
            switch (action.button) {
                case 'accountRegister':
                    return { ...state, step: AuthenticationStep.MAIL_INPUT };
                case 'accountLogin':
                    return { ...state, step: AuthenticationStep.LOGIN, emailError: null };
                case 'cancel':
                    return authenticationInitialState;
                case 'resetPassword':
                    return { ...state, step: AuthenticationStep.LOGIN_PASSWORD_RESET, password: '' };
                case 'next':
                    switch (state.step) {
                        case AuthenticationStep.SIGNUP_OTP:
                            return { ...state, step: AuthenticationStep.SIGNUP_OTP_LOADING };
                        case AuthenticationStep.LOGIN_OTP:
                            return { ...state, step: AuthenticationStep.LOGIN_OTP_LOADING };
                        default:
                            return state;
                    }
                case 'goBack':
                    switch (state.step) {
                        case AuthenticationStep.MAIL_INPUT:
                        case AuthenticationStep.LOGIN:
                            return { ...state, step: AuthenticationStep.WELCOME };
                        case AuthenticationStep.SIGNUP_PASSWORD:
                            return { ...state, step: AuthenticationStep.MAIL_INPUT };
                        case AuthenticationStep.LOGIN_PASSWORD_RESET:
                            return { ...state, step: AuthenticationStep.LOGIN };
                    }
            }
    }
    return state;
}
