import React from 'react';
import { useMapAppState } from '../redux/MapAppState';
import { DeviceItem } from './DeviceItem';
import './DeviceList.scss';
import { ExtraItem } from './ExtraItem';

export function DeviceList() {
    const { selectedMarker, devices } = useMapAppState();

    const devicesAtSelectedMarkerLocation = devices
        .filter(
            (device) =>
                device.location.lat === selectedMarker.location.lat &&
                device.location.lon === selectedMarker.location.lon,
        )
        .map((device, index) => <DeviceItem device={device} key={index} />);

    const uniqueKeyForCreateDeviceItem = devicesAtSelectedMarkerLocation.length + 1;

    return (
        <div className="device-list-container">
            {devicesAtSelectedMarkerLocation}
            <ExtraItem key={uniqueKeyForCreateDeviceItem} />
        </div>
    );
}
