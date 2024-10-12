import React, { useEffect } from 'react';
import home from '../../../assets/images/Home.png';
import { useAppDispatch } from '../../../redux/store';
import { useMapAppState } from './redux/MapAppState';
import './DeviceList.scss';
import { DeviceListItem } from './DeviceListItem';
import { mapAppGetLocationAddress } from './redux/MapAppAction';

export function DeviceList() {
    const dispatch = useAppDispatch();

    const mapAppState = useMapAppState();
    const devices = mapAppState.devices;
    const selectedMarker = mapAppState.selectedMarker;

    useEffect(() => {
        dispatch(mapAppGetLocationAddress(selectedMarker.location));
    }, [selectedMarker.location]);

    const devicesAtSelectedMarkerLocation = devices.filter((device) => {
        return (
            device.location.lat === selectedMarker.location.lat && device.location.lng === selectedMarker.location.lng
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
                    <p>{selectedMarker.address?.addressLine1 ?? ''}</p>
                    <span>{selectedMarker.address?.addressLine2 ?? ''}</span>
                </div>
            </div>
            <div className="devices-list-container">{deviceListItems}</div>
        </div>
    );
}
