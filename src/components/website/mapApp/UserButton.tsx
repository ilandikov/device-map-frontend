import { useI18next } from 'gatsby-plugin-react-i18next';
import React from 'react';
import { useAppDispatch } from '../../../redux/store';
import { AuthenticationStep, useAuthentication } from '../login/redux/state';
import { mapAppUserButtonClick } from './redux/actions';
import Account from '/src/assets/images/Account.svg';

export function UserButton() {
    const { t } = useI18next();
    const useDispatch = useAppDispatch();

    const { step, email } = useAuthentication();
    const isUserLoggedIn = step === AuthenticationStep.LOGGED_IN;

    const userButtonText = isUserLoggedIn ? email : t('loginAction');

    return (
        <button
            className="map-app-header-user-button"
            data-testid="loginButton"
            onClick={() => {
                useDispatch(mapAppUserButtonClick());
            }}
        >
            <img className="map-app-header-account-image" src={Account} alt="login-header-account" />
            <p className="map-app-header-account-text">{userButtonText}</p>
        </button>
    );
}
