import {
    LoginModalAction,
    LoginModalActionType,
    LoginModalInputType,
    LoginModalRemoteAnswerResult,
    LoginModalRemoteAnswerType,
    LoginModalRemoteRequestType,
} from './LoginModalAction';
import {
    AuthenticationStep,
    LoginModalAuthenticationState,
    authenticationInitialState,
} from './LoginModalAuthenticationState';
import { OTPError, PasswordError, getEmailError, getPasswordError } from './LoginModalAuthenticationHelpers';

function appleSauce(type: LoginModalInputType, state: LoginModalAuthenticationState, payload: string) {
    switch (type) {
        case LoginModalInputType.EMAIL:
            return { ...state, email: payload };
        case LoginModalInputType.PASSWORD:
            return { ...state, password: payload };
        case LoginModalInputType.PASSWORD_REPEAT:
            return { ...state, passwordRepeat: payload };
        case LoginModalInputType.OTP:
            return { ...state, OTP: payload };
        default:
            return state;
    }
}

export function loginModalAuthentication(
    state: LoginModalAuthenticationState = authenticationInitialState,
    action: LoginModalAction,
): LoginModalAuthenticationState {
    switch (action.type) {
        case LoginModalActionType.REMOTE_ANSWER: {
            let successStep = state.step;
            let fallbackStep = state.step;

            switch (action.answer) {
                case LoginModalRemoteAnswerType.SIGN_UP: {
                    successStep = AuthenticationStep.PASSWORD_CREATION_OTP;
                    fallbackStep = AuthenticationStep.MAIL_INPUT;
                    break;
                }
                case LoginModalRemoteAnswerType.FORGOT_PASSWORD: {
                    successStep = AuthenticationStep.PASSWORD_RESET_OTP;
                    fallbackStep = AuthenticationStep.PASSWORD_RESET_REQUEST;
                    break;
                }
                case LoginModalRemoteAnswerType.OTP: {
                    successStep = AuthenticationStep.LOGGED_IN;
                    fallbackStep = AuthenticationStep.PASSWORD_CREATION_OTP;
                    break;
                }
                case LoginModalRemoteAnswerType.PASSWORD_RESET: {
                    successStep = AuthenticationStep.LOGGED_IN;
                    fallbackStep = AuthenticationStep.PASSWORD_RESET_OTP;
                    break;
                }
                case LoginModalRemoteAnswerType.SIGN_IN: {
                    successStep = AuthenticationStep.LOGGED_IN;
                    fallbackStep = AuthenticationStep.LOGIN;
                    break;
                }
            }

            if (action.result === LoginModalRemoteAnswerResult.FAILURE) {
                return {
                    ...state,
                    step: fallbackStep,
                    error: new Error(action.reason),
                };
            }

            return {
                ...state,
                step: successStep,
            };
        }
        case LoginModalActionType.INPUT: {
            return appleSauce(action.input.type, state, action.input.payload);
        }
        case LoginModalActionType.REMOTE_REQUEST: {
            switch (action.request) {
                case LoginModalRemoteRequestType.USERNAME: {
                    const emailError = getEmailError(state.email);
                    if (emailError) {
                        return { ...state, error: emailError };
                    }

                    switch (state.step) {
                        case AuthenticationStep.PASSWORD_RESET_REQUEST:
                            return {
                                ...state,
                                step: AuthenticationStep.PASSWORD_RESET_LOADING,
                                error: null,
                            };
                        case AuthenticationStep.MAIL_INPUT:
                            return {
                                ...state,
                                step: AuthenticationStep.PASSWORD_CREATION,
                                error: null,
                            };
                    }

                    return state;
                }
                case LoginModalRemoteRequestType.PASSWORD: {
                    if (state.password !== state.passwordRepeat) {
                        return {
                            ...state,
                            error: new Error(PasswordError.NOT_MATCHING),
                        };
                    }

                    const passwordError = getPasswordError(state.password);
                    if (passwordError) {
                        return { ...state, error: passwordError };
                    }

                    switch (state.step) {
                        case AuthenticationStep.PASSWORD_CREATION:
                            return {
                                ...state,
                                step: AuthenticationStep.PASSWORD_CREATION_LOADING,
                                error: null,
                            };
                        case AuthenticationStep.PASSWORD_RESET:
                            return { ...state, step: AuthenticationStep.PASSWORD_RESET_LOADING, error: null };
                    }

                    return state;
                }
                case LoginModalRemoteRequestType.USERNAME_AND_PASSWORD: {
                    return { ...state, step: AuthenticationStep.LOGIN_LOADING };
                }
                case LoginModalRemoteRequestType.OTP: {
                    if (state.OTP.length < 6) {
                        return { ...state, error: new Error(OTPError.TOO_SHORT) };
                    }

                    switch (state.step) {
                        case AuthenticationStep.PASSWORD_CREATION_OTP: {
                            return { ...state, step: AuthenticationStep.PASSWORD_CREATION_OTP_LOADING };
                        }
                        case AuthenticationStep.PASSWORD_RESET_OTP: {
                            return { ...state, step: AuthenticationStep.PASSWORD_RESET, error: null };
                        }
                    }

                    return state;
                }
                default:
                    return state;
            }
        }
        case LoginModalActionType.BUTTON_CLICKED:
            switch (action.button) {
                case 'accountRegister':
                    return { ...state, step: AuthenticationStep.MAIL_INPUT };
                case 'accountLogin':
                    return { ...state, step: AuthenticationStep.LOGIN, error: null };
                case 'cancel':
                    return authenticationInitialState;
                case 'resetPassword':
                    return {
                        ...state,
                        step: AuthenticationStep.PASSWORD_RESET_REQUEST,
                        password: '',
                        error: null,
                    };
                case 'userButton':
                    return authenticationInitialState;
                case 'next':
                    switch (state.step) {
                        case AuthenticationStep.PASSWORD_RESET_OTP:
                            return { ...state, step: AuthenticationStep.PASSWORD_RESET_LOADING };
                        default:
                            return state;
                    }
                case 'goBack':
                    switch (state.step) {
                        case AuthenticationStep.MAIL_INPUT:
                        case AuthenticationStep.LOGIN:
                            return { ...state, step: AuthenticationStep.WELCOME };
                        case AuthenticationStep.PASSWORD_CREATION:
                            return { ...state, step: AuthenticationStep.MAIL_INPUT };
                        case AuthenticationStep.PASSWORD_RESET_REQUEST:
                            return { ...state, step: AuthenticationStep.LOGIN };
                    }
            }
    }
    return state;
}
