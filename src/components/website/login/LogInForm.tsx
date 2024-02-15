import React from 'react';
import { useI18next } from 'gatsby-plugin-react-i18next';
import { MailInputBox } from './MailInputBox';
import { PasswordInputBox } from './PasswordInputBox';
import { UserAuthState } from './LoginModal';
import { userAuthStateFromUserPasswords } from './UserAuthStateUtils';

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
                />
                <PasswordInputBox
                    userAuthState={props.userAuthState}
                    helpText={t('enterPassword')}
                    testId="userPasswordLogin"
                    onChange={(event) => {
                        props.setUserPassword(event.target.value);
                    }}
                />
            </div>
            <div className="login-modal-button-container">
                <input
                    className="login-modal-button-black-on-green"
                    type="button"
                    value={t('next')}
                    onClick={() => {
                        // TODO not tested
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
