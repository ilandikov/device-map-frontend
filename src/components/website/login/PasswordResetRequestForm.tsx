import { useI18next } from 'gatsby-plugin-react-i18next';
import React from 'react';
import { MailInputBox } from './MailInputBox';

import { UserAuthState } from './UserAuthStateUtils';

interface PasswordResetRequestFormProps {
    setUserAuthState: (string) => void;
    userEmail: string;
    setUserEmail: (event) => void;
}

export function PasswordResetRequestForm(props: PasswordResetRequestFormProps) {
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
                    error={null}
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
