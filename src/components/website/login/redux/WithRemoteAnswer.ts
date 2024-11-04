import { LoginModalRemoteAnswer, LoginModalRemoteAnswerResult, LoginModalRemoteAnswerType } from './LoginModalAction';
import { AuthenticationState, AuthenticationStep } from './AuthenticationState';

export function withRemoteAnswer(
    action: LoginModalRemoteAnswer,
    state: AuthenticationState,
): Partial<AuthenticationState> {
    const { successStep, fallbackStep } = fromRemoteAnswer[action.answer] ?? {
        successStep: state.step,
        fallbackStep: state.step,
    };

    if (action.result === LoginModalRemoteAnswerResult.FAILURE) {
        return { step: fallbackStep, error: new Error(action.reason) };
    }

    return { step: successStep };
}

// TODO remove Partial
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
