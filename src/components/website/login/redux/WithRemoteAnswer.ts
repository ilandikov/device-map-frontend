import { LoginModalRemoteAnswer, LoginModalRemoteAnswerResult } from './LoginModalAction';
import { AuthenticationState, AuthenticationStep } from './AuthenticationState';

export function withRemoteAnswer(
    action: LoginModalRemoteAnswer,
    state: AuthenticationState,
): Partial<AuthenticationState> {
    const { successStep, fallbackStep } = fromLoadingStep[state.step] ?? {
        successStep: state.step,
        fallbackStep: state.step,
    };

    if (action.result === LoginModalRemoteAnswerResult.FAILURE) {
        return { step: fallbackStep, error: new Error(action.reason) };
    }

    return { step: successStep };
}

type nextSteps = {
    successStep: AuthenticationStep;
    fallbackStep: AuthenticationStep;
};

const fromLoadingStep: Partial<{ [key in AuthenticationStep]: nextSteps }> = {
    PASSWORD_CREATION_LOADING: {
        successStep: AuthenticationStep.PASSWORD_CREATION_OTP,
        fallbackStep: AuthenticationStep.MAIL_INPUT,
    },
    PASSWORD_RESET_REQUEST_LOADING: {
        successStep: AuthenticationStep.PASSWORD_RESET_OTP,
        fallbackStep: AuthenticationStep.PASSWORD_RESET_REQUEST,
    },
    PASSWORD_CREATION_OTP_LOADING: {
        successStep: AuthenticationStep.LOGGED_IN,
        fallbackStep: AuthenticationStep.PASSWORD_CREATION_OTP,
    },
    PASSWORD_CREATION_OTP_RESEND_LOADING: {
        successStep: AuthenticationStep.PASSWORD_CREATION_OTP,
        fallbackStep: AuthenticationStep.PASSWORD_CREATION_OTP,
    },
    PASSWORD_RESET_LOADING: {
        successStep: AuthenticationStep.LOGGED_IN,
        fallbackStep: AuthenticationStep.PASSWORD_RESET_OTP,
    },
    LOGIN_LOADING: {
        successStep: AuthenticationStep.LOGGED_IN,
        fallbackStep: AuthenticationStep.LOGIN,
    },
};
