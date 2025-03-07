import React from 'react';
import { useMapAppState } from '../redux/MapAppState';
import { DeviceItem } from './DeviceItem';
import { CreateDeviceItem } from './CreateDeviceItem';
import './DeviceList.scss';
import { DeviceItemWaitingCreation } from './DeviceItemWaitingCreation';

export function DeviceList() {
    const mapAppState = useMapAppState();
    const selectedMarker = mapAppState.selectedMarker;

    const devicesAtSelectedMarkerLocation = mapAppState.devices
        .filter(
            (device) =>
                device.location.lat === selectedMarker.location.lat &&
                device.location.lon === selectedMarker.location.lon,
        )
        .map((device, index) =>
            device.approvals < 0 ? (
                <DeviceItemWaitingCreation key={index} device={device} />
            ) : (
                <DeviceItem device={device} key={index} />
            ),
        );

    const uniqueKeyForCreateDeviceItem = devicesAtSelectedMarkerLocation.length + 1;

    return (
        <div className="device-list-container">
            {devicesAtSelectedMarkerLocation}
            <CreateDeviceItem key={uniqueKeyForCreateDeviceItem} />
        </div>
    );
}
