import { LoginModalButton, LoginModalButtonClick } from './LoginModalAction';
import { AuthenticationState, AuthenticationStep, initialAuthenticationState } from './AuthenticationState';
import { StepMap } from './Authentication';

export function afterButtonClick(
    action: LoginModalButtonClick,
    state: AuthenticationState,
): Partial<AuthenticationState> {
    switch (action.button) {
        case LoginModalButton.ACCOUNT_REGISTER:
            return { step: AuthenticationStep.MAIL_INPUT };
        case LoginModalButton.ACCOUNT_LOGIN:
            return { step: AuthenticationStep.LOGIN, error: null };
        case LoginModalButton.CANCEL:
            return initialAuthenticationState;
        case LoginModalButton.RESET_PASSWORD:
            return {
                step: AuthenticationStep.PASSWORD_RESET_REQUEST,
                password: '',
                error: null,
            };
        case LoginModalButton.USER_BUTTON:
            return initialAuthenticationState;
        // TODO rename this to start auth
        case LoginModalButton.NEXT:
            switch (state.step) {
                case AuthenticationStep.PASSWORD_RESET_OTP:
                    return { step: AuthenticationStep.PASSWORD_RESET_LOADING };
                // TODO remove this case and simplify to one line
                default:
                    return {};
            }
        case LoginModalButton.GO_BACK:
            return { step: goBackFrom[state.step] };
    }

    return {};
}

const goBackFrom: StepMap = {
    MAIL_INPUT: AuthenticationStep.WELCOME,
    LOGIN: AuthenticationStep.WELCOME,
    PASSWORD_CREATION: AuthenticationStep.MAIL_INPUT,
    PASSWORD_RESET_REQUEST: AuthenticationStep.LOGIN,
};
