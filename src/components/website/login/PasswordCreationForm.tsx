import { useI18next } from 'gatsby-plugin-react-i18next';
import React from 'react';
import { useAppDispatch } from '../../../redux/store';
import { PasswordInputBox } from './PasswordInputBox';
import { LoginModalInputTypes, LoginModalVerifyTypes, loginModalInput, loginModalVerifyRequest } from './redux/actions';

import { useAuthentication } from './redux/state';

export function PasswordCreationForm() {
    const { t } = useI18next();
    const dispatch = useAppDispatch();

    const { emailError } = useAuthentication();
    const passwordError = emailError;

    return (
        <>
            <div className="login-modal-input-container">
                <PasswordInputBox
                    helpText={t('enterPassword')}
                    testId="userPassword"
                    onChange={(event) => {
                        dispatch(loginModalInput(LoginModalInputTypes.USER_PASSWORD, event.target.value));
                    }}
                    error={passwordError}
                />
                <PasswordInputBox
                    helpText={t('repeatPassword')}
                    testId="userPasswordRepeat"
                    onChange={(event) => {
                        dispatch(loginModalInput(LoginModalInputTypes.USER_PASSWORD_REPEAT, event.target.value));
                    }}
                    error={passwordError}
                />
            </div>
            <div className="login-modal-button-container">
                <button
                    className="login-modal-button-black-on-green"
                    onClick={() => {
                        dispatch(loginModalVerifyRequest(LoginModalVerifyTypes.USER_PASSWORD));
                    }}
                >
                    {t('next')}
                </button>
            </div>
        </>
    );
}
