import React from 'react';
import { useMapAppState } from '../redux/MapAppState';
import { DeviceItem } from './DeviceItem';
import { CreateDeviceItem } from './CreateDeviceItem';
import './DeviceList.scss';
import { DeviceItemWaitingCreation } from './DeviceItemWaitingCreation';
import { CreateAccountOrLoginItem } from './CreateAccountOrLoginItem';

export function DeviceList() {
    const { selectedMarker, devices, loggedInUser } = useMapAppState();

    const devicesAtSelectedMarkerLocation = devices
        .filter(
            (device) =>
                device.location.lat === selectedMarker.location.lat &&
                device.location.lon === selectedMarker.location.lon,
        )
        .map((device, index) =>
            device.approvals >= 0 ? (
                <DeviceItem device={device} key={index} />
            ) : (
                <DeviceItemWaitingCreation device={device} key={index} />
            ),
        );

    const uniqueKeyForCreateDeviceItem = devicesAtSelectedMarkerLocation.length + 1;

    return (
        <div className="device-list-container">
            {devicesAtSelectedMarkerLocation}
            {loggedInUser ? <CreateDeviceItem key={uniqueKeyForCreateDeviceItem} /> : <CreateAccountOrLoginItem />}
        </div>
    );
}
