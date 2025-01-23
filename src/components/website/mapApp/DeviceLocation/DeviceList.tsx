import React from 'react';
import { MapAppUsageStep, useMapAppState } from '../redux/MapAppState';
import { DeviceItem } from './DeviceItem';
import { CreateDeviceItem } from './CreateDeviceItem';
import './DeviceList.scss';

export function DeviceList() {
    const mapAppState = useMapAppState();
    const selectedMarker = mapAppState.selectedMarker;

    const devicesAtSelectedMarkerLocation = mapAppState.devices
        .filter(
            (device) =>
                device.location.lat === selectedMarker.location.lat &&
                device.location.lon === selectedMarker.location.lon,
        )
        .map((device, index) => (
            <DeviceItem
                device={device}
                isDeviceCreatedByCurrentUser={device.creatorID === mapAppState.currentUserID}
                key={index}
            />
        ));

    if (mapAppState.usageStep === MapAppUsageStep.DEVICE_MANAGEMENT) {
        const uniqueKeyForCreateDeviceItem = devicesAtSelectedMarkerLocation.length + 1;
        devicesAtSelectedMarkerLocation.push(<CreateDeviceItem key={uniqueKeyForCreateDeviceItem} />);
    }

    return <div className="device-list-container">{devicesAtSelectedMarkerLocation}</div>;
}
