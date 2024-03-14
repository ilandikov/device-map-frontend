import { useI18next } from 'gatsby-plugin-react-i18next';
import React from 'react';
import { useAppDispatch } from '../../../redux/store';
import { MailInputBox } from './MailInputBox';

import { UserAuthState } from './UserAuthStateUtils';
import { LoginModalInputTypes, loginModalInput } from './actions';

interface PasswordResetRequestFormProps {
    setUserAuthState: (string) => void;
    userEmail: string;
    setUserEmail: (event) => void;
}

export function PasswordResetRequestForm(props: PasswordResetRequestFormProps) {
    const { t } = useI18next();
    const dispatch = useAppDispatch();

    return (
        <>
            <div className="login-modal-input-container">
                <MailInputBox
                    helpText={t('mailForPasswordReset')}
                    userEmail={props.userEmail}
                    onChange={(event) => {
                        dispatch(loginModalInput(LoginModalInputTypes.USER_EMAIL, event.target.value));
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
