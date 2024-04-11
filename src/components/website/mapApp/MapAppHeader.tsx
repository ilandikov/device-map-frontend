import { useI18next } from 'gatsby-plugin-react-i18next';
import React from 'react';

import './MapAppHeader.scss';

import LogoGreen from '/src/assets/images/LogoGreen.svg';
import Account from '/src/assets/images/Account.svg';
import GooglePlay from '/src/assets/images/GooglePlay.svg';
import AppStore from '/src/assets/images/AppStore.svg';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../../../redux/store';
import { MapAppUsageStep } from './MapAppReducer';
import { TerminalSearch } from './TerminalSearch';
import { UserPoints } from './UserPoints';
import { mapAppLoginModalOpen } from './redux/actions';

export function MapAppHeader() {
    const { t } = useI18next();
    const useDispatch = useAppDispatch();
    const { usageStep } = useSelector((state: RootState) => state.mapAppState);
    const isUserAuthenticated = usageStep === MapAppUsageStep.AUTHENTICATED_USER;

    return (
        <header className="map-app-header">
            <div className="map-app-header-block-container">
                <div className="map-app-header-block">
                    <img className="map-app-header-brand-logo" src={LogoGreen} alt="logo" />
                    <p className="map-app-header-brand-text">{t('map')}</p>
                </div>
                {isUserAuthenticated && <TerminalSearch className="map-app-header-block" />}
            </div>
            <div className="map-app-header-block-container">
                {isUserAuthenticated && <UserPoints className="map-app-header-block" />}
                <div className="map-app-header-block">
                    <button
                        className="map-app-header-login-button"
                        data-testid="loginButton"
                        onClick={() => {
                            useDispatch(mapAppLoginModalOpen());
                        }}
                    >
                        <img className="map-app-header-account-image" src={Account} alt="login-header-account" />
                        <p className="map-app-header-account-text">{t('loginAction')}</p>
                    </button>
                    <img src={GooglePlay} alt="map-app-header-apps-google-play" />
                    <img src={AppStore} alt="map-app-header-apps-app-store" />
                </div>
            </div>
        </header>
    );
}
