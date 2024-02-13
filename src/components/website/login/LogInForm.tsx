import React from 'react';
import { useI18next } from 'gatsby-plugin-react-i18next';
import { MailInputBox } from './MailInputBox';
import { PasswordInputBox } from './PasswordInputBox';
import { UserAuthState } from './LoginModal';

export function LogInForm(props: {
    userAuthState: UserAuthState;
    setUserAuthState: (string) => void;
    userEmail: string;
    setUserEmail: (string) => void;
    onChange: (event) => void;
    onChange1: (event) => void;
    onClick: () => void;
}) {
    const { t } = useI18next();

    return (
        <>
            <div className="login-modal-input-container">
                <MailInputBox helpText={t('onlyEmail')} userEmail={props.userEmail} onChange={props.onChange} />
                <PasswordInputBox
                    userAuthState={props.userAuthState}
                    helpText={t('enterPassword')}
                    testId="userPasswordLogin"
                    onChange={props.onChange1}
                />
            </div>
            <div className="login-modal-button-container">
                <input
                    className="login-modal-button-black-on-green"
                    type="button"
                    value={t('next')}
                    onClick={props.onClick}
                />
            </div>
        </>
    );
}
