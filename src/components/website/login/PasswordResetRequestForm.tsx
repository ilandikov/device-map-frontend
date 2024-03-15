import { useI18next } from 'gatsby-plugin-react-i18next';
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../../../redux/store';
import { MailInputBox } from './MailInputBox';
import { LoginModalInputTypes, loginModalButtonClick, loginModalInput } from './actions';
import { LoginModalState } from './reducer';

interface PasswordResetRequestFormProps {
    setUserAuthState: (string) => void;
    userEmail: string;
    setUserEmail: (event) => void;
}

export function PasswordResetRequestForm(props: PasswordResetRequestFormProps) {
    const { t } = useI18next();
    const dispatch = useAppDispatch();

    const loginModalState: LoginModalState = useSelector((state: RootState) => state.loginModalState);
    const userEmail = loginModalState.userEmail;

    return (
        <>
            <div className="login-modal-input-container">
                <MailInputBox
                    helpText={t('mailForPasswordReset')}
                    userEmail={userEmail}
                    onChange={(event) => {
                        dispatch(loginModalInput(LoginModalInputTypes.USER_EMAIL, event.target.value));
                    }}
                    error={null}
                />
            </div>
            <div className="login-modal-button-container">
                <button
                    className="login-modal-button-black-on-green"
                    onClick={() => {
                        dispatch(loginModalButtonClick('OTPSendSMS'));
                    }}
                >
                    {t('OTPSendSMS')}
                </button>
            </div>
        </>
    );
}
