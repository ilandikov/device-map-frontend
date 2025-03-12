import React from 'react';
import { useMapAppState } from '../redux/MapAppState';
import { DeviceItem } from './DeviceItem';
import { CreateDeviceItem } from './CreateDeviceItem';
import './DeviceList.scss';
import { DeviceItemWaitingCreation } from './DeviceItemWaitingCreation';
import { CreateAccountOrLoginItem } from './CreateAccountOrLoginItem';

export function DeviceList() {
    const { selectedMarker, devices, loggedInUser, isDeviceCreationOngoing } = useMapAppState();

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
            {isDeviceCreationOngoing && <DeviceItemWaitingCreation key={uniqueKeyForCreateDeviceItem + 1} />}
            {loggedInUser ? (
                <CreateDeviceItem key={uniqueKeyForCreateDeviceItem} />
            ) : (
                <CreateAccountOrLoginItem key={uniqueKeyForCreateDeviceItem} />
            )}
        </div>
    );
}
