import { useI18next } from 'gatsby-plugin-react-i18next';
import React, { useState } from 'react';
import { PasswordInputBox } from './PasswordInputBox';
import { getPasswordInputErrorAndNextState } from './UserAuthStateUtils';

interface PasswordCreationFormProps {
    setUserAuthState: (string) => void;
    userPassword: string;
    setUserPassword: (newUserPassword: string) => void;
    userPasswordRepeat: string;
    setUserPasswordRepeat: (newUserPassword: string) => void;
}

export function PasswordCreationForm(props: PasswordCreationFormProps) {
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
                        const { passwordInputError, nextUserAuthState } = getPasswordInputErrorAndNextState(
                            props.userPassword,
                            props.userPasswordRepeat,
                        );

                        setPasswordInputError(passwordInputError);
                        props.setUserAuthState(nextUserAuthState);
                    }}
                >
                    {t('next')}
                </button>
            </div>
        </>
    );
}
