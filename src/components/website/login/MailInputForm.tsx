import { useI18next } from 'gatsby-plugin-react-i18next';
import React from 'react';
import { useAppDispatch } from '../../../redux/store';
import { MailInputBox } from './MailInputBox';
import {
    LoginModalButton,
    LoginModalCheck,
    LoginModalInputType,
    loginModalButtonClick,
    loginModalInput,
    loginModalRemoteRequest,
} from './redux/LoginModalAction';
import { useLoginModalAuthentication } from './redux/AuthenticationState';
import { CognitoErrors } from './redux/cognitoHelpers';
import { ErrorMessage } from './ErrorMessage';

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
                        dispatch(loginModalInput(LoginModalInputType.EMAIL, event.target.value));
                    }}
                    error={error}
                />
                <ErrorMessage error={error} />
            </div>
            <div className="login-modal-button-container">
                {error && error.message === CognitoErrors.USERNAME_EXISTS && (
                    <button
                        className="login-modal-button-green-on-black"
                        onClick={() => {
                            dispatch(loginModalButtonClick(LoginModalButton.ACCOUNT_LOGIN));
                        }}
                    >
                        {t('accountLogin')}
                    </button>
                )}
                <button
                    className="login-modal-button-black-on-green"
                    onClick={() => {
                        dispatch(loginModalRemoteRequest(LoginModalCheck.USERNAME));
                    }}
                >
                    {t('next')}
                </button>
            </div>
        </>
    );
}
