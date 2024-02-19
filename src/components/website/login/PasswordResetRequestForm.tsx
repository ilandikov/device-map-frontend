import { useI18next } from 'gatsby-plugin-react-i18next';
import React from 'react';
import { MailInputBox } from './MailInputBox';
import { UserAuthState } from './LoginModal';

export function PasswordResetRequestForm(props: {
    setUserAuthState: (string) => void;
    userEmail: string;
    setUserEmail: (event) => void;
}) {
    const { t } = useI18next();

    return (
        <>
            <div className="login-modal-input-container">
                <MailInputBox
                    helpText={t('mailForPasswordReset')}
                    userEmail={props.userEmail}
                    onChange={(event) => {
                        props.setUserEmail(event.target.value);
                    }}
                />
            </div>
            <div className="login-modal-button-container">
                <button
                    className="login-modal-button-black-on-green"
                    onClick={() => props.setUserAuthState(UserAuthState.LOGIN_OTP)}
                >
                    {t('OTPSendSMS')}
                </button>
            </div>
        </>
    );
}
