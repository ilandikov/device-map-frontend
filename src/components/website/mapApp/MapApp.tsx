/* External dependencies */
import React from 'react';

import './MapApp.scss';
import { LoginModal } from '../login/LoginModal';
import { MapAppHeader } from './MapAppHeader';
import { ProductDescription } from './ProductDescription';
import { MapAppUsageStep, useMapAppState } from './redux/MapAppState';
import 'leaflet/dist/leaflet.css';
import { DeviceMap } from './DeviceMap';
import { DeviceLocation } from './DeviceLocation';

export default function MapApp() {
    const mapAppState = useMapAppState();

    const deviceMarkerWasSelected = mapAppState.selectedMarker.location;
    const showProductDescription =
        mapAppState.usageStep === MapAppUsageStep.HOME_SCREEN && !mapAppState.selectedMarker.location;
    const showLoginModal = mapAppState.usageStep === MapAppUsageStep.USER_AUTHENTICATION;

    return (
        <div className="map-app-container">
            <MapAppHeader />
            {showProductDescription && <ProductDescription />}
            {deviceMarkerWasSelected && <DeviceLocation />}
            {showLoginModal && <LoginModal />}
            <DeviceMap />
        </div>
    );
}
