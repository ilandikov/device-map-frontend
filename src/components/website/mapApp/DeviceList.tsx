import React from 'react';
import { MapAppUsageStep, useMapAppState } from './redux/MapAppState';
import { DeviceListItem } from './DeviceListItem';
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
            <DeviceListItem
                device={device}
                colorIndex={index}
                showDeleteButton={device.id && device.id === mapAppState.currentUserID}
                key={index}
            />
        ));

    if (mapAppState.usageStep === MapAppUsageStep.DEVICE_MANAGEMENT) {
        const uniqueKeyForCreateDeviceItem = devicesAtSelectedMarkerLocation.length + 1;
        devicesAtSelectedMarkerLocation.push(<CreateDeviceItem key={uniqueKeyForCreateDeviceItem} />);
    }

    return <div className="device-list-container">{devicesAtSelectedMarkerLocation}</div>;
}
