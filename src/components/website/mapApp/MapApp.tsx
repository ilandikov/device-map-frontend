/* External dependencies */
import React from 'react';

import './MapApp.scss';
import { ComponentMap } from '../common/ComponentMap';
import { LoginModal } from '../login/LoginModal';
import { MapAppHeader } from './MapAppHeader';
import { ProductDescription } from './ProductDescription';
import { MapAppComponents, useMapAppState } from './redux/MapAppState';
import 'leaflet/dist/leaflet.css';
import { DeviceMap } from './DeviceMap';
import { DeviceLocation } from './DeviceLocation/DeviceLocation';

export default function MapApp() {
    const mapAppState = useMapAppState();

    const deviceLocationWasSelected = mapAppState.selectedMarker.location;
    const mainComponents: ComponentMap<MapAppComponents> = {
        PRODUCT_DESCRIPTION: !deviceLocationWasSelected && <ProductDescription />,
        LOGIN_MODAL: <LoginModal />,
        DEVICE_LOCATION: deviceLocationWasSelected && <DeviceLocation />,
    };

    return (
        <div className="map-app-container">
            <MapAppHeader />
            {mainComponents[mapAppState.component]}
            <DeviceMap />
        </div>
    );
}
