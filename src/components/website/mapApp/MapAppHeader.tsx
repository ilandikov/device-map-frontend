import { useI18next } from 'gatsby-plugin-react-i18next';
import React from 'react';

import './MapAppHeader.scss';

import LogoGreen from '/src/assets/images/LogoGreen.svg';
import GooglePlay from '/src/assets/images/GooglePlay.svg';
import AppStore from '/src/assets/images/AppStore.svg';
import { AuthenticationStep, useAuthentication } from '../login/redux/state';
import { TerminalSearch } from './TerminalSearch';
import { UserPoints } from './UserPoints';
import { LoginButton, LogoutButton } from './UserButton';

export function MapAppHeader() {
    const { t } = useI18next();

    const { step } = useAuthentication();
    const isUserLoggedIn = step === AuthenticationStep.LOGGED_IN;

    return (
        <header className="map-app-header">
            <div className="map-app-header-block-container">
                <div className="map-app-header-block">
                    <img className="map-app-header-brand-logo" src={LogoGreen} alt="logo" />
                    <p className="map-app-header-brand-text">{t('map')}</p>
                </div>
                {isUserLoggedIn && <TerminalSearch className="map-app-header-block" />}
            </div>
            <div className="map-app-header-block-container">
                {isUserLoggedIn && <UserPoints className="map-app-header-block" />}
                <div className="map-app-header-block">
                    {isUserLoggedIn ? <LogoutButton /> : <LoginButton />}
                    <img src={GooglePlay} alt="map-app-header-apps-google-play" />
                    <img src={AppStore} alt="map-app-header-apps-app-store" />
                </div>
            </div>
        </header>
    );
}
