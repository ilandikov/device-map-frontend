import { useI18next } from 'gatsby-plugin-react-i18next';
import React from 'react';
import { useAppDispatch } from '../../../redux/store';
import { MailInputBox } from './MailInputBox';
import {
    LoginModalInputTypes,
    LoginModalVerifyTypes,
    loginModalButtonClick,
    loginModalInput,
    loginModalVerifyRequest,
} from './redux/actions';
import { MailInputError, useAuthentication } from './redux/state';

export function MailInputForm() {
    const { t } = useI18next();
    const dispatch = useAppDispatch();

    const loginModalState = useAuthentication();
    const mailInputError = loginModalState.userEmailError;
    const userEmail = loginModalState.userEmail;

    return (
        <>
            <div className="login-modal-input-container">
                <MailInputBox
                    helpText={t('onlyEmail')}
                    userEmail={userEmail}
                    onChange={(event) => {
                        dispatch(loginModalInput(LoginModalInputTypes.USER_EMAIL, event.target.value));
                    }}
                    error={mailInputError}
                />
            </div>
            <div className="login-modal-button-container">
                {mailInputError && mailInputError.message === MailInputError.ALREADY_EXISTS && (
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
                        dispatch(loginModalVerifyRequest(LoginModalVerifyTypes.USER_EMAIL));
                    }}
                >
                    {t('next')}
                </button>
            </div>
        </>
    );
}
