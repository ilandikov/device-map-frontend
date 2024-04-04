import {
    LoginModalAction,
    LoginModalActionTypes,
    LoginModalInputTypes,
    LoginModalNotificationResult,
    LoginModalNotificationTypes,
    LoginModalVerifyTypes,
} from './actions';
import {
    AuthenticationState,
    AuthenticationStep,
    MailInputError,
    OTPError,
    PasswordError,
    authenticationInitialState,
} from './state';
import { getPasswordError, isEmailRegistered, isEmailValid } from './reducerUtils';

export function authentication(
    state: AuthenticationState = authenticationInitialState,
    action: LoginModalAction,
): AuthenticationState {
    switch (action.type) {
        case LoginModalActionTypes.NOTIFICATION: {
            switch (action.notification) {
                case LoginModalNotificationTypes.FORGOT_PASSWORD: {
                    if (action.result === LoginModalNotificationResult.FAILURE) {
                        return {
                            ...state,
                            step: AuthenticationStep.PASSWORD_RESET_REQUEST,
                            error: new Error(action.reason),
                        };
                    }

                    return {
                        ...state,
                        step: AuthenticationStep.PASSWORD_RESET_OTP,
                    };
                }
            }

            if (state.step === AuthenticationStep.PASSWORD_RESET_OTP_LOADING) {
                if (action.result === LoginModalNotificationResult.FAILURE) {
                    return { ...state, step: AuthenticationStep.LOGIN, error: new Error(action.reason) };
                }

                return { ...state, step: AuthenticationStep.LOGGED_IN };
            }

            if (action.result === LoginModalNotificationResult.FAILURE) {
                return { ...state, error: new Error(action.reason) };
            }

            return state;
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
        case LoginModalActionTypes.VERIFY_REQUEST: {
            switch (action.verify) {
                case LoginModalVerifyTypes.EMAIL: {
                    if (isEmailValid(state.email) === false) {
                        return { ...state, error: new Error(MailInputError.NOT_VALID) };
                    }

                    if (state.step === AuthenticationStep.PASSWORD_RESET_REQUEST) {
                        return {
                            ...state,
                            step: AuthenticationStep.PASSWORD_RESET_OTP_LOADING,
                            error: null,
                        };
                    }

                    if (isEmailRegistered(state.email)) {
                        return { ...state, error: new Error(MailInputError.ALREADY_EXISTS) };
                    }

                    return {
                        ...state,
                        step: AuthenticationStep.PASSWORD_CREATION,
                        error: null,
                    };
                }
                case LoginModalVerifyTypes.PASSWORD: {
                    if (state.password !== state.passwordRepeat) {
                        return {
                            ...state,
                            error: new Error(PasswordError.NOT_MATCHING),
                        };
                    }
                    const passwordError = getPasswordError(state.password);
                    const nextAuthenticationStep = passwordError
                        ? AuthenticationStep.PASSWORD_CREATION
                        : AuthenticationStep.PASSWORD_CREATION_OTP;

                    return { ...state, step: nextAuthenticationStep, error: passwordError };
                }
                case LoginModalVerifyTypes.EMAIL_AND_PASSWORD: {
                    return { ...state, step: AuthenticationStep.PASSWORD_RESET_OTP_LOADING };
                }
                case LoginModalVerifyTypes.OTP: {
                    if (state.OTP.length < 6) {
                        return { ...state, error: new Error(OTPError.TOO_SHORT) };
                    }

                    switch (state.step) {
                        case AuthenticationStep.PASSWORD_CREATION_OTP: {
                            return { ...state, step: AuthenticationStep.PASSWORD_CREATION_OTP_LOADING };
                        }
                        case AuthenticationStep.PASSWORD_RESET_OTP: {
                            return { ...state, step: AuthenticationStep.PASSWORD_RESET };
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
                    return { ...state, step: AuthenticationStep.PASSWORD_RESET_REQUEST, password: '', error: null };
                case 'next':
                    switch (state.step) {
                        case AuthenticationStep.PASSWORD_RESET_OTP:
                            return { ...state, step: AuthenticationStep.PASSWORD_RESET_OTP_LOADING };
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
