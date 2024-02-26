import { useI18next } from 'gatsby-plugin-react-i18next';
import React from 'react';
import { UserAuthState } from './LoginModal';
import { PasswordInputBox } from './PasswordInputBox';
import { userAuthStateFromUserPasswords } from './UserAuthStateUtils';

export function PasswordCreationForm(props: {
    userAuthState: UserAuthState;
    setUserAuthState: (string) => void;
    userPassword: string;
    setUserPassword: (newUserPassword: string) => void;
    userPasswordRepeat: string;
    setUserPasswordRepeat: (newUserPassword: string) => void;
}) {
    const { t } = useI18next();

    let passwordInputError: Error | null = null;
    if (props.userAuthState === UserAuthState.SIGNUP_PASSWORD_ERROR) {
        passwordInputError = new Error();
    }
    return (
        <>
            <div className="login-modal-input-container">
                <PasswordInputBox
                    userAuthState={props.userAuthState}
                    helpText={t('enterPassword')}
                    testId="userPassword"
                    onChange={(event) => props.setUserPassword(event.target.value)}
                    error={passwordInputError}
                />
                <PasswordInputBox
                    userAuthState={props.userAuthState}
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
                        const nextUserState = userAuthStateFromUserPasswords(
                            props.userPassword,
                            props.userPasswordRepeat,
                        );
                        props.setUserAuthState(nextUserState);
                    }}
                >
                    {t('next')}
                </button>
            </div>
        </>
    );
}
