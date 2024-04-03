import React from 'react';
import { useI18next } from 'gatsby-plugin-react-i18next';
import { useAppDispatch } from '../../../redux/store';
import { MailInputBox } from './MailInputBox';
import { PasswordInputBox } from './PasswordInputBox';
import {
    LoginModalInputTypes,
    LoginModalVerifyTypes,
    loginModalButtonClick,
    loginModalInput,
    loginModalVerifyRequest,
} from './redux/actions';

import { useAuthentication } from './redux/state';

export function LogInForm() {
    const { t } = useI18next();
    const dispatch = useAppDispatch();

    const { email, error } = useAuthentication();
    const errorWithoutMessage = error ? new Error() : null;

    return (
        <>
            <div className="login-modal-input-container">
                <MailInputBox
                    helpText={t('onlyEmail')}
                    email={email}
                    onChange={(event) => {
                        dispatch(loginModalInput(LoginModalInputTypes.EMAIL, event.target.value));
                    }}
                    error={errorWithoutMessage}
                />
                <PasswordInputBox
                    helpText={t('enterPassword')}
                    testId="userPasswordLogin"
                    onChange={(event) => {
                        dispatch(loginModalInput(LoginModalInputTypes.PASSWORD, event.target.value));
                    }}
                    error={errorWithoutMessage}
                />
            </div>
            <div className="login-modal-button-container">
                <div className="login-modal-two-buttons-on-one-row">
                    <button
                        className="login-modal-correct-input"
                        onClick={() => {
                            dispatch(loginModalButtonClick('resetPassword'));
                        }}
                    >
                        {t('resetPassword')}
                    </button>
                    <button
                        className="login-modal-button-black-on-green"
                        onClick={() => {
                            dispatch(loginModalVerifyRequest(LoginModalVerifyTypes.EMAIL_AND_PASSWORD));
                        }}
                    >
                        {t('next')}
                    </button>
                </div>
            </div>
        </>
    );
}
