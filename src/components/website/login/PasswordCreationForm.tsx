import { useI18next } from 'gatsby-plugin-react-i18next';
import React from 'react';
import { useAppDispatch } from '../../../redux/store';
import { PasswordInputBox } from './PasswordInputBox';
import { LoginModalInputTypes, LoginModalVerifyTypes, loginModalInput, loginModalVerifyRequest } from './redux/actions';

import { useLoginModalState } from './redux/state';

export function PasswordCreationForm() {
    const { t } = useI18next();
    const dispatch = useAppDispatch();

    const passwordInputError = useLoginModalState().userPasswordError;

    return (
        <>
            <div className="login-modal-input-container">
                <PasswordInputBox
                    helpText={t('enterPassword')}
                    testId="userPassword"
                    onChange={(event) => {
                        dispatch(loginModalInput(LoginModalInputTypes.USER_PASSWORD, event.target.value));
                    }}
                    error={passwordInputError}
                />
                <PasswordInputBox
                    helpText={t('repeatPassword')}
                    testId="userPasswordRepeat"
                    onChange={(event) => {
                        dispatch(loginModalInput(LoginModalInputTypes.USER_PASSWORD_REPEAT, event.target.value));
                    }}
                    error={passwordInputError}
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
