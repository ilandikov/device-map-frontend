import { useI18next } from 'gatsby-plugin-react-i18next';
import React from 'react';
import { useAppDispatch } from '../../../redux/store';
import { PasswordInputBox } from './PasswordInputBox';
import {
    LoginModalInputType,
    LoginModalRemoteRequestType,
    loginModalInput,
    loginModalRemoteRequest,
} from './redux/LoginModalAction';

import { useLoginModalAuthentication } from './redux/AuthenticationState';
import { ErrorMessage } from './ErrorMessage';

export function PasswordCreationForm() {
    const { t } = useI18next();
    const dispatch = useAppDispatch();

    const { error } = useLoginModalAuthentication();

    return (
        <>
            <div className="login-modal-input-container">
                <PasswordInputBox
                    helpText={t('enterPassword')}
                    testId="userPassword"
                    onChange={(event) => {
                        dispatch(loginModalInput(LoginModalInputType.PASSWORD, event.target.value));
                    }}
                    error={error}
                />
                <PasswordInputBox
                    helpText={t('repeatPassword')}
                    testId="userPasswordRepeat"
                    onChange={(event) => {
                        dispatch(loginModalInput(LoginModalInputType.PASSWORD_REPEAT, event.target.value));
                    }}
                    error={error}
                />
                <ErrorMessage error={error} />
            </div>
            <div className="login-modal-button-container">
                <button
                    className="login-modal-button-black-on-green"
                    onClick={() => {
                        dispatch(loginModalRemoteRequest(LoginModalRemoteRequestType.PASSWORD));
                    }}
                >
                    {t('next')}
                </button>
            </div>
        </>
    );
}
