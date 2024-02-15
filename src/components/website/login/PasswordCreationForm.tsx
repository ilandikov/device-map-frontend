import { useI18next } from 'gatsby-plugin-react-i18next';
import React from 'react';
import { UserAuthState } from './LoginModal';
import { PasswordInputBox } from './PasswordInputBox';
import { userAuthStateFromUserPasswords } from './UserAuthStateUtils';

export function PasswordCreationForm(props: {
    userAuthState: UserAuthState.PASSWORD_CREATION | UserAuthState.PASSWORD_CREATION_MATCH_ERROR;
    setUserAuthState: (string) => void;
    userPassword: string;
    setUserPassword: (newUserPassword: string) => void;
    userPasswordRepeat: string;
    setUserPasswordRepeat: (newUserPassword: string) => void;
}) {
    const { t } = useI18next();

    return (
        <>
            <div className="login-modal-input-container">
                <PasswordInputBox
                    userAuthState={props.userAuthState}
                    helpText={t('enterPassword')}
                    testId="userPassword"
                    onChange={(event) => props.setUserPassword(event.target.value)}
                />
                <PasswordInputBox
                    userAuthState={props.userAuthState}
                    helpText={t('repeatPassword')}
                    testId="userPasswordRepeat"
                    onChange={(event) => props.setUserPasswordRepeat(event.target.value)}
                />
            </div>
            <div className="login-modal-button-container">
                <input
                    className="login-modal-button-black-on-green"
                    type="button"
                    value={t('next')}
                    onClick={() => {
                        const nextUserState = userAuthStateFromUserPasswords(
                            props.userPassword,
                            props.userPasswordRepeat,
                        );
                        props.setUserAuthState(nextUserState);
                    }}
                />
            </div>
        </>
    );
}
