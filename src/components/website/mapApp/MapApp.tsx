/* External dependencies */
import React from 'react';

import './MapApp.scss';
import { LoginModal } from '../login/LoginModal';
import { MapAppHeader } from './MapAppHeader';
import { ProductDescription } from './ProductDescription';
import { MapAppUsageStep, useMapAppState } from './redux/MapAppState';
import 'leaflet/dist/leaflet.css';
import { DeviceMap } from './DeviceMap';
import { DeviceList } from './DeviceList';

export default function MapApp() {
    const mapAppState = useMapAppState();

    const deviceMarkerWasSelected = mapAppState.selectedMarkerLocation;
    const showProductDescription =
        mapAppState.usageStep === MapAppUsageStep.HOME_SCREEN && !mapAppState.selectedMarkerLocation;
    const showLoginModal = mapAppState.usageStep === MapAppUsageStep.USER_AUTHENTICATION;

    return (
        <div className="map-app-container">
            <MapAppHeader />
            {showProductDescription && <ProductDescription />}
            {deviceMarkerWasSelected && <DeviceList />}
            {showLoginModal && <LoginModal />}
            <DeviceMap />
        </div>
    );
}
