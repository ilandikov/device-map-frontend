import { useI18next } from 'gatsby-plugin-react-i18next';
import React from 'react';
import { useAppDispatch } from '../../../redux/store';
import { MailInputBox } from './MailInputBox';
import {
    LoginModalInputTypes,
    LoginModalRemoteRequestType,
    loginModalButtonClick,
    loginModalInput,
    loginModalRemoteRequest,
} from './redux/LoginModalAction';
import { MailInputError, useLoginModalAuthentication } from './redux/LoginModalAuthenticationState';

export function MailInputForm() {
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
                        dispatch(loginModalInput(LoginModalInputTypes.EMAIL, event.target.value));
                    }}
                    error={error}
                />
            </div>
            <div className="login-modal-button-container">
                {error && error.message === MailInputError.ALREADY_EXISTS && (
                    <button
                        className="login-modal-button-green-on-black"
                        onClick={() => {
                            dispatch(loginModalButtonClick('accountLogin'));
                        }}
                    >
                        {t('accountLogin')}
                    </button>
                )}
                <button
                    className="login-modal-button-black-on-green"
                    onClick={() => {
                        dispatch(loginModalRemoteRequest(LoginModalRemoteRequestType.USERNAME));
                    }}
                >
                    {t('next')}
                </button>
            </div>
        </>
    );
}
