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

    return (
        <div className="map-app-container">
            <MapAppHeader />
            {mapAppState.usageStep === MapAppUsageStep.HOME_SCREEN && <ProductDescription />}
            {mapAppState.usageStep === MapAppUsageStep.USER_AUTHENTICATION && <LoginModal />}
            <img className="map-app-map-image" src={mapImage} alt="map" />
        </div>
    );
}
