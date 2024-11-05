import { AuthenticationState, AuthenticationStep } from './AuthenticationState';
import { LoginModalCheck, LoginModalRemoteRequest } from './LoginModalAction';
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
    const errorChecker = errorCheckers[action.check];
    if (errorChecker) {
        const error = errorChecker(state);
        if (error) {
            return { error: error };
        }
    }

    const updater = updaters[state.step];
    if (updater) {
        return { error: null, ...updater(action, state) };
    }

    return { error: null };
}

const errorCheckers: { [key in LoginModalCheck]: PreAuthErrorChecker } = {
    USERNAME: getEmailError,
    PASSWORD: getPasswordError,
    OTP: getOTPError,
    NONE: noErrorCheck,
};

type StateUpdater = (action: LoginModalRemoteRequest, state: AuthenticationState) => Partial<AuthenticationState>;

const fromPasswordCreationOTP: StateUpdater = (action) => {
    switch (action.check) {
        case LoginModalCheck.NONE:
            return { step: AuthenticationStep.PASSWORD_CREATION_OTP_RESEND_LOADING };
        case LoginModalCheck.OTP:
            return { step: AuthenticationStep.PASSWORD_CREATION_OTP_LOADING };
        default:
            return {};
    }
};

const updaters: Partial<{ [key in AuthenticationStep]: StateUpdater }> = {
    MAIL_INPUT: () => ({ step: AuthenticationStep.PASSWORD_CREATION }),
    LOGIN: () => ({ step: AuthenticationStep.LOGIN_LOADING }),
    PASSWORD_CREATION: () => ({ step: AuthenticationStep.PASSWORD_CREATION_LOADING }),
    PASSWORD_RESET: () => ({ step: AuthenticationStep.PASSWORD_RESET_LOADING }),
    PASSWORD_RESET_REQUEST: () => ({ step: AuthenticationStep.PASSWORD_RESET_REQUEST_LOADING }),
    PASSWORD_CREATION_OTP: fromPasswordCreationOTP,
    PASSWORD_RESET_OTP: () => ({ step: AuthenticationStep.PASSWORD_RESET }),
};
