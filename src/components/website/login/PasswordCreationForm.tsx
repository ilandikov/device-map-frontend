import { useI18next } from 'gatsby-plugin-react-i18next';
import React, { useState } from 'react';
import { UserAuthState } from './LoginModal';
import { PasswordInputBox } from './PasswordInputBox';
import { getPasswordInputError } from './UserAuthStateUtils';

export function PasswordCreationForm(props: {
    userAuthState: UserAuthState;
    setUserAuthState: (string) => void;
    userPassword: string;
    setUserPassword: (newUserPassword: string) => void;
    userPasswordRepeat: string;
    setUserPasswordRepeat: (newUserPassword: string) => void;
}) {
    const { t } = useI18next();

    const [passwordInputError, setPasswordInputError] = useState(null);

    return (
        <>
            <div className="login-modal-input-container">
                <PasswordInputBox
                    helpText={t('enterPassword')}
                    testId="userPassword"
                    onChange={(event) => props.setUserPassword(event.target.value)}
                    error={passwordInputError}
                />
                <PasswordInputBox
                    helpText={t('repeatPassword')}
                    testId="userPasswordRepeat"
                    onChange={(event) => props.setUserPasswordRepeat(event.target.value)}
                    error={passwordInputError}
                />
            </div>
            <div className="login-modal-button-container">
                <button
                    className="login-modal-button-black-on-green"
                    onClick={() => {
                        const error = getPasswordInputError(props.userPassword, props.userPasswordRepeat);
                        setPasswordInputError(error);

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
