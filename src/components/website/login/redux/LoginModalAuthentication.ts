import {
    LoginModalAction,
    LoginModalActionType,
    LoginModalRemoteAnswerResult,
    LoginModalRemoteAnswerType,
    LoginModalRemoteRequestType,
} from './LoginModalAction';
import {
    AuthenticationStep,
    LoginModalAuthenticationState,
    authenticationInitialState,
} from './LoginModalAuthenticationState';
import {
    PreAuthErrorChecker,
    getEmailError,
    getOTPError,
    getPasswordError,
    noErrorCheck,
    partialStateWithPayload,
} from './LoginModalAuthenticationHelpers';

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
            return { ...state, error: null, ...partialStateWithPayload(action.input.type, action.input.payload) };
        }
        case LoginModalActionType.REMOTE_REQUEST: {
            return { ...state, ...nextStateAfterRemoteRequest(state, errorCheckers[action.request]) };
        }
        case LoginModalActionType.BUTTON_CLICKED:
            // TODO extract button names to enum
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
                // TODO rename this to start auth
                case 'next':
                    switch (state.step) {
                        case AuthenticationStep.PASSWORD_RESET_OTP:
                            return { ...state, step: AuthenticationStep.PASSWORD_RESET_LOADING };
                        // TODO remove this case and simplify to one line
                        default:
                            return state;
                    }
                case 'goBack': {
                    return { ...state, step: goBackFrom[state.step] };
                }
            }
    }
    return state;
}

type StepMap = Partial<{ [key in AuthenticationStep]: AuthenticationStep }>;

const goBackFrom: StepMap = {
    MAIL_INPUT: AuthenticationStep.WELCOME,
    LOGIN: AuthenticationStep.WELCOME,
    PASSWORD_CREATION: AuthenticationStep.MAIL_INPUT,
    PASSWORD_RESET_REQUEST: AuthenticationStep.LOGIN,
};

const fromRemoteStep: StepMap = {
    MAIL_INPUT: AuthenticationStep.PASSWORD_CREATION,
    LOGIN: AuthenticationStep.LOGIN_LOADING,
    PASSWORD_CREATION: AuthenticationStep.PASSWORD_CREATION_LOADING,
    PASSWORD_RESET: AuthenticationStep.PASSWORD_RESET_LOADING,
    PASSWORD_RESET_REQUEST: AuthenticationStep.PASSWORD_RESET_LOADING,
    PASSWORD_CREATION_OTP: AuthenticationStep.PASSWORD_CREATION_OTP_LOADING,
    PASSWORD_RESET_OTP: AuthenticationStep.PASSWORD_RESET,
};

const errorCheckers: Partial<{ [key in LoginModalRemoteRequestType]: PreAuthErrorChecker }> = {
    USERNAME: getEmailError,
    PASSWORD: getPasswordError,
    USERNAME_AND_PASSWORD: noErrorCheck,
    OTP: getOTPError,
};

function nextStateAfterRemoteRequest(
    state: LoginModalAuthenticationState,
    errorChecker: PreAuthErrorChecker | undefined,
): Partial<LoginModalAuthenticationState> {
    if (errorChecker) {
        const error = errorChecker(state);
        if (error) {
            return { error: error };
        }
    }

    if (fromRemoteStep[state.step]) {
        return { step: fromRemoteStep[state.step], error: null };
    }

    return { error: null };
}
