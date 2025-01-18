import React from 'react';
import './DeviceMarkerDescription.scss';
import { DeviceList } from './DeviceList';
import { MarkerAddress } from './MarkerAddress';

export function DeviceLocation() {
    return (
        <div className="device-marker-description-window">
            <MarkerAddress />
            <DeviceList />
        </div>
    );
}
