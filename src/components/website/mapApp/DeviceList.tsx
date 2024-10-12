import React from 'react';
import home from '../../../assets/images/Home.png';
import { useMapAppState } from './redux/MapAppState';
import './DeviceList.scss';
import { DeviceListItem } from './DeviceListItem';

export function DeviceList() {
    const mapAppState = useMapAppState();
    const devices = mapAppState.devices;

    const devicesAtSelectedMarkerLocation = devices.filter((device) => {
        return (
            device.location.lat === mapAppState.selectedMarker.location.lat &&
            device.location.lng === mapAppState.selectedMarker.location.lng
        );
    });

    const deviceListItems = devicesAtSelectedMarkerLocation.map((device) => {
        return <DeviceListItem device={device} />;
    });

    return (
        <div className="devices-list-window">
            <div className="devices-list-address-container">
                <img src={home} className="devices-list-address-image" alt="devices-list-address-image" />
                <div className="devices-address">
                    <p>{mapAppState.selectedMarker.address?.addressLine1 ?? ''}</p>
                    <span>{mapAppState.selectedMarker.address?.addressLine2 ?? ''}</span>
                </div>
            </div>
            <div className="devices-list-container">{deviceListItems}</div>
        </div>
    );
}
