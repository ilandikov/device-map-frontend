import React from 'react';
import './DeviceLocation.scss';
import { DeviceList } from './DeviceList';
import { LocationAddress } from './LocationAddress';

export function DeviceLocation() {
    return (
        <div className="device-location-window">
            <LocationAddress />
            <DeviceList />
        </div>
    );
}
