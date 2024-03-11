/* External dependencies */
import React from 'react';
import { useI18next } from 'gatsby-plugin-react-i18next';

/* Local dependencies */
import './MapApp.scss';
import mapImage from '../../../assets/images/GoogleMaps.png';
import phoneCut from '../../../assets/images/Phone_Cut.png';
import { LoginModal } from '../login/LoginModal';
import { MapAppHeader } from './MapAppHeader';

export default function MapApp() {
    const { t } = useI18next();
    return (
        <div className="map-app-container">
            <MapAppHeader />
            <div className="map-app-product-description">
                <div className="map-app-product-description-shadow" />
                <div className="map-app-product-description-container">
                    <div className="map-app-product-description-text">
                        <h1>{`${t('brand')} ${t('map')}`}</h1>
                        <p>{t('loginCallToAction')}</p>
                    </div>
                    <img src={phoneCut} alt="map-app-description-image" />
                </div>
            </div>
            <LoginModal />
            <img className="map-app-map-image" src={mapImage} alt="map" />
        </div>
    );
}
