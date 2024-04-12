import {
    LoginModalAction,
    LoginModalActionTypes,
    LoginModalInputTypes,
    LoginModalNotificationResult,
    LoginModalNotificationTypes,
    LoginModalRemoteRequestType,
} from './LoginModalAction';
import {
    AuthenticationStep,
    LoginModalAuthenticationState,
    MailInputError,
    OTPError,
    PasswordError,
    authenticationInitialState,
} from './LoginModalAuthenticationState';
import { getPasswordError, isEmailValid } from './LoginModalAuthenticationHelpers';

export function loginModalAuthentication(
    state: LoginModalAuthenticationState = authenticationInitialState,
    action: LoginModalAction,
): LoginModalAuthenticationState {
    switch (action.type) {
        case LoginModalActionTypes.NOTIFICATION: {
            let successStep = state.step;
            let fallbackStep = state.step;

            switch (action.notification) {
                case LoginModalNotificationTypes.SIGN_UP: {
                    successStep = AuthenticationStep.PASSWORD_CREATION_OTP;
                    fallbackStep = AuthenticationStep.MAIL_INPUT;
                    break;
                }
                case LoginModalNotificationTypes.FORGOT_PASSWORD: {
                    successStep = AuthenticationStep.PASSWORD_RESET_OTP;
                    fallbackStep = AuthenticationStep.PASSWORD_RESET_REQUEST;
                    break;
                }
                case LoginModalNotificationTypes.OTP: {
                    successStep = AuthenticationStep.LOGGED_IN;
                    fallbackStep = AuthenticationStep.PASSWORD_CREATION_OTP;
                    break;
                }
                case LoginModalNotificationTypes.PASSWORD_RESET: {
                    successStep = AuthenticationStep.LOGGED_IN;
                    fallbackStep = AuthenticationStep.PASSWORD_RESET_OTP;
                    break;
                }
                case LoginModalNotificationTypes.SIGN_IN: {
                    successStep = AuthenticationStep.LOGGED_IN;
                    fallbackStep = AuthenticationStep.LOGIN;
                    break;
                }
            }

            if (action.result === LoginModalNotificationResult.FAILURE) {
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
        case LoginModalActionTypes.INPUT: {
            switch (action.input.type) {
                case LoginModalInputTypes.EMAIL:
                    return { ...state, email: action.input.payload };
                case LoginModalInputTypes.PASSWORD:
                    return { ...state, password: action.input.payload };
                case LoginModalInputTypes.PASSWORD_REPEAT:
                    return { ...state, passwordRepeat: action.input.payload };
                case LoginModalInputTypes.OTP:
                    return { ...state, OTP: action.input.payload };
                default:
                    return state;
            }
        }
        case LoginModalActionTypes.REMOTE_REQUEST: {
            switch (action.request) {
                case LoginModalRemoteRequestType.USERNAME: {
                    if (isEmailValid(state.email) === false) {
                        return { ...state, error: new Error(MailInputError.NOT_VALID) };
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
        case LoginModalActionTypes.BUTTON_CLICKED:
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
