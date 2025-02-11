import { useI18next } from 'gatsby-plugin-react-i18next';
import React from 'react';
import { useAppDispatch } from '../../../redux/store';
import { PasswordInputBox } from './PasswordInputBox';
import {
    LoginModalCheck,
    LoginModalInputType,
    loginModalInput,
    loginModalRemoteRequest,
} from './redux/LoginModalAction';

import { useLoginModalAuthentication } from './redux/AuthenticationState';
import { ErrorMessage } from './ErrorMessage';

export function PasswordCreationForm() {
    const { t } = useI18next();
    const dispatch = useAppDispatch();

    const { error, password, passwordRepeat } = useLoginModalAuthentication();

    return (
        <>
            <div className="login-modal-input-container">
                <PasswordInputBox
                    helpText={t('enterPassword')}
                    testId="passwordInput"
                    value={password}
                    onChange={(event) => {
                        dispatch(loginModalInput(LoginModalInputType.PASSWORD, event.target.value));
                    }}
                    error={error}
                />
                <PasswordInputBox
                    helpText={t('repeatPassword')}
                    testId="passwordRepeatInput"
                    value={passwordRepeat}
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
                        dispatch(loginModalRemoteRequest(LoginModalCheck.PASSWORD));
                    }}
                    data-testid="nextButton"
                >
                    {t('next')}
                </button>
            </div>
        </>
    );
}
