import { useI18next } from 'gatsby-plugin-react-i18next';
import React from 'react';
import { useAppDispatch } from '../../../redux/store';
import { AuthenticationStep, useAuthentication } from '../login/redux/state';
import { mapAppUserButtonClick } from './redux/actions';
import Account from '/src/assets/images/Account.svg';

export function UserButton() {
    const { step } = useAuthentication();
    const isUserLoggedIn = step === AuthenticationStep.LOGGED_IN;

    if (isUserLoggedIn) {
        return <LogoutButton />;
    }

    return <LoginButton />;
}

function LogoutButton() {
    const useDispatch = useAppDispatch();
    const { email } = useAuthentication();

    return (
        <button
            className="map-app-header-user-button"
            data-testid="loginButton"
            onClick={() => {
                useDispatch(mapAppUserButtonClick());
            }}
        >
            <img className="map-app-header-account-image" src={Account} alt="login-header-account" />
            <p className="map-app-header-account-text">{email}</p>
        </button>
    );
}

function LoginButton() {
    const { t } = useI18next();
    const useDispatch = useAppDispatch();

    return (
        <button
            className="map-app-header-user-button"
            data-testid="loginButton"
            onClick={() => {
                useDispatch(mapAppUserButtonClick());
            }}
        >
            <img className="map-app-header-account-image" src={Account} alt="login-header-account" />
            <p className="map-app-header-account-text">{t('loginAction')}</p>
        </button>
    );
}
