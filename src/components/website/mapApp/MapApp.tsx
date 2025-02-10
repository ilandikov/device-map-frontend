/* External dependencies */
import React from 'react';

import './MapApp.scss';
import { ComponentMap } from '../common/ComponentMap';
import { LoginModal } from '../login/LoginModal';
import { MapAppHeader } from './MapAppHeader';
import { ProductDescription } from './ProductDescription';
import { MapAppUsageStep, useMapAppState } from './redux/MapAppState';
import 'leaflet/dist/leaflet.css';
import { DeviceMap } from './DeviceMap';
import { DeviceLocation } from './DeviceLocation/DeviceLocation';

export default function MapApp() {
    const mapAppState = useMapAppState();

    const deviceLocationWasSelected = mapAppState.selectedMarker.location;
    const usageComponent: ComponentMap<MapAppUsageStep> = {
        HOME_SCREEN: !deviceLocationWasSelected && <ProductDescription />,
        USER_AUTHENTICATION: <LoginModal />,
        DEVICE_MANAGEMENT: deviceLocationWasSelected && <DeviceLocation />,
    };

    return (
        <div className="map-app-container">
            <MapAppHeader />
            {usageComponent[mapAppState.usageStep]}
            <DeviceMap />
        </div>
    );
}
