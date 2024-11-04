import { AuthenticationState, AuthenticationStep } from './AuthenticationState';
import { LoginModalRemoteRequest, LoginModalRemoteRequestType } from './LoginModalAction';
import {
    PreAuthErrorChecker,
    getEmailError,
    getOTPError,
    getPasswordError,
    noErrorCheck,
} from './AuthenticationErrors';
import { StepMap } from './Authentication';

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

    if (fromRemoteStep[state.step]) {
        return { step: fromRemoteStep[state.step], error: null };
    }

    return { error: null };
}

const errorCheckers: Partial<{ [key in LoginModalRemoteRequestType]: PreAuthErrorChecker }> = {
    USERNAME: getEmailError,
    PASSWORD: getPasswordError,
    USERNAME_AND_PASSWORD: noErrorCheck,
    OTP: getOTPError,
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
