import { LoginModalInputType } from './LoginModalAction';
import { LoginModalAuthenticationState } from './LoginModalAuthenticationState';
import { PreAuthErrorChecker } from './LoginModalAuthentication';

export enum MailInputError {
    NOT_VALID = 'mailNotValid',
}

export enum PasswordError {
    NO_UPPERCASE = 'passwordNoUppercase',
    NOT_MATCHING = 'passwordNotMatching',
    EMPTY = 'passwordEmpty',
    NO_LOWERCASE = 'passwordNoLowercaseChars',
    NO_DIGITS = 'passwordNoDigit',
    NO_SPECIAL_CHARS = 'passwordNoSpecialCharacters',
    TOO_SHORT = 'passwordTooShort',
}

export enum OTPError {
    TOO_SHORT = 'OTPTooShort',
}

export function getEmailError(state: LoginModalAuthenticationState): Error | null {
    const email = state.email;
    const emailRegexp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isMailValid = emailRegexp.test(email);

    if (isMailValid === false) {
        return new Error(MailInputError.NOT_VALID);
    }

    return null;
}

export function getPasswordError(state: LoginModalAuthenticationState): Error | null {
    const password = state.password;

    if (password === '') {
        return new Error(PasswordError.EMPTY);
    }

    if (state.password !== state.passwordRepeat) {
        return new Error(PasswordError.NOT_MATCHING);
    }

    const upperCaseRegExp = new RegExp(/[A-Z]/);
    if (upperCaseRegExp.test(password) === false) {
        return new Error(PasswordError.NO_UPPERCASE);
    }

    const lowerCaseRegExp = new RegExp(/[a-z]/);
    if (lowerCaseRegExp.test(password) === false) {
        return new Error(PasswordError.NO_LOWERCASE);
    }

    const digitsRegExp = new RegExp(/\d/);
    if (digitsRegExp.test(password) === false) {
        return new Error(PasswordError.NO_DIGITS);
    }

    const specialCharacterRegExp = new RegExp(/\W|_/);
    if (specialCharacterRegExp.test(password) === false) {
        return new Error(PasswordError.NO_SPECIAL_CHARS);
    }

    if (password.length < 8) {
        return new Error(PasswordError.TOO_SHORT);
    }

    return null;
}

export function partialStateWithPayload(
    type: LoginModalInputType,
    payload: string,
): Partial<LoginModalAuthenticationState> {
    switch (type) {
        case LoginModalInputType.EMAIL:
            return { email: payload };
        case LoginModalInputType.PASSWORD:
            return { password: payload };
        case LoginModalInputType.PASSWORD_REPEAT:
            return { passwordRepeat: payload };
        case LoginModalInputType.OTP:
            return { OTP: payload };
        default:
            return {};
    }
}

export function getOTPError(state: LoginModalAuthenticationState): Error | null {
    if (state.OTP.length < 6) {
        return new Error(OTPError.TOO_SHORT);
    }

    return null;
}

export const noErrorCheck: PreAuthErrorChecker = () => null;
