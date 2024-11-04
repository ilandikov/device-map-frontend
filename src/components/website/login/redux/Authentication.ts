import {
    LoginModalAction,
    LoginModalActionType,
    LoginModalInput,
    LoginModalInputType,
    LoginModalRemoteAnswer,
    LoginModalRemoteAnswerResult,
    LoginModalRemoteAnswerType,
    LoginModalRemoteRequestType,
} from './LoginModalAction';
import { AuthenticationState, AuthenticationStep, initialAuthenticationState } from './AuthenticationState';
import {
    PreAuthErrorChecker,
    getEmailError,
    getOTPError,
    getPasswordError,
    noErrorCheck,
} from './AuthenticationErrors';

export function authentication(
    state: AuthenticationState = initialAuthenticationState,
    action: LoginModalAction,
): AuthenticationState {
    switch (action.type) {
        case LoginModalActionType.REMOTE_ANSWER:
            return { ...state, ...withRemoteAnswer(action, state) };
        case LoginModalActionType.INPUT: {
            return { ...state, error: null, ...withPayload(action) };
        }
        case LoginModalActionType.REMOTE_REQUEST: {
            return { ...state, ...afterRemoteRequest(state, errorCheckers[action.request]) };
        }
        case LoginModalActionType.BUTTON_CLICKED:
            // TODO extract button names to enum
            switch (action.button) {
                case 'accountRegister':
                    return { ...state, step: AuthenticationStep.MAIL_INPUT };
                case 'accountLogin':
                    return { ...state, step: AuthenticationStep.LOGIN, error: null };
                case 'cancel':
                    return initialAuthenticationState;
                case 'resetPassword':
                    return {
                        ...state,
                        step: AuthenticationStep.PASSWORD_RESET_REQUEST,
                        password: '',
                        error: null,
                    };
                case 'userButton':
                    return initialAuthenticationState;
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

function withRemoteAnswer(action: LoginModalRemoteAnswer, state: AuthenticationState): Partial<AuthenticationState> {
    const { successStep, fallbackStep } = fromRemoteAnswer[action.answer] ?? {
        successStep: state.step,
        fallbackStep: state.step,
    };

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

const fromRemoteAnswer: Partial<{
    [key in LoginModalRemoteAnswerType]: {
        successStep: AuthenticationStep;
        fallbackStep: AuthenticationStep;
    };
}> = {
    SIGN_UP: {
        successStep: AuthenticationStep.PASSWORD_CREATION_OTP,
        fallbackStep: AuthenticationStep.MAIL_INPUT,
    },
    FORGOT_PASSWORD: {
        successStep: AuthenticationStep.PASSWORD_RESET_OTP,
        fallbackStep: AuthenticationStep.PASSWORD_RESET_REQUEST,
    },
    OTP: {
        successStep: AuthenticationStep.LOGGED_IN,
        fallbackStep: AuthenticationStep.PASSWORD_CREATION_OTP,
    },
    PASSWORD_RESET: {
        successStep: AuthenticationStep.LOGGED_IN,
        fallbackStep: AuthenticationStep.PASSWORD_RESET_OTP,
    },
    SIGN_IN: {
        successStep: AuthenticationStep.LOGGED_IN,
        fallbackStep: AuthenticationStep.LOGIN,
    },
};

const errorCheckers: Partial<{ [key in LoginModalRemoteRequestType]: PreAuthErrorChecker }> = {
    USERNAME: getEmailError,
    PASSWORD: getPasswordError,
    USERNAME_AND_PASSWORD: noErrorCheck,
    OTP: getOTPError,
};

function afterRemoteRequest(
    state: AuthenticationState,
    errorChecker: PreAuthErrorChecker | undefined,
): Partial<AuthenticationState> {
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

function withPayload(action: LoginModalInput): Partial<AuthenticationState> {
    const input = action.input;
    switch (input.type) {
        case LoginModalInputType.EMAIL:
            return { email: input.payload };
        case LoginModalInputType.PASSWORD:
            return { password: input.payload };
        case LoginModalInputType.PASSWORD_REPEAT:
            return { passwordRepeat: input.payload };
        case LoginModalInputType.OTP:
            return { OTP: input.payload };
        default:
            return {};
    }
}
