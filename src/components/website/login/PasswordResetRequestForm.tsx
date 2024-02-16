import { useI18next } from 'gatsby-plugin-react-i18next';
import React from 'react';
import { MailInputBox } from './MailInputBox';

export function PasswordResetRequestForm(props: { userEmail: string; setUserEmail: (event) => void }) {
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
                <input className="login-modal-button-black-on-green" type="button" value={t('OTPSendSMS')} />
            </div>
        </>
    );
}
