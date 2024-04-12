import { useI18next } from 'gatsby-plugin-react-i18next';
import React from 'react';
import { useAppDispatch } from '../../../redux/store';
import { MailInputBox } from './MailInputBox';
import {
    LoginModalInputTypes,
    LoginModalVerifyTypes,
    loginModalInput,
    loginModalVerifyRequest,
} from './redux/LoginModalAction';

import { useLoginModalAuthentication } from './redux/LoginModalAuthenticationState';

export function PasswordResetRequestForm() {
    const { t } = useI18next();
    const dispatch = useAppDispatch();

    const { email, error } = useLoginModalAuthentication();

    return (
        <>
            <div className="login-modal-input-container">
                <MailInputBox
                    helpText={t('mailForPasswordReset')}
                    email={email}
                    onChange={(event) => {
                        dispatch(loginModalInput(LoginModalInputTypes.EMAIL, event.target.value));
                    }}
                    error={error}
                />
            </div>
            <div className="login-modal-button-container">
                <button
                    className="login-modal-button-black-on-green"
                    onClick={() => {
                        dispatch(loginModalVerifyRequest(LoginModalVerifyTypes.EMAIL));
                    }}
                >
                    {t('OTPSendSMS')}
                </button>
            </div>
        </>
    );
}
