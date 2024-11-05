import React from 'react';
import { useI18next } from 'gatsby-plugin-react-i18next';
import { useAppDispatch } from '../../../redux/store';
import { MailInputBox } from './MailInputBox';
import { PasswordInputBox } from './PasswordInputBox';
import {
    LoginModalButton,
    LoginModalCheck,
    LoginModalInputType,
    loginModalButtonClick,
    loginModalInput,
    loginModalRemoteRequest,
} from './redux/LoginModalAction';

import { useLoginModalAuthentication } from './redux/AuthenticationState';
import { ErrorMessage } from './ErrorMessage';

export function LogInForm() {
    const { t } = useI18next();
    const dispatch = useAppDispatch();

    const { email, error } = useLoginModalAuthentication();

    return (
        <>
            <div className="login-modal-input-container">
                <MailInputBox
                    helpText={t('onlyEmail')}
                    email={email}
                    onChange={(event) => {
                        dispatch(loginModalInput(LoginModalInputType.EMAIL, event.target.value));
                    }}
                    error={error}
                />
                <PasswordInputBox
                    helpText={t('enterPassword')}
                    testId="userPasswordLogin"
                    onChange={(event) => {
                        dispatch(loginModalInput(LoginModalInputType.PASSWORD, event.target.value));
                    }}
                    error={error}
                />
                <ErrorMessage error={error} />
            </div>
            <div className="login-modal-button-container">
                <div className="login-modal-two-buttons-on-one-row">
                    <button
                        className="login-modal-correct-input"
                        onClick={() => {
                            dispatch(loginModalButtonClick(LoginModalButton.RESET_PASSWORD));
                        }}
                    >
                        {t('resetPassword')}
                    </button>
                    <button
                        className="login-modal-button-black-on-green"
                        onClick={() => {
                            dispatch(loginModalRemoteRequest(LoginModalCheck.USERNAME_AND_PASSWORD));
                        }}
                    >
                        {t('next')}
                    </button>
                </div>
            </div>
        </>
    );
}
