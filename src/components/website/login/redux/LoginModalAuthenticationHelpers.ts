export enum MailInputError {
    NOT_VALID = 'mailNotValid',
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

export function isEmailValid(email: string) {
    const emailRegexp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegexp.test(email);
}

export function getPasswordError(password: string): Error | null {
    if (password === '') {
        return new Error(PasswordError.EMPTY);
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
