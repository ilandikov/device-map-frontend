import { useI18next } from 'gatsby-plugin-react-i18next';
import React, { useState } from 'react';
import { UserAuthState } from './LoginModal';
import { PasswordInputBox } from './PasswordInputBox';
import { userAuthStateFromUserPasswords } from './UserAuthStateUtils';

function passwordInputErrorFromUserAuthState(userAuthState: UserAuthState): Error | null {
    if (userAuthState === UserAuthState.SIGNUP_PASSWORD_ERROR) {
        return new Error();
    }

    return null;
}

export function PasswordCreationForm(props: {
    userAuthState: UserAuthState;
    setUserAuthState: (string) => void;
    userPassword: string;
    setUserPassword: (newUserPassword: string) => void;
    userPasswordRepeat: string;
    setUserPasswordRepeat: (newUserPassword: string) => void;
}) {
    const { t } = useI18next();

    const [_newPasswordInputError, setNewPasswordInputError] = useState(null);

    return (
        <>
            <div className="login-modal-input-container">
                <PasswordInputBox
                    helpText={t('enterPassword')}
                    testId="userPassword"
                    onChange={(event) => props.setUserPassword(event.target.value)}
                    error={_newPasswordInputError}
                />
                <PasswordInputBox
                    helpText={t('repeatPassword')}
                    testId="userPasswordRepeat"
                    onChange={(event) => props.setUserPasswordRepeat(event.target.value)}
                    error={_newPasswordInputError}
                />
            </div>
            <div className="login-modal-button-container">
                <button
                    className="login-modal-button-black-on-green"
                    onClick={() => {
                        const nextUserState = userAuthStateFromUserPasswords(
                            props.userPassword,
                            props.userPasswordRepeat,
                        );
                        const error = passwordInputErrorFromUserAuthState(nextUserState);
                        setNewPasswordInputError(error);

                        if (error === null) {
                            props.setUserAuthState(UserAuthState.SIGNUP_OTP);
                        }
                    }}
                >
                    {t('next')}
                </button>
            </div>
        </>
    );
}
