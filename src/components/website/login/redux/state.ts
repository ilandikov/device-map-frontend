import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store';

export function useAuthentication(): AuthenticationState {
    return useSelector((state: RootState) => state.authentication);
}

export enum AuthenticationStep {
    WELCOME = 'WELCOME',
    MAIL_INPUT = 'MAIL_INPUT',
    SIGNUP_PASSWORD = 'SIGNUP_PASSWORD',
    SIGNUP_OTP = 'SIGNUP_OTP',
    SIGNUP_OTP_LOADING = 'SIGNUP_OTP_LOADING',
    LOGIN = 'LOGIN',
    LOGIN_PASSWORD_RESET = 'LOGIN_PASSWORD_RESET',
    LOGIN_OTP = 'LOGIN_OTP',
    LOGIN_OTP_LOADING = 'LOGIN_OTP_LOADING',
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
