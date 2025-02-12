import { useI18next } from 'gatsby-plugin-react-i18next';
import React from 'react';
import { useAppDispatch } from '../../../redux/store';
import { LoginModalButton, loginModalButtonClick } from './redux/LoginModalAction';

export function WelcomeForm() {
    const { t } = useI18next();
    const dispatch = useAppDispatch();

    return (
        <>
            <div className="login-modal-input-container"></div>
            <div className="login-modal-button-container">
                <button
                    className="login-modal-button-black-on-green"
                    onClick={() => {
                        dispatch(loginModalButtonClick(LoginModalButton.ACCOUNT_LOGIN));
                    }}
                    data-testid="loginButton"
                >
                    {t('accountLogin')}
                </button>
                <button
                    className="login-modal-button-green-on-black"
                    onClick={() => {
                        dispatch(loginModalButtonClick(LoginModalButton.ACCOUNT_REGISTER));
                    }}
                    data-testid="registerButton"
                >
                    {t('accountRegister')}
                </button>
            </div>
        </>
    );
}
