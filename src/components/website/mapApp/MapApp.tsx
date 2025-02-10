/* External dependencies */
import React from 'react';

import './MapApp.scss';
import { LoginModal } from '../login/LoginModal';
import { MapAppHeader } from './MapAppHeader';
import { ProductDescription } from './ProductDescription';
import { MapAppUsageStep, useMapAppState } from './redux/MapAppState';
import 'leaflet/dist/leaflet.css';
import { DeviceMap } from './DeviceMap';
import { DeviceLocation } from './DeviceLocation/DeviceLocation';

type ComponentMap = { [key in MapAppUsageStep]: React.ReactElement };

export default function MapApp() {
    const mapAppState = useMapAppState();

    const deviceLocationWasSelected = mapAppState.selectedMarker.location;
    const usageComponent: ComponentMap = {
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
