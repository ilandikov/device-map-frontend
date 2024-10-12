import React from 'react';
import { useMapAppState } from './redux/MapAppState';
import { DeviceListItem } from './DeviceListItem';
import './DeviceList.scss';

export function DeviceList() {
    const mapAppState = useMapAppState();
    const selectedMarker = mapAppState.selectedMarker;

    const devicesAtSelectedMarkerLocation = mapAppState.devices
        .filter(
            (device) =>
                device.location.lat === selectedMarker.location.lat &&
                device.location.lng === selectedMarker.location.lng,
        )
        .map((device, index) => <DeviceListItem device={device} key={index} />);

    return <div className="device-list-container">{devicesAtSelectedMarkerLocation}</div>;
}
