import { useI18next } from 'gatsby-plugin-react-i18next';
import React from 'react';
import { useAppDispatch } from '../../../redux/store';
import { MailInputBox } from './MailInputBox';
import { LoginModalInputTypes, LoginModalVerifyTypes, loginModalInput, loginModalVerifyRequest } from './redux/actions';

import { useLoginModalState } from './redux/state';

export function PasswordResetRequestForm() {
    const { t } = useI18next();
    const dispatch = useAppDispatch();

    const userEmail = useLoginModalState().userEmail;
    const userEmailError = useLoginModalState().userEmailError;

    return (
        <>
            <div className="login-modal-input-container">
                <MailInputBox
                    helpText={t('mailForPasswordReset')}
                    userEmail={userEmail}
                    onChange={(event) => {
                        dispatch(loginModalInput(LoginModalInputTypes.USER_EMAIL, event.target.value));
                    }}
                    error={userEmailError}
                />
            </div>
            <div className="login-modal-button-container">
                <button
                    className="login-modal-button-black-on-green"
                    onClick={() => {
                        dispatch(loginModalVerifyRequest(LoginModalVerifyTypes.USER_EMAIL));
                    }}
                >
                    {t('OTPSendSMS')}
                </button>
            </div>
        </>
    );
}
