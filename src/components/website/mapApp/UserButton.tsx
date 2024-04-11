import { useI18next } from 'gatsby-plugin-react-i18next';
import React from 'react';
import { useAppDispatch } from '../../../redux/store';
import { mapAppLoginModalOpen } from './redux/actions';
import Account from '/src/assets/images/Account.svg';

export function UserButton() {
    const { t } = useI18next();
    const useDispatch = useAppDispatch();

    return (
        <button
            className="map-app-header-user-button"
            data-testid="loginButton"
            onClick={() => {
                useDispatch(mapAppLoginModalOpen());
            }}
        >
            <img className="map-app-header-account-image" src={Account} alt="login-header-account" />
            <p className="map-app-header-account-text">{t('loginAction')}</p>
        </button>
    );
}
