import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store';

export function useLoginModalAuthentication(): LoginModalAuthenticationState {
    return useSelector((state: RootState) => state.loginModalAuthentication);
}

export enum AuthenticationStep {
    WELCOME = 'WELCOME',
    MAIL_INPUT = 'MAIL_INPUT',
    PASSWORD_CREATION = 'PASSWORD_CREATION',
    PASSWORD_CREATION_LOADING = 'PASSWORD_CREATION_LOADING',
    PASSWORD_CREATION_OTP = 'PASSWORD_CREATION_OTP',
    PASSWORD_CREATION_OTP_LOADING = 'PASSWORD_CREATION_OTP_LOADING',
    LOGIN = 'LOGIN',
    LOGIN_LOADING = 'LOGIN_LOADING',
    PASSWORD_RESET_REQUEST = 'PASSWORD_RESET_REQUEST',
    PASSWORD_RESET = 'PASSWORD_RESET',
    PASSWORD_RESET_OTP = 'PASSWORD_RESET_OTP',
    PASSWORD_RESET_LOADING = 'PASSWORD_RESET_LOADING',
    LOGGED_IN = 'LOGGED_IN',
}

export const authenticationInitialState: LoginModalAuthenticationState = {
    step: AuthenticationStep.WELCOME,
    email: '',
    error: null,
    password: '',
    passwordRepeat: '',
    OTP: '',
};

export interface LoginModalAuthenticationState {
    step: AuthenticationStep;
    email: string;
    error: Error | null;
    password: string;
    passwordRepeat: string;
    OTP: string;
}

export enum MailInputError {
    NOT_VALID = 'mailNotValid',
}

export enum CognitoErrors {
    USERNAME_EXISTS = 'cognitoUsernameExistsException',
}

export enum PasswordError {
    NO_UPPERCASE = 'passwordNoUppercase',
    NOT_MATCHING = 'passwordNotMatching',
    EMPTY = 'passwordEmpty',
    NO_LOWERCASE = 'passwordHasNoLowercaseChars',
    NO_DIGITS = 'passwordHasNoDigit',
    NO_SPECIAL_CHARS = 'passwordHasNoSpecialCharacters',
    TOO_SHORT = 'passwordTooShort',
}

export enum OTPError {
    TOO_SHORT = 'OTPTooShort',
}

export function buildAuthenticationState(
    partialState: Partial<LoginModalAuthenticationState>,
): LoginModalAuthenticationState {
    return {
        step: partialState.step ?? AuthenticationStep.WELCOME,
        email: partialState.email ?? '',
        error: partialState.error ?? null,
        password: partialState.password ?? '',
        passwordRepeat: partialState.passwordRepeat ?? '',
        OTP: partialState.OTP ?? '',
    };
}
