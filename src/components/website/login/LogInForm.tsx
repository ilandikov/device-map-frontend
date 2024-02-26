import React from 'react';
import { useI18next } from 'gatsby-plugin-react-i18next';
import { MailInputBox } from './MailInputBox';
import { PasswordInputBox } from './PasswordInputBox';
import { UserAuthState } from './LoginModal';
import { userAuthStateFromUserLogin } from './UserAuthStateUtils';

export function LogInForm(props: {
    userAuthState: UserAuthState;
    setUserAuthState: (string) => void;
    userEmail: string;
    setUserEmail: (string) => void;
    userPassword: string;
    setUserPassword: (string) => void;
    userPasswordRepeat: string;
}) {
    const { t } = useI18next();

    return (
        <>
            <div className="login-modal-input-container">
                <MailInputBox
                    helpText={t('onlyEmail')}
                    userEmail={props.userEmail}
                    onChange={(event) => {
                        props.setUserEmail(event.target.value);
                    }}
                    error={null}
                />
                <PasswordInputBox
                    userAuthState={props.userAuthState}
                    helpText={t('enterPassword')}
                    testId="userPasswordLogin"
                    onChange={(event) => {
                        props.setUserPassword(event.target.value);
                    }}
                    error={null}
                />
            </div>
            <div className="login-modal-button-container">
                <div className="login-modal-two-buttons-on-one-row">
                    <button
                        className="login-modal-correct-input"
                        onClick={() => {
                            props.setUserAuthState(UserAuthState.LOGIN_PASSWORD_RESET);
                        }}
                    >
                        {t('resetPassword')}
                    </button>
                    <button
                        className="login-modal-button-black-on-green"
                        onClick={() => {
                            const nextUserState = userAuthStateFromUserLogin(props.userEmail, props.userPassword);
                            props.setUserAuthState(nextUserState);
                        }}
                    >
                        {t('next')}
                    </button>
                </div>
            </div>
        </>
    );
}
