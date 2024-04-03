import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store';

export function useAuthentication(): AuthenticationState {
    return useSelector((state: RootState) => state.authentication);
}

export enum AuthenticationStep {
    WELCOME = 'WELCOME',
    MAIL_INPUT = 'MAIL_INPUT',
    PASSWORD_CREATION = 'PASSWORD_CREATION',
    PASSWORD_CREATION_OTP = 'PASSWORD_CREATION_OTP',
    PASSWORD_CREATION_OTP_LOADING = 'PASSWORD_CREATION_OTP_LOADING',
    LOGIN = 'LOGIN',
    PASSWORD_RESET_REQUEST = 'PASSWORD_RESET_REQUEST',
    PASSWORD_RESET = 'PASSWORD_RESET',
    PASSWORD_RESET_OTP = 'PASSWORD_RESET_OTP',
    PASSWORD_RESET_OTP_LOADING = 'PASSWORD_RESET_OTP_LOADING',
    LOGGED_IN = 'LOGGED_IN',
}

export const authenticationInitialState: AuthenticationState = {
    step: AuthenticationStep.WELCOME,
    email: '',
    error: null,
    password: '',
    passwordRepeat: '',
    OTP: '',
};

export interface AuthenticationState {
    step: AuthenticationStep;
    email: string;
    error: Error | null;
    password: string;
    passwordRepeat: string;
    OTP: string;
}

export enum MailInputError {
    NOT_VALID = 'mailNotValid',
    ALREADY_EXISTS = 'mailAlreadyExists',
    NOT_REGISTERED = 'mailNotRegistered',
}

export enum PasswordError {
    NO_UPPERCASE = 'NO_UPPERCASE',
    NOT_MATCHING = 'passwordsNotMatching',
    EMPTY = 'passwordEmpty',
    NO_LOWERCASE = 'passwordHasNoLowercaseChars',
    NO_DIGITS = 'passwordHasNoDigit',
    NO_SPECIAL_CHARS = 'passwordHasNoSpecialCharacters',
    TOO_SHORT = 'passwordTooShort',
}

export enum OTPError {
    TOO_SHORT = 'OTPTooShort',
}
