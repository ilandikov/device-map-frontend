import { AuthenticationState, AuthenticationStep } from './AuthenticationState';
import { LoginModalRemoteRequest, LoginModalRemoteRequestType } from './LoginModalAction';
import {
    PreAuthErrorChecker,
    getEmailError,
    getOTPError,
    getPasswordError,
    noErrorCheck,
} from './AuthenticationErrors';

export function afterRemoteRequest(
    action: LoginModalRemoteRequest,
    state: AuthenticationState,
): Partial<AuthenticationState> {
    const errorChecker = errorCheckers[action.request];
    if (errorChecker) {
        const error = errorChecker(state);
        if (error) {
            return { error: error };
        }
    }

    const nextStepCalculator = fromRemoteStep[state.step];
    if (nextStepCalculator) {
        return { error: null, ...nextStepCalculator(action, state) };
    }

    return { error: null };
}

const errorCheckers: { [key in LoginModalRemoteRequestType]: PreAuthErrorChecker } = {
    USERNAME: getEmailError,
    PASSWORD: getPasswordError,
    USERNAME_AND_PASSWORD: noErrorCheck,
    OTP: getOTPError,
    OTP_RESEND: noErrorCheck,
    SIGN_OUT: noErrorCheck,
};

const fromRemoteStep: Partial<{
    [key in AuthenticationStep]: (
        action: LoginModalRemoteRequest,
        state: AuthenticationState,
    ) => Partial<AuthenticationState>;
}> = {
    MAIL_INPUT: () => ({ step: AuthenticationStep.PASSWORD_CREATION }),
    LOGIN: () => ({ step: AuthenticationStep.LOGIN_LOADING }),
    PASSWORD_CREATION: () => ({ step: AuthenticationStep.PASSWORD_CREATION_LOADING }),
    PASSWORD_RESET: () => ({ step: AuthenticationStep.PASSWORD_RESET_LOADING }),
    PASSWORD_RESET_REQUEST: () => ({ step: AuthenticationStep.PASSWORD_RESET_LOADING }),
    PASSWORD_CREATION_OTP: () => ({ step: AuthenticationStep.PASSWORD_CREATION_OTP_LOADING }),
    PASSWORD_RESET_OTP: () => ({ step: AuthenticationStep.PASSWORD_RESET }),
};
