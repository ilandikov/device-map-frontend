import React from 'react';
import './DeviceMarkerDescription.scss';
import { DeviceList } from './DeviceList';
import { LocationAddress } from './LocationAddress';

export function DeviceLocation() {
    return (
        <div className="device-marker-description-window">
            <LocationAddress />
            <DeviceList />
        </div>
    );
}
