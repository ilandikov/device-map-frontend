import { LoginModalAction, LoginModalActionTypes, LoginModalInputTypes, LoginModalVerifyTypes } from './actions';
import { AuthenticationState, AuthenticationStep, authenticationInitialState } from './state';
import { getMailInputError, getPasswordInputErrorAndNextState, userAuthStateFromUserLogin } from './reducerUtils';

export function authentication(
    state: AuthenticationState = authenticationInitialState,
    action: LoginModalAction,
): AuthenticationState {
    switch (action.type) {
        case LoginModalActionTypes.INPUT: {
            switch (action.input.type) {
                case LoginModalInputTypes.USER_EMAIL:
                    return { ...state, email: action.input.payload };
                case LoginModalInputTypes.USER_PASSWORD:
                    return { ...state, password: action.input.payload };
                case LoginModalInputTypes.USER_PASSWORD_REPEAT:
                    return { ...state, passwordRepeat: action.input.payload };
                default:
                    return state;
            }
        }
        case LoginModalActionTypes.VERIFY_REQUEST: {
            switch (action.verify) {
                case LoginModalVerifyTypes.USER_EMAIL: {
                    const mailInputError = getMailInputError(state.email);

                    if (mailInputError !== null) {
                        return { ...state, emailError: mailInputError };
                    }

                    const nextUserAuthState =
                        state.authenticationStep === AuthenticationStep.LOGIN_PASSWORD_RESET
                            ? AuthenticationStep.LOGIN_OTP
                            : AuthenticationStep.SIGNUP_PASSWORD;

                    return {
                        ...state,
                        authenticationStep: nextUserAuthState,
                        emailError: null,
                    };
                }
                case LoginModalVerifyTypes.USER_PASSWORD: {
                    // TODO move or inline getPasswordInputErrorAndNextState() to this file
                    const { passwordInputError, nextUserAuthState } = getPasswordInputErrorAndNextState(
                        state.password,
                        state.passwordRepeat,
                    );
                    return { ...state, authenticationStep: nextUserAuthState, passwordError: passwordInputError };
                }
                case LoginModalVerifyTypes.USER_EMAIL_AND_PASSWORD: {
                    return { ...state, authenticationStep: userAuthStateFromUserLogin(state.email, state.password) };
                }
                default:
                    return state;
            }
        }
        case LoginModalActionTypes.BUTTON_CLICKED:
            switch (action.button) {
                case 'accountRegister':
                    return { ...state, authenticationStep: AuthenticationStep.MAIL_INPUT };
                case 'accountLogin':
                    return { ...state, authenticationStep: AuthenticationStep.LOGIN, emailError: null };
                case 'cancel':
                    return authenticationInitialState;
                case 'resetPassword':
                    return { ...state, authenticationStep: AuthenticationStep.LOGIN_PASSWORD_RESET, password: '' };
                case 'next':
                    switch (state.authenticationStep) {
                        case AuthenticationStep.SIGNUP_OTP:
                            return { ...state, authenticationStep: AuthenticationStep.SIGNUP_OTP_LOADING };
                        case AuthenticationStep.LOGIN_OTP:
                            return { ...state, authenticationStep: AuthenticationStep.LOGIN_OTP_LOADING };
                        default:
                            return state;
                    }
                case 'goBack':
                    switch (state.authenticationStep) {
                        case AuthenticationStep.MAIL_INPUT:
                        case AuthenticationStep.LOGIN:
                            return { ...state, authenticationStep: AuthenticationStep.WELCOME };
                        case AuthenticationStep.SIGNUP_PASSWORD:
                            return { ...state, authenticationStep: AuthenticationStep.MAIL_INPUT };
                        case AuthenticationStep.LOGIN_PASSWORD_RESET:
                            return { ...state, authenticationStep: AuthenticationStep.LOGIN };
                    }
            }
    }
    return state;
}
