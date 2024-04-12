/* External dependencies */
import React from 'react';

/* Local dependencies */
import './MapApp.scss';
import mapImage from '../../../assets/images/GoogleMaps.png';
import { LoginModal } from '../login/LoginModal';
import { MapAppHeader } from './MapAppHeader';
import { ProductDescription } from './ProductDescription';
import { MapAppUsageStep, useMapAppState } from './redux/MapAppState';

export default function MapApp() {
    const mapAppState = useMapAppState();

    const showProductDescription = mapAppState.usageStep === MapAppUsageStep.HOME_SCREEN;
    const showLoginModal = mapAppState.usageStep === MapAppUsageStep.USER_AUTHENTICATION;

    return (
        <div className="map-app-container">
            <MapAppHeader />
            {showProductDescription && <ProductDescription />}
            {showLoginModal && <LoginModal />}
            <img className="map-app-map-image" src={mapImage} alt="map" />
        </div>
    );
}
