import { LoginModalButton, LoginModalButtonClick } from './LoginModalAction';
import { AuthenticationState, AuthenticationStep, buildAuthenticationState } from './AuthenticationState';

export function afterButtonClick(
    action: LoginModalButtonClick,
    state: AuthenticationState,
): Partial<AuthenticationState> {
    const stateTransformer = stateTransformers[action.button];
    return stateTransformer(state);
}

type StateTransformer = (state: AuthenticationState) => Partial<AuthenticationState>;

const stateTransformers: { [key in LoginModalButton]: StateTransformer } = {
    ACCOUNT_REGISTER: () => ({ step: AuthenticationStep.MAIL_INPUT }),
    ACCOUNT_LOGIN: () => ({ step: AuthenticationStep.LOGIN, error: null }),
    CANCEL: () => buildAuthenticationState({}),
    RESET_PASSWORD: () => ({ step: AuthenticationStep.PASSWORD_RESET_REQUEST, password: '', error: null }),
    USER_BUTTON: () => buildAuthenticationState({}),
    GO_BACK: (state) => ({ step: goBackFrom[state.step] }),
};

type StepMap = Partial<{ [key in AuthenticationStep]: AuthenticationStep }>;

const goBackFrom: StepMap = {
    MAIL_INPUT: AuthenticationStep.WELCOME,
    LOGIN: AuthenticationStep.WELCOME,
    PASSWORD_CREATION: AuthenticationStep.MAIL_INPUT,
    PASSWORD_RESET_REQUEST: AuthenticationStep.LOGIN,
};
